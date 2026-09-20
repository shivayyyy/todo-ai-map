import { defineConfig } from "drizzle-kit";

// A placeholder lets `drizzle-kit generate` run before production credentials
// exist. Migration/seed scripts validate the real DATABASE_URL themselves.
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/roadmap";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
