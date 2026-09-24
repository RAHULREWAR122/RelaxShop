"use client";
import { getToken, clearSession } from "./session";

// Small fetch wrapper for the app's own API. Always resolves to the API's
// `{ success, result }` shape so callers never need try/catch.
export async function api(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  try {
    const res = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (res.status === 401 && token) clearSession();
    if (data && typeof data.success === "boolean") return data;
    return { success: res.ok, result: res.ok ? data : "Something went wrong, please try again." };
  } catch {
    return { success: false, result: "Can't reach the server. Check your connection and try again." };
  }
}
