import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { signToken, isAdminLogin } from "@/lib/server/auth";
import { verifyPassword, hashPassword } from "@/lib/server/password";
import { findUserByEmail, normalizeEmail, publicUser } from "@/lib/server/users";

export const POST = handle(async (req) => {
  const { email, password } = await readJson(req);
  if (!email || !password) return fail("Email and password are required.", 400);

  if (isAdminLogin(normalizeEmail(email), password)) {
    const token = signToken({ email: normalizeEmail(email), name: "Admin", role: "admin" }, "12h");
    return ok({ token, role: "admin", myUser: { email: normalizeEmail(email), name: "Admin" } });
  }

  await connectDB();
  const user = await findUserByEmail(email, true);
  const { ok: valid, needsRehash } = verifyPassword(user?.password, password);

  // Same message for unknown email and wrong password, so accounts can't be enumerated.
  if (!user || !valid) return fail("Incorrect email or password.", 401);

  if (needsRehash) {
    user.password = hashPassword(password);
    await user.save();
  }

  const token = signToken({ email: user.email, name: user.name, role: "user" });
  return ok({ token, role: "user", myUser: publicUser(user) });
});
