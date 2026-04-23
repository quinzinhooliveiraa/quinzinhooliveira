import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.NEON_DATABASE || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing NEON_DATABASE or DATABASE_URL env var");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
