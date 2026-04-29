import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.NEON_DATABASE || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Missing NEON_DATABASE env var");

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

console.log(`[db] connecting to Neon`);

export const db = drizzle(pool, { schema });
