import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.NEON_DATABASE;
if (!connectionString) {
  throw new Error("Missing NEON_DATABASE env var (this app uses Neon Postgres exclusively)");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
