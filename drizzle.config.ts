import type { Config } from "drizzle-kit";

export default {
  schema: "./server/schema.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE || process.env.DATABASE_URL || "",
    ssl: { rejectUnauthorized: false },
  },
} satisfies Config;
