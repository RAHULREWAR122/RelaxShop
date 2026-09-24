import mongoose from "mongoose";

// Thrown when the database is not configured or can't be reached, so routes
// can answer with a clear 503 instead of a generic error.
export class DbUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "DbUnavailableError";
  }
}

// Reuse one connection across hot reloads and route invocations.
const cached = globalThis.__mongoose || (globalThis.__mongoose = { conn: null, promise: null });

export async function connectDB() {
  const { MONGO_URL } = process.env;
  if (!MONGO_URL) {
    throw new DbUnavailableError("MONGO_URL is not set. Add it to .env.local and restart the server.");
  }
  // If MONGO_URL changed (e.g. .env.local edited while the dev server runs),
  // drop the old connection instead of silently reusing the wrong database.
  if ((cached.conn || cached.promise) && cached.url !== MONGO_URL) {
    await mongoose.disconnect().catch(() => {});
    cached.conn = null;
    cached.promise = null;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.url = MONGO_URL;
    cached.promise = mongoose
      .connect(MONGO_URL, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        cached.promise = null;
        throw new DbUnavailableError(`Could not connect to MongoDB: ${err.message}`);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
