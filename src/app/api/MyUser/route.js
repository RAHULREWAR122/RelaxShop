import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { requireUser } from "@/lib/server/auth";
import { findUserByEmail, publicUser } from "@/lib/server/users";

async function currentProfile(auth) {
  await connectDB();
  const user = await findUserByEmail(auth.email);
  return user ? ok(publicUser(user)) : fail("Account not found", 404);
}

export const GET = handle(async (req) => currentProfile(requireUser(req)));

// Kept for clients that send the token in the body.
export const POST = handle(async (req) => {
  const body = await readJson(req);
  return currentProfile(requireUser(req, body));
});

export const PUT = handle(async (req) => {
  const body = await readJson(req);
  const auth = requireUser(req, body);

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const pinCode = String(body.pinCode ?? "").trim();
  if (name.length < 2) return fail("Please enter your name.", 400);
  if (phone && !/^\d{10}$/.test(phone)) return fail("Phone number should be 10 digits.", 400);
  if (pinCode && !/^\d{6}$/.test(pinCode)) return fail("PIN code should be 6 digits.", 400);

  await connectDB();
  // The email always comes from the verified token, never from the request body.
  const user = await findUserByEmail(auth.email);
  if (!user) return fail("Account not found", 404);
  Object.assign(user, { name, phone, pinCode });
  await user.save();
  return ok(publicUser(user));
});
