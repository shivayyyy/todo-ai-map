"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Flame, LogOut, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { ActivityDay, ActivityTracker } from "@/lib/queries";
import { cn } from "@/lib/utils";

// GitHub-inspired emerald scale tuned for this app's navy background.
// Level 4 is reserved for shipped projects or an exceptionally productive day.
const LEVEL_COLORS = [
  "#161c26",
  "#0f2d1d",
  "#145a32",
  "#1f883d",
  "#2ea043",
] as const;
const LEVEL_LABELS = ["No activity", "Quick action", "Learned", "Built", "Project shipped"] as const;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

function utcDateLabel(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function eventDateLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function monthName(date: string): string {
  return utcDateLabel(date, { month: "short", day: undefined, year: undefined });
}

function eventColor(type: string): string {
  if (type === "project_done") return LEVEL_COLORS[4];
  if (type === "project_started" || type === "project_evidence") return LEVEL_COLORS[3];
  if (type === "lesson_done" || type === "milestone" || type === "evidence") return LEVEL_COLORS[2];
  return LEVEL_COLORS[1];
}

function weekColumns(days: ActivityDay[], weeks: number): ActivityDay[][] {
  return Array.from({ length: weeks }, (_, index) =>
    days.slice(index * 7, index * 7 + 7),
  );
}

export function ProfileActivity({
  name,
  email,
  overall,
  tracker,
}: {
  name: string;
  email: string;
  overall: { coreDone: number; coreTotal: number };
  tracker: ActivityTracker;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const safeName = name.trim() || "Roadmap learner";
  const progress = overall.coreTotal
    ? Math.round((overall.coreDone / overall.coreTotal) * 100)
    : 0;
  const mobileWeeks = Math.min(14, tracker.weeks);
  const mobileDays = tracker.days.slice(-mobileWeeks * 7);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open]);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={rootRef} className="relative ml-3">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="profile-activity-panel"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group flex h-10 items-center gap-2 border px-1.5 pr-2 transition-colors",
          open
            ? "border-primary bg-[var(--blueprint-tint)]"
            : "border-border bg-surface/70 hover:border-primary",
        )}
      >
        <span className="grid h-7 w-7 place-items-center bg-primary font-mono text-[0.62rem] font-bold text-primary-fg">
          {initialsOf(safeName)}
        </span>
        <span className="hidden max-w-28 truncate font-mono text-[0.66rem] font-semibold text-foreground lg:block">
          {safeName}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform group-hover:text-primary",
            open && "rotate-180 text-primary",
          )}
        />
      </button>

      {open && (
        <section
          id="profile-activity-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="profile-activity-title"
          className="animate-fade-in absolute right-0 top-[calc(100%+8px)] z-50 max-h-[calc(100dvh-5rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-x-hidden overflow-y-auto overscroll-contain border border-[var(--border-strong)] bg-background shadow-[6px_6px_0_rgba(0,0,0,.5)] sm:w-[44rem] sm:max-w-[calc(100vw-2rem)] sm:shadow-[8px_8px_0_rgba(0,0,0,.5)]"
        >
          <header className="sticky top-0 z-10 flex min-w-0 items-start gap-2 border-b border-border bg-surface px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary font-mono text-xs font-bold text-primary-fg sm:h-11 sm:w-11 sm:text-sm">
              {initialsOf(safeName)}
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="profile-activity-title" className="truncate font-body text-base font-bold text-foreground sm:text-lg">
                {safeName}
              </h2>
              <p className="truncate font-mono text-[0.6rem] text-muted-2">{email || "Signed-in learner"}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-surface-3" aria-hidden>
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                <span className="font-mono text-[0.58rem] font-bold text-primary">{progress}% CORE</span>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close profile activity"
              className="grid h-9 w-9 shrink-0 place-items-center border border-border text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="min-w-0 space-y-4 p-3 sm:space-y-5 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="fig-label">
                  DAILY MOMENTUM · <span className="sm:hidden">14 WEEKS</span><span className="hidden sm:inline">26 WEEKS</span>
                </p>
                <h3 className="mt-1 font-body text-xl font-bold text-[#3fb950]">Your learning activity</h3>
              </div>
              <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-2">
                Days use UTC · future days blank
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
              <Stat value={tracker.currentStreak} label="Current streak" icon={<Flame className="h-3.5 w-3.5" />} suffix="d" />
              <Stat value={tracker.longestStreak} label="Longest streak" suffix="d" />
              <Stat value={tracker.activeDays} label="Active days" />
              <Stat value={tracker.totalContributions} label="Actions logged" />
            </div>

            <div className="border border-border bg-surface/60 p-2.5 sm:p-4">
              <div className="pb-1 sm:hidden">
                <ActivityGrid days={mobileDays} weeks={mobileWeeks} compact />
              </div>
              <div className="hidden pb-1 sm:block">
                <ActivityGrid days={tracker.days} weeks={tracker.weeks} />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <span className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-2">
                  {tracker.bestDay
                    ? `Best: ${tracker.bestDay.count} on ${utcDateLabel(tracker.bestDay.date, { year: undefined })}`
                    : "Start one lesson to light up your map"}
                </span>
                <div className="flex items-center gap-1" aria-label="Activity intensity legend: quick action through project shipped">
                  <span className="mr-1 font-mono text-[0.52rem] text-muted-2">Start</span>
                  {LEVEL_COLORS.map((color, index) => (
                    <span key={color} className="h-2.5 w-2.5" style={{ background: color }} title={LEVEL_LABELS[index]} />
                  ))}
                  <span className="ml-1 font-mono text-[0.52rem] text-[#3fb950]">Ship</span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[0.5rem] uppercase tracking-wide text-muted-2">
                Quick action → lesson/evidence → project work → <span className="text-[#3fb950]">project shipped</span>
              </p>
            </div>

            {tracker.totalContributions === 0 ? (
              <div className="flex items-start gap-3 border border-dashed border-border bg-surface-2/40 p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground">Your momentum starts here.</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    Start or complete a lesson, finish a milestone, save evidence, or complete a todo. Meaningful work adds one square; browsing does not.
                  </p>
                </div>
              </div>
            ) : tracker.recent.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="meta-label">Recent activity</p>
                  <CalendarDays className="h-3.5 w-3.5 text-muted-2" />
                </div>
                <div className="divide-y divide-border border-y border-border">
                  {tracker.recent.map((event) => (
                    <div key={event.id} className="flex min-w-0 items-center gap-2 py-2.5 sm:gap-3">
                      <span className="h-1.5 w-1.5 shrink-0" style={{ background: eventColor(event.type) }} aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{event.label}</span>
                      <span className="shrink-0 font-mono text-[0.55rem] uppercase text-muted-2">{eventDateLabel(event.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <footer className="sticky bottom-0 z-10 flex items-center justify-end border-t border-border bg-surface px-3 py-3 sm:justify-between sm:px-5">
            <span className="hidden font-mono text-[0.55rem] uppercase tracking-wider text-muted-2 sm:block">
              Consistency over intensity
            </span>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="flex items-center gap-2 border border-border px-3 py-2 font-mono text-[0.6rem] uppercase tracking-wider text-muted transition-colors hover:border-danger hover:text-danger disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </footer>
        </section>
      )}
    </div>
  );
}

function ActivityGrid({
  days,
  weeks,
  compact = false,
}: {
  days: ActivityDay[];
  weeks: number;
  compact?: boolean;
}) {
  const columns = weekColumns(days, weeks);
  const months = columns.map((week) => {
    const visible = week.find((day) => !day.future) ?? week[0];
    return visible ? monthName(visible.date) : "";
  });
  const monthLabels = months.map((month, index) =>
    month && month !== months[index - 1] ? month : "",
  );
  const visibleActions = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter((day) => !day.future && day.count > 0).length;

  return (
    <div
      className={cn(
        "max-w-full [--activity-gap:3px]",
        compact ? "[--activity-cell:11px]" : "[--activity-cell:10px]",
      )}
    >
      <div
        className="ml-[30px] grid h-4 gap-[var(--activity-gap)] overflow-visible font-mono text-[0.48rem] text-muted-2"
        style={{ gridTemplateColumns: `repeat(${weeks}, var(--activity-cell))` }}
        aria-hidden
      >
        {monthLabels.map((month, index) => (
          <span key={`${month}-${index}`} className="overflow-visible whitespace-nowrap">
            {month}
          </span>
        ))}
      </div>
      <div className="flex max-w-full gap-2 overflow-hidden">
        <div
          className="grid w-[22px] shrink-0 grid-rows-7 items-center gap-[var(--activity-gap)] font-mono text-[0.46rem] leading-none text-muted-2"
          aria-hidden
        >
          <span />
          <span>Mon</span>
          <span />
          <span>Wed</span>
          <span />
          <span>Fri</span>
          <span />
        </div>
        <div
          className="grid min-w-0 grid-flow-col grid-rows-7 gap-[var(--activity-gap)]"
          style={{ gridTemplateColumns: `repeat(${weeks}, var(--activity-cell))` }}
          role="group"
          aria-label={`${visibleActions} learning actions across ${activeDays} active days in the visible period`}
        >
          {days.map((day) => (
            <span
              key={day.date}
              tabIndex={!day.future && day.count > 0 ? 0 : -1}
              aria-label={
                day.future
                  ? `${utcDateLabel(day.date)}: future day`
                  : `${utcDateLabel(day.date)}: ${day.count} learning ${day.count === 1 ? "action" : "actions"}, intensity ${day.level} of 4`
              }
              title={
                day.future
                  ? undefined
                  : `${day.count} ${day.count === 1 ? "action" : "actions"} · intensity ${day.level}/4 · ${utcDateLabel(day.date)}`
              }
              className={cn(
                "h-[var(--activity-cell)] w-[var(--activity-cell)] outline-none ring-[#3fb950] focus:ring-1",
                day.future && "border border-border/40 bg-transparent",
              )}
              style={day.future ? undefined : { background: LEVEL_COLORS[day.level] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  suffix = "",
  icon,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0 bg-background p-2.5 sm:p-3">
      <p className="flex items-center gap-1 font-display text-2xl leading-none text-[#3fb950]">
        {icon}
        {value}{suffix}
      </p>
      <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-wider text-muted-2">{label}</p>
    </div>
  );
}
