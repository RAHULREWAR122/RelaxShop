import mongoose from "mongoose";

const ForgotPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // SHA-256 of the token emailed to the user; the raw token is never stored.
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const ResetPassword = mongoose.models.forgot || mongoose.model("forgot", ForgotPasswordSchema);
