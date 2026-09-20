"use client";
import { useEffect } from "react";

/**
 * Registers the service worker exactly once on the client, only in production
 * where the SW file is served with stable caching semantics. Dev mode skips
 * registration to avoid caching HMR chunks.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const controller = new AbortController();
    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .catch((err) => {
            console.warn("Service worker registration failed", err);
          });
      },
      { once: true, signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return null;
}
