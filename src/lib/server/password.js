import crypto from "crypto";
import CryptoJS from "crypto-js";

const PREFIX = "scrypt";

export function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(plain, salt, 64).toString("hex");
  return `${PREFIX}$${salt}$${hash}`;
}

// Returns { ok, needsRehash }. Accounts created before the switch to scrypt
// store AES-encrypted passwords; those still verify and get upgraded on login.
export function verifyPassword(stored, plain) {
  if (!stored || typeof plain !== "string") return { ok: false, needsRehash: false };

  if (stored.startsWith(`${PREFIX}$`)) {
    const [, salt, hash] = stored.split("$");
    const expected = Buffer.from(hash, "hex");
    const actual = crypto.scryptSync(plain, salt, expected.length);
    return { ok: crypto.timingSafeEqual(expected, actual), needsRehash: false };
  }

  if (!process.env.ENCRYPTION_KEY) return { ok: false, needsRehash: false };
  try {
    const legacy = CryptoJS.AES.decrypt(stored, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    const ok = legacy.length > 0 && legacy === plain;
    return { ok, needsRehash: ok };
  } catch {
    return { ok: false, needsRehash: false };
  }
}
