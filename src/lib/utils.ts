import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function phaseVar(order: number) {
  const n = Math.min(Math.max(order, 1), 11);
  return `var(--phase-${n})`;
}

export function pct(done: number, total: number) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

export function formatMinutes(min: number | null | undefined) {
  if (!min) return "";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
