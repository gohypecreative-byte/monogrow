import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "surishekhar17@gmail.com",
  password: process.env.ADMIN_PASSWORD || "Monagrow@123",
  role: "Super Admin",
  name: "Suri Shekhar",
};

const SESSION_COOKIE_NAME = "monagrow_admin_token";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "monagrow_super_secure_admin_secret_2026";

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  exp: number;
}

export function createSessionToken(email: string): string {
  const payload = {
    email,
    name: ADMIN_CREDENTIALS.name,
    role: ADMIN_CREDENTIALS.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(str).digest("base64url");
  return `${str}.${sig}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    const [str, sig] = token.split(".");
    if (!str || !sig) return null;
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(str).digest("base64url");
    if (sig !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(str, "base64url").toString("utf8")) as AdminSession;
    if (payload.exp < Date.now()) return null;
    if (payload.email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email.trim().toLowerCase()) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
