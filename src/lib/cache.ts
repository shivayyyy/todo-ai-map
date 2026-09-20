import "server-only";
import Redis from "ioredis";

export const ROADMAP_CACHE_PREFIX = `roadmap:${process.env.ROADMAP_CACHE_VERSION || "v1"}`;

const redisUrl = process.env.REDIS_URL;

// Reuse one client across warm serverless invocations. Caching is optional and
// every operation fails open so Neon stays the source of truth during any
// Redis outage or missing configuration.
declare global {
  var __roadmapRedis: Redis | null | undefined;
}

function getClient(): Redis | null {
  if (!redisUrl) return null;
  if (globalThis.__roadmapRedis !== undefined) return globalThis.__roadmapRedis;
  try {
    const client = new Redis(redisUrl, {
      lazyConnect: false,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 5000,
    });
    // Prevent unhandled 'error' events from crashing the process.
    client.on("error", () => {});
    globalThis.__roadmapRedis = client;
  } catch {
    globalThis.__roadmapRedis = null;
  }
  return globalThis.__roadmapRedis ?? null;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  const client = getClient();
  if (!client) return;
  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Cache write failures must never take down the roadmap.
  }
}

export async function cacheDelete(...keys: string[]): Promise<void> {
  const client = getClient();
  if (!client || keys.length === 0) return;
  try {
    await client.del(...keys);
  } catch {
    // Stale entries also expire via TTL and can be version-busted.
  }
}
