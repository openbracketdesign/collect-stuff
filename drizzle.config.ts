import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";

// Drizzle Kit runs outside Next; load the same env files (pnpm does not hoist @next/env).
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
