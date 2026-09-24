import jwt from "jsonwebtoken";
import { HttpError, ConfigError } from "./respond";

const WEEK = 7 * 24 * 60 * 60;

export function signToken(payload, expiresIn = WEEK) {
  if (!process.env.JWT_SECRET) throw new ConfigError("JWT_SECRET is not set. Add it to .env.local and restart the server.");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function tokenFrom(req, body) {
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return body?.token || null;
}

// Returns the decoded token or null. `body` is optional, for clients
// that send the token in the JSON payload.
export function getAuth(req, body) {
  const token = tokenFrom(req, body);
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireUser(req, body) {
  const auth = getAuth(req, body);
  if (!auth?.email || auth.purpose) throw new HttpError(401, "Please sign in to continue.");
  return auth;
}

export function requireAdmin(req, body) {
  const auth = getAuth(req, body);
  if (auth?.role !== "admin") throw new HttpError(403, "Admin access required.");
  return auth;
}

export function isAdminLogin(email, password) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD);
}
