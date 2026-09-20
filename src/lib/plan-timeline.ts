import { pickDailyQuote, pickFinishQuote, type Quote } from "@/data/quotes";

/**
 * Duration bounds enforced by the onboarding form and profileInput schema.
 * The canonical roadmap has 24 weeks; users can compress down to 16.
 */
export const MIN_DURATION_WEEKS = 16;
export const MAX_DURATION_WEEKS = 24;
export const DEFAULT_DURATION_WEEKS = 16;

/**
 * Merge pairs used to compress the 24-week roadmap into fewer app-weeks.
 * Pairs mirror the current accelerated 16-week seed and are applied in order
 * (earlier pairs merge first). Applying all 8 yields the 16-week plan;
 * applying zero yields the original 24-week plan.
 */
const MERGE_PRIORITY: readonly [number, number][] = [
  [2, 3],
  [4, 5],
  [9, 10],
  [11, 12],
  [14, 15],
  [19, 20],
  [21, 22],
  [23, 24],
];

export type AppWeekMapping = {
  appWeek: number; // 1..N
  originalWeeks: number[]; // subset of 1..24
};

export function clampDurationWeeks(input: number | null | undefined): number {
  if (!Number.isFinite(input ?? NaN)) return DEFAULT_DURATION_WEEKS;
  const n = Math.trunc(input as number);
  return Math.min(MAX_DURATION_WEEKS, Math.max(MIN_DURATION_WEEKS, n));
}

/**
 * Compress the 24 original roadmap weeks into `durationWeeks` app-weeks.
 * Merges are drawn from MERGE_PRIORITY in order; the number of merges applied
 * equals (24 - durationWeeks).
 */
export function buildSchedule(durationWeeks: number): AppWeekMapping[] {
  const N = clampDurationWeeks(durationWeeks);
  const mergesToApply = MAX_DURATION_WEEKS - N;
  // Each active-merge (a, b) causes week `b` to fold into week `a`'s app-week.
  const foldSecondWeek = new Set<number>();
  for (let i = 0; i < mergesToApply; i++) {
    foldSecondWeek.add(MERGE_PRIORITY[i][1]);
  }
  const result: AppWeekMapping[] = [];
  for (let w = 1; w <= MAX_DURATION_WEEKS; w++) {
    if (foldSecondWeek.has(w) && result.length > 0) {
      result[result.length - 1].originalWeeks.push(w);
    } else {
      result.push({ appWeek: result.length + 1, originalWeeks: [w] });
    }
  }
  return result;
}

/** Derive backward-compat `mode` from duration for existing consumers. */
export function modeForDuration(durationWeeks: number): "accelerated" | "original" {
  return clampDurationWeeks(durationWeeks) < 20 ? "accelerated" : "original";
}

/**
 * Rough weekly-hours estimate so features like /todo quick-add still get a
 * sensible daily budget. Roadmap totals ~370 hours across 24 weeks.
 */
export function weeklyHoursForDuration(durationWeeks: number): number {
  return Math.round(370 / clampDurationWeeks(durationWeeks));
}

/* ------------------------------------------------------------------ */
/* Date helpers                                                        */
/* ------------------------------------------------------------------ */

function parseISODate(iso: string): Date | null {
  // Interpret as local midnight; the plan runs on the user's wall clock.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function startOfLocalDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatDateRange(startISO: string, endISO: string): string {
  const s = parseISODate(startISO);
  const e = parseISODate(endISO);
  if (!s || !e) return `${startISO} – ${endISO}`;
  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();
  const left = `${MONTH_SHORT[s.getMonth()]} ${s.getDate()}`;
  const right = sameMonth
    ? `${e.getDate()}, ${e.getFullYear()}`
    : sameYear
      ? `${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`
      : `${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
  return `${left} – ${right}`;
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

export type OriginalWeekPlacement = {
  appWeek: number;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string; // ISO yyyy-mm-dd
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
};

export type PlanTimeline = {
  startDate: string;
  endDate: string;
  totalWeeks: number;
  totalDays: number;
  daysSinceStart: number; // negative if before start
  daysRemaining: number; // 0 when past end
  daysCompleted: number; // clamped [0, totalDays]
  progressPercent: number; // 0..100
  currentAppWeek: number | null; // null before start
  hasStarted: boolean;
  isComplete: boolean;
  quote: Quote;
  mapping: AppWeekMapping[];
  originalToApp: Map<number, OriginalWeekPlacement>;
};

/**
 * Compute the timeline for a user's plan. Returns null if there's no valid
 * start date yet (freshly signed-up user who skipped onboarding fields).
 */
export function buildTimeline(
  startDateISO: string | null | undefined,
  durationWeeks: number | null | undefined,
  now: Date = new Date(),
): PlanTimeline | null {
  if (!startDateISO) return null;
  const start = parseISODate(startDateISO);
  if (!start) return null;

  const N = clampDurationWeeks(durationWeeks ?? DEFAULT_DURATION_WEEKS);
  const totalDays = N * 7;
  const endDate = addDays(start, totalDays - 1); // inclusive last day
  const mapping = buildSchedule(N);

  const today = startOfLocalDay(now);
  const dayMs = 86_400_000;
  const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / dayMs);
  const hasStarted = daysSinceStart >= 0;
  const daysCompleted = Math.max(0, Math.min(totalDays, daysSinceStart));
  const daysRemaining = Math.max(0, totalDays - daysSinceStart);
  const isComplete = daysSinceStart >= totalDays;
  const currentAppWeek = !hasStarted
    ? null
    : Math.min(N, Math.floor(daysSinceStart / 7) + 1);
  const progressPercent = totalDays === 0 ? 0 : Math.round((daysCompleted / totalDays) * 100);

  const originalToApp = new Map<number, OriginalWeekPlacement>();
  for (const m of mapping) {
    const wkStart = addDays(start, (m.appWeek - 1) * 7);
    const wkEnd = addDays(wkStart, 6);
    const isCurrent = currentAppWeek === m.appWeek;
    const isPast = currentAppWeek !== null && m.appWeek < currentAppWeek;
    const isFuture = !hasStarted || (currentAppWeek !== null && m.appWeek > currentAppWeek);
    const startISO = toISODate(wkStart);
    const endISO = toISODate(wkEnd);
    for (const orig of m.originalWeeks) {
      originalToApp.set(orig, {
        appWeek: m.appWeek,
        startDate: startISO,
        endDate: endISO,
        isCurrent,
        isPast,
        isFuture,
      });
    }
  }

  return {
    startDate: toISODate(start),
    endDate: toISODate(endDate),
    totalWeeks: N,
    totalDays,
    daysSinceStart,
    daysRemaining,
    daysCompleted,
    progressPercent,
    currentAppWeek,
    hasStarted,
    isComplete,
    quote: isComplete ? pickFinishQuote(today) : pickDailyQuote(today),
    mapping,
    originalToApp,
  };
}
