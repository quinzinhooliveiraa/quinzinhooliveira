import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Use individual PG* env vars (secrets injected per environment by Replit:
//   dev  → PGHOST=helium (local DB)
//   prod → PGHOST=<neon cloud> (production DB))
// Fall back to DATABASE_URL / NEON_DATABASE if PG* vars aren't available.

const pgHost = process.env.PGHOST;
const isLocal = !pgHost || pgHost === "helium" || pgHost === "localhost" || pgHost === "127.0.0.1";

export const pool = pgHost
  ? new Pool({
      host: pgHost,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    })
  : new Pool({
      connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE,
      ssl: /neon\.tech|supabase\.co/.test(process.env.DATABASE_URL || process.env.NEON_DATABASE || "")
        ? { rejectUnauthorized: false }
        : false,
    });

console.log(`[db] connecting to ${pgHost ?? "DATABASE_URL"} (ssl=${!isLocal})`);

export const db = drizzle(pool, { schema });
