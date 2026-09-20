"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/actions";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const startOptions = [
  { value: "week0", label: "I have never coded", hint: "Start from week 1" },
  { value: "week3", label: "I know Python basics", hint: "Focus from Git/SQL/APIs" },
  { value: "week5", label: "I'm a CS student / developer", hint: "Start from data & math" },
  { value: "week13", label: "I already do ML / data science", hint: "Jump to transformers & LLMs" },
];

const MIN_WEEKS = 16;
const MAX_WEEKS = 24;

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function OnboardingForm() {
  const router = useRouter();
  const [startingPoint, setStartingPoint] = useState("week0");
  const [durationWeeks, setDurationWeeks] = useState(16);
  const [startDate, setStartDate] = useState(todayISO());
  const [prefLanguage, setPrefLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  const endDate = useMemo(() => {
    if (!startDate) return null;
    return addDaysISO(startDate, durationWeeks * 7 - 1);
  }, [startDate, durationWeeks]);

  const paceLabel =
    durationWeeks <= 17
      ? "Accelerated"
      : durationWeeks <= 20
        ? "Balanced"
        : "Original";

  async function submit() {
    setSaving(true);
    try {
      await saveProfile({
        startingPoint: startingPoint as "week0" | "week3" | "week5" | "week13",
        durationWeeks,
        startDate: startDate || undefined,
        prefLanguage: prefLanguage as "en" | "hi" | "any",
        prefResourceType: "any",
      });
      router.push("/plan");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-semibold">Set up your plan</h1>
      <p className="mt-1 text-sm text-muted">
        A few quick choices. You can change all of these later.
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <p className="mb-2 text-sm font-medium">Where are you starting?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {startOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setStartingPoint(o.value)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  startingPoint === o.value
                    ? "border-primary bg-surface-2"
                    : "border-border hover:bg-surface-2",
                )}
              >
                <p className="text-sm font-medium">{o.label}</p>
                <p className="text-xs text-muted">{o.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">How many weeks do you want?</p>
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-2">
              {paceLabel} · {durationWeeks} weeks
            </span>
          </div>
          <input
            type="range"
            min={MIN_WEEKS}
            max={MAX_WEEKS}
            step={1}
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
            aria-label="Plan duration in weeks"
          />
          <div className="mt-1 flex justify-between font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
            <span>16w · fast</span>
            <span>20w · balanced</span>
            <span>24w · original</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            The 24-week roadmap will compress into {durationWeeks} weeks. Shorter
            plans double up on the lightest early weeks first.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-muted">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-muted">Resource language</span>
            <select
              className="select"
              value={prefLanguage}
              onChange={(e) => setPrefLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi / Hinglish</option>
              <option value="any">Either</option>
            </select>
          </label>
        </section>

        {endDate && (
          <div className="rounded-lg border border-dashed border-border bg-surface-2/60 p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
              Your plan
            </p>
            <p className="mt-1 text-sm">
              Start <span className="font-medium">{formatShort(startDate)}</span> ·
              Finish <span className="font-medium">{formatShort(endDate)}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {durationWeeks} weeks · {durationWeeks * 7} days
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={submit}
        disabled={saving || !startDate}
        className="mt-8 w-full"
      >
        {saving ? "Saving…" : "Start learning"}
      </Button>
    </Card>
  );
}
