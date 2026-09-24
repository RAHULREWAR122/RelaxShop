import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { requireUser } from "@/lib/server/auth";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import { findUserByEmail } from "@/lib/server/users";

export const PUT = handle(async (req) => {
  const body = await readJson(req);
  const auth = requireUser(req, body);
  const { password, nwPassword, cPassword } = body;

  if (typeof nwPassword !== "string" || nwPassword.length < 6) {
    return fail("New password must be at least 6 characters.", 400);
  }
  if (nwPassword !== cPassword) return fail("New passwords do not match.", 400);

  await connectDB();
  const user = await findUserByEmail(auth.email, true);
  if (!user) return fail("Account not found", 404);
  if (!verifyPassword(user.password, password).ok) return fail("Your current password is incorrect.", 400);

  user.password = hashPassword(nwPassword);
  await user.save();
  return ok("Password updated");
});
