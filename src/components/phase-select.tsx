"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { cn, pct, phaseVar } from "@/lib/utils";

type PhaseOption = {
  id: string;
  slug: string;
  order: number;
  title: string;
  colorVar: number;
  weekStart: number;
  weekEnd: number;
  coreDone: number;
  coreTotal: number;
};

export function PhaseSelect({
  phases,
  activeSlug,
}: {
  phases: PhaseOption[];
  activeSlug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = phases.find((p) => p.slug === activeSlug) ?? phases[0];

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function choose(slug: string) {
    setOpen(false);
    if (slug !== activeSlug) router.push(`/plan?phase=${slug}`, { scroll: false });
  }

  if (!active) return null;
  const activeColor = phaseVar(active.colorVar);
  const activePercent = pct(active.coreDone, active.coreTotal);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-[var(--border-strong)] sm:px-5 sm:py-4"
        style={{ borderLeft: `3px solid ${activeColor}` }}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center font-mono text-xs font-bold text-primary-fg"
          style={{ background: activeColor }}
        >
          {String(active.order).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
            Phase {String(active.order).padStart(2, "0")} / {phases.length} · Weeks {active.weekStart}
            {active.weekEnd !== active.weekStart ? `–${active.weekEnd}` : ""}
          </span>
          <span className="mt-0.5 block truncate font-body text-lg font-bold text-foreground">
            {active.title}
          </span>
        </span>
        <span className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
          <span className="font-mono text-[0.62rem] text-muted-2">
            {active.coreDone}/{active.coreTotal} · {activePercent}%
          </span>
          <span className="h-[3px] w-24 overflow-hidden bg-surface-3">
            <span className="block h-full" style={{ width: `${activePercent}%`, background: activeColor }} />
          </span>
        </span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-muted transition-transform", open && "rotate-180 text-primary")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-fade-in absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[70vh] overflow-y-auto border border-[var(--border-strong)] bg-surface shadow-[6px_6px_0_rgba(0,0,0,.4)]"
        >
          {phases.map((phase) => {
            const color = phaseVar(phase.colorVar);
            const percent = pct(phase.coreDone, phase.coreTotal);
            const isActive = phase.slug === activeSlug;
            return (
              <button
                key={phase.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => choose(phase.slug)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--blueprint-tint)]",
                  isActive && "bg-[var(--blueprint-tint)]",
                )}
                style={{ borderLeft: `3px solid ${isActive ? color : "transparent"}` }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center font-mono text-[0.62rem] font-bold text-primary-fg"
                  style={{ background: color }}
                >
                  {String(phase.order).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-body text-sm font-bold text-foreground">
                    {phase.title}
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <span className="h-[3px] w-20 overflow-hidden bg-surface-3">
                      <span className="block h-full" style={{ width: `${percent}%`, background: color }} />
                    </span>
                    <span className="font-mono text-[0.56rem] text-muted-2">
                      {phase.coreDone}/{phase.coreTotal}
                    </span>
                  </span>
                </span>
                {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
