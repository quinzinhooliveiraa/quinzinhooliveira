import type { Config } from "drizzle-kit";

export default {
  schema: "./server/schema.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NEON_DATABASE || "",
  },
} satisfies Config;
