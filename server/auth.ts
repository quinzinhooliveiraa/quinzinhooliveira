import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { admins } from "./schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.AUTH_SECRET || process.env.NEON_DATABASE || "dev-secret-please-change";
const COOKIE_NAME = "qo_session";
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export interface AdminSession {
  adminId: string;
  email: string;
  isMaster: boolean;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signSession(payload: AdminSession): string {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function readSession(req: Request): AdminSession | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = readSession(req);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  (req as any).admin = session;
  next();
}

export async function bootstrapMasterAdmin() {
  const email = (process.env.MASTER_ADMIN_EMAIL || "quinzinhooliveiraa@gmail.com").toLowerCase();
  const password = process.env.MASTER_ADMIN_PASSWORD;

  const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (existing.length === 0) {
    const passwordHash = password ? await hashPassword(password) : null;
    await db.insert(admins).values({ email, passwordHash, isMaster: true });
    console.log(`[auth] Master admin bootstrap: ${email}${password ? "" : " (no password yet — use forgot password)"}`);
  } else if (!existing[0].isMaster) {
    await db.update(admins).set({ isMaster: true }).where(eq(admins.id, existing[0].id));
  }
}
