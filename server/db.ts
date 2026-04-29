import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL env var");
}

const useSsl = /sslmode=require|neon\.tech|supabase\.co/.test(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });
