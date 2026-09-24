import { connectDB } from "@/lib/server/db";
import { ok, fail, handle, readJson } from "@/lib/server/respond";
import { requireAdmin } from "@/lib/server/auth";
import { publicUser } from "@/lib/server/users";
import { User } from "@/app/MongoDb/User";

const EDITABLE = ["name", "phone", "pinCode"];

export const GET = handle(async (req, { params }) => {
  requireAdmin(req);
  await connectDB();
  const user = await User.findById(params.userUpdate);
  return user ? ok(publicUser(user)) : fail("User not found", 404);
});

export const PUT = handle(async (req, { params }) => {
  requireAdmin(req);
  const body = await readJson(req);
  const update = Object.fromEntries(EDITABLE.filter((k) => k in body).map((k) => [k, String(body[k])]));
  await connectDB();
  const user = await User.findByIdAndUpdate(params.userUpdate, update, { new: true });
  return user ? ok(publicUser(user)) : fail("User not found", 404);
});

export const DELETE = handle(async (req, { params }) => {
  requireAdmin(req);
  await connectDB();
  const { deletedCount } = await User.deleteOne({ _id: params.userUpdate });
  return deletedCount ? ok("Deleted") : fail("User not found", 404);
});
