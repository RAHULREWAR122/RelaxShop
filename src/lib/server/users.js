import { User } from "@/app/MongoDb/User";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// Older accounts may have been stored with mixed-case emails.
export function findUserByEmail(email, withPassword = false) {
  const raw = String(email || "").trim();
  const query = User.findOne({ email: { $in: [raw, raw.toLowerCase()] } });
  return withPassword ? query.select("+password") : query;
}

export function publicUser(user) {
  if (!user) return null;
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    pinCode: user.pinCode || "",
  };
}
