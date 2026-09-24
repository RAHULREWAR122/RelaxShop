import { NextResponse } from "next/server";
import { DbUnavailableError } from "./db";

const isDev = process.env.NODE_ENV !== "production";

export function ok(result, status = 200) {
  return NextResponse.json({ success: true, status, result }, { status });
}

export function fail(message, status = 400) {
  return NextResponse.json({ success: false, status, result: message }, { status });
}

export class ConfigError extends Error {}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Wraps a route handler so thrown HttpErrors become JSON responses.
export function handle(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof HttpError) return fail(err.message, err.status);
      if (err?.name === "CastError") return fail("Not found", 404);
      console.error(err);
      // Configuration problems: spell out the fix in development only.
      if (err instanceof DbUnavailableError || err instanceof ConfigError) {
        return fail(isDev ? err.message : "The store is temporarily unavailable. Please try again shortly.", 503);
      }
      return fail("Something went wrong, please try again shortly.", 500);
    }
  };
}

export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, "Invalid request body");
  }
}
