"use client";
import { useCallback, useEffect, useState } from "react";

/**
 * Native browser event fired by Chromium when the app is installable. We stash
 * the event so we can trigger the install flow from our own UI later.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const STORAGE_DISMISSED = "pwa:dismissedAt";
const STORAGE_INSTALLED = "pwa:installed";
const DISMISS_HOURS = 24;
const INITIAL_DELAY_MS = 8_000; // Don't spring on the user immediately.

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari puts this on the navigator instead of matchMedia.
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function isIOSSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
  return isIOS && isSafari;
}

function wasDismissedRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_DISMISSED);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    const hoursSince = (Date.now() - at) / (1000 * 60 * 60);
    return hoursSince < DISMISS_HOURS;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    window.localStorage.setItem(STORAGE_DISMISSED, String(Date.now()));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

function markInstalled() {
  try {
    window.localStorage.setItem(STORAGE_INSTALLED, "true");
  } catch {
    // Ignore storage errors
  }
}

function isAlreadyInstalled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_INSTALLED) === "true";
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosGuide, setIosGuide] = useState(false);
  const [busy, setBusy] = useState(false);

  // Capture the install event on Chromium so we can prompt on demand.
  useEffect(() => {
    if (typeof window === "undefined") return;

    function onBeforeInstall(e: Event) {
      // Prevent Chrome from showing its own mini-infobar; we'll drive the UX.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      markInstalled();
      setVisible(false);
      setDeferred(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Decide whether to actually show the popup, on a small delay.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    if (isAlreadyInstalled()) return;
    if (wasDismissedRecently()) return;

    const showable = deferred !== null || isIOSSafari();
    if (!showable) return;

    const t = window.setTimeout(() => {
      setIosGuide(deferred === null && isIOSSafari());
      setVisible(true);
    }, INITIAL_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [deferred]);

  const dismiss = useCallback(() => {
    markDismissed();
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    setBusy(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        markInstalled();
      } else {
        markDismissed();
      }
    } catch {
      markDismissed();
    } finally {
      setBusy(false);
      setDeferred(null);
      setVisible(false);
    }
  }, [deferred]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 pt-2 sm:inset-0 sm:items-end sm:justify-end sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-label="Install AI Roadmap"
    >
      <div className="pointer-events-auto w-full max-w-sm border border-foreground bg-surface shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-start justify-between gap-3 border-b border-border bg-surface-2 px-4 py-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
              PWA · Install
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold">Get the app</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close install prompt"
            className="rounded-md p-1 text-muted hover:bg-surface-3 hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          {iosGuide ? (
            <>
              <p className="text-sm text-foreground">
                Add AI Roadmap to your home screen for the full app feel.
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-xs text-muted">
                <li>
                  Tap the <span className="text-foreground">Share</span> button in Safari&apos;s bottom bar.
                </li>
                <li>
                  Choose <span className="text-foreground">Add to Home Screen</span>.
                </li>
                <li>
                  Tap <span className="text-foreground">Add</span>. Launch it from your home screen.
                </li>
              </ol>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground">
                Install AI Roadmap for a full-screen, one-tap launch and faster loads.
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-xs text-muted">
                <li>Home-screen icon on phone or desktop</li>
                <li>Runs without browser tabs or the address bar</li>
                <li>Static assets cached for quick starts</li>
              </ul>
            </>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!iosGuide && (
              <button
                type="button"
                onClick={install}
                disabled={busy || !deferred}
                className="inline-flex h-9 items-center border border-primary bg-primary px-4 font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-primary-fg transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
              >
                {busy ? "Opening…" : "Install app"}
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex h-9 items-center border border-border bg-transparent px-4 font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted hover:border-foreground hover:text-foreground"
            >
              Not now
            </button>
          </div>
          <p className="pt-1 font-mono text-[0.55rem] uppercase tracking-wider text-muted-2">
            Won&apos;t ask again for {DISMISS_HOURS} hours
          </p>
        </div>
      </div>
    </div>
  );
}
