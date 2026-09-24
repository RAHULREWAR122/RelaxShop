import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { requireAdmin } from "@/lib/server/auth";
import { hashPassword } from "@/lib/server/password";
import { findUserByEmail, normalizeEmail, publicUser } from "@/lib/server/users";
import { User } from "@/app/MongoDb/User";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Admin: list customers (passwords are never selected).
export const GET = handle(async (req) => {
  requireAdmin(req);
  await connectDB();
  const users = await User.find().sort({ _id: -1 });
  return ok(users.map(publicUser));
});

// Sign up.
export const POST = handle(async (req) => {
  const { name, email, password } = await readJson(req);
  const cleanName = String(name || "").trim();
  const cleanEmail = normalizeEmail(email);

  if (cleanName.length < 2) return fail("Please enter your name.", 400);
  if (!EMAIL_RE.test(cleanEmail)) return fail("Please enter a valid email address.", 400);
  if (typeof password !== "string" || password.length < 6) {
    return fail("Password must be at least 6 characters.", 400);
  }

  await connectDB();
  if (await findUserByEmail(cleanEmail)) {
    return fail("An account with this email already exists. Please sign in.", 409);
  }

  const user = await User.create({ name: cleanName, email: cleanEmail, password: hashPassword(password) });
  return ok(publicUser(user), 201);
});
