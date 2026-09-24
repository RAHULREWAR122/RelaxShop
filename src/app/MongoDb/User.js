import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  // Never returned by default; queries that need it must `.select("+password")`.
  password: { type: String, required: true, select: false },
  pinCode: { type: String, default: "" },
  phone: { type: String, default: "" },
});

export const User = mongoose.models.users || mongoose.model("users", UserSchema);
