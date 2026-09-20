"use client";
import { useState } from "react";
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

export function OnboardingForm() {
  const router = useRouter();
  const [startingPoint, setStartingPoint] = useState("week0");
  const [mode, setMode] = useState("accelerated");
  const [weeklyHours, setWeeklyHours] = useState(22);
  const [prefLanguage, setPrefLanguage] = useState("en");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await saveProfile({
        startingPoint: startingPoint as "week0" | "week3" | "week5" | "week13",
        mode: mode as "accelerated" | "original",
        weeklyHours,
        prefLanguage: prefLanguage as "en" | "hi" | "any",
        targetDate: targetDate || undefined,
        prefResourceType: "any",
      });
      router.push("/plan");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Set up your plan</h1>
      <p className="mt-1 text-sm text-muted">
        A few quick choices. You can change all of these later.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium">Where are you starting?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {startOptions.map((o) => (
              <button
                key={o.value}
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
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Pace</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <PaceCard
              active={mode === "accelerated"}
              onClick={() => setMode("accelerated")}
              title="Accelerated — 16 weeks"
              hint="~22–24 h/week. Finish in ~4 months."
            />
            <PaceCard
              active={mode === "original"}
              onClick={() => setMode("original")}
              title="Original — 24 weeks"
              hint="~15–16 h/week. The classic plan."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-muted">Hours per week</span>
            <input
              type="number"
              min={4}
              max={80}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="input"
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-muted">Target date (optional)</span>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input"
            />
          </label>
        </div>
      </div>

      <Button onClick={submit} disabled={saving} className="mt-8 w-full">
        {saving ? "Saving…" : "Start learning"}
      </Button>
    </Card>
  );
}

function PaceCard({
  active,
  onClick,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border p-3 text-left transition-colors",
        active ? "border-primary bg-surface-2" : "border-border hover:bg-surface-2",
      )}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted">{hint}</p>
    </button>
  );
}
