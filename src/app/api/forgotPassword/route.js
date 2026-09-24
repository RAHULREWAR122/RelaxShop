import crypto from "crypto";
import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { hashPassword } from "@/lib/server/password";
import { findUserByEmail } from "@/lib/server/users";
import { ResetPassword } from "@/app/MongoDb/resetPassword";

const TTL_MINUTES = 15;
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

// Step 1: look up the account by email and hand back a short-lived, one-time
// reset token, which the page uses to open the "new password" step directly.
// No email is sent, so anyone who knows an address can reset it.
export const POST = handle(async (req) => {
  const { email } = await readJson(req);
  if (!email) return fail("Please enter your email.", 400);

  await connectDB();
  const user = await findUserByEmail(email);
  if (!user) return fail("We couldn't find an account with that email.", 404);

  const token = crypto.randomBytes(32).toString("hex");
  await ResetPassword.findOneAndUpdate(
    { email: user.email },
    { email: user.email, tokenHash: sha256(token), expiresAt: new Date(Date.now() + TTL_MINUTES * 60_000) },
    { upsert: true }
  );

  return ok({ token, name: user.name });
});

// Step 2: set the new password with that token. Each token works once.
export const PUT = handle(async (req) => {
  const { token, password, cPassword } = await readJson(req);
  if (typeof password !== "string" || password.length < 6) {
    return fail("Password must be at least 6 characters.", 400);
  }
  if (password !== cPassword) return fail("Passwords do not match.", 400);
  if (!token) return fail("This reset link is invalid.", 400);

  await connectDB();
  const record = await ResetPassword.findOne({ tokenHash: sha256(String(token)) });
  if (!record || record.expiresAt < new Date()) {
    return fail("This reset link has expired. Please start again.", 400);
  }

  const user = await findUserByEmail(record.email, true);
  if (!user) return fail("Account not found", 404);
  user.password = hashPassword(password);
  await user.save();
  await ResetPassword.deleteOne({ _id: record._id });
  return ok("Password reset");
});
