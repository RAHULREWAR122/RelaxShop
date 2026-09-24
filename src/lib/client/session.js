"use client";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const USER_KEY = "myUser";

function storage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return storage()?.getItem(TOKEN_KEY) || null;
}

// Decodes the stored token; returns null when missing, malformed or expired.
export function readSession() {
  const token = getToken();
  if (!token) return null;
  try {
    const claims = jwtDecode(token);
    if (!claims?.exp || claims.exp * 1000 <= Date.now()) return null;
    return { token, email: claims.email, name: claims.name, role: claims.role || "user", exp: claims.exp };
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  const s = storage();
  if (!s) return;
  s.setItem(TOKEN_KEY, token);
  if (user) s.setItem(USER_KEY, JSON.stringify(user));
  s.removeItem("adminToken");
  window.dispatchEvent(new Event("relax:session"));
}

export function clearSession() {
  const s = storage();
  if (!s) return;
  s.removeItem(TOKEN_KEY);
  s.removeItem(USER_KEY);
  s.removeItem("adminToken");
  window.dispatchEvent(new Event("relax:session"));
}
