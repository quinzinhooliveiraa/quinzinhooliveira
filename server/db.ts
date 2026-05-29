import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE;
if (!connectionString) throw new Error("Missing DATABASE_URL env var");

const isNeon = connectionString.includes("neon.tech") || connectionString.includes("neondb");

export const pool = new Pool({
  connectionString,
  ...(isNeon ? { ssl: { rejectUnauthorized: false } } : {}),
});

console.log(`[db] connecting to ${isNeon ? "Neon" : "PostgreSQL"}`);

export const db = drizzle(pool, { schema });
