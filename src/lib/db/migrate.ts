import dns from "node:dns";
import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

// Some local networks have no IPv6 route; prefer IPv4 so the Neon fetch resolves.
dns.setDefaultResultOrder("ipv4first");
loadEnvConfig(process.cwd());

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !databaseUrl.startsWith("postgres")) {
    throw new Error(
      "DATABASE_URL must be set to a Neon PostgreSQL connection string before migrating.",
    );
  }

  const sql = neon(databaseUrl);
  const db = drizzle({ client: sql });
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("PostgreSQL migrations applied.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
