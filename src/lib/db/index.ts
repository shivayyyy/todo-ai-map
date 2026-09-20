import "server-only";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !databaseUrl.startsWith("postgres")) {
  throw new Error(
    "DATABASE_URL must be a Neon PostgreSQL connection string (postgresql://...).",
  );
}

// The Neon HTTP driver throws on dropped connections (flaky networks, broken
// IPv6 routes, serverless cold starts). Retrying is safe here: a thrown fetch
// means the request never reached the database, so there is no double-write.
const baseFetch: typeof fetch = (...args) => fetch(...args);

neonConfig.fetchFunction = async (url: string, options: RequestInit) => {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await baseFetch(url, options);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }
  throw lastError;
};

const sql = neon(databaseUrl);

export const db = drizzle({ client: sql, schema });
export { schema };
