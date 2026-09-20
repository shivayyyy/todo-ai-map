"use client";
import { useEffect, useState, useTransition } from "react";
import {
  addResourceToSubtopic,
  chooseResource,
  deleteResource,
  loadSubtopicResources,
} from "@/lib/actions";
import { Badge, Button, TypeBadge } from "@/components/ui";
import { cn } from "@/lib/utils";

export type PickerResource = {
  id: string;
  title: string;
  url: string;
  provider: string | null;
  type: string;
  language: string;
  difficulty: string | null;
  durationText: string | null;
  freeNote: string | null;
  source: string;
  rank: number;
  role: string;
  custom?: boolean;
};

const RESOURCE_TYPES = [
  "video",
  "playlist",
  "course",
  "article",
  "docs",
  "book",
  "paper",
  "tool",
  "practice",
  "github",
  "podcast",
  "website",
] as const;

type Props = {
  subtopicId: string;
  initialChosenId?: string | null;
  /** Load resources immediately instead of waiting for the user to click. */
  autoLoad?: boolean;
};

/**
 * Recommended-resource picker shared by the plan-page subtopic drawer and the
 * todo-page lesson detail modal. Owns its own state and calls the resource
 * actions directly; the parent only supplies the subtopic id and (optionally)
 * the initially chosen resource.
 */
export function ResourcePicker({ subtopicId, initialChosenId, autoLoad }: Props) {
  const [resources, setResources] = useState<PickerResource[] | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(autoLoad));
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [chosen, setChosen] = useState<string | null>(initialChosenId ?? null);
  const [langFilter, setLangFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    type: "article",
    language: "en",
  });
  const [, startTransition] = useTransition();

  async function openResources() {
    if (resources || loading) return;
    setLoading(true);
    try {
      const list = (await loadSubtopicResources(subtopicId)) as PickerResource[];
      setResources(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!autoLoad) return;
    let cancelled = false;
    (async () => {
      try {
        const list = (await loadSubtopicResources(subtopicId)) as PickerResource[];
        if (!cancelled) setResources(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [autoLoad, subtopicId]);

  function pick(resourceId: string) {
    setChosen(resourceId);
    startTransition(() => chooseResource(subtopicId, resourceId));
  }

  async function submitResource() {
    setAddError(null);
    if (!form.title.trim() || !form.url.trim()) {
      setAddError("Title and URL are required.");
      return;
    }
    setAddBusy(true);
    try {
      const created = await addResourceToSubtopic({
        subtopicId,
        title: form.title.trim(),
        url: form.url.trim(),
        type: form.type as (typeof RESOURCE_TYPES)[number],
        language: form.language as "en" | "hi",
      });
      setResources((prev) => [...(prev ?? []), created as PickerResource]);
      setForm({ title: "", url: "", type: "article", language: "en" });
      setShowAddForm(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Could not add resource.");
    } finally {
      setAddBusy(false);
    }
  }

  async function removeResource(resourceId: string) {
    setResources((prev) => (prev ?? []).filter((r) => r.id !== resourceId));
    if (chosen === resourceId) setChosen(null);
    try {
      await deleteResource(resourceId);
    } catch {
      // Server refused, reload the authoritative list.
      const list = (await loadSubtopicResources(subtopicId)) as PickerResource[];
      setResources(list);
    }
  }

  const filtered = (resources ?? []).filter(
    (r) => langFilter === "all" || r.language === langFilter,
  );
  const primary = filtered[0];
  const alternatives = filtered.slice(1);

  return (
    <div className="border border-border bg-surface-2/70 p-4">
      {!resources && !loading && (
        <button
          onClick={openResources}
          className="text-xs font-medium text-[var(--phase-1)] hover:underline"
        >
          Choose a resource →
        </button>
      )}
      {loading && <p className="text-xs text-muted">Loading resources…</p>}
      {resources && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">
              Recommended
            </p>
            <select
              className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px]"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
            >
              <option value="all">All languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          {primary ? (
            <ResourceRow
              r={primary}
              chosen={chosen === primary.id}
              onChoose={() => pick(primary.id)}
              onDelete={primary.custom ? () => removeResource(primary.id) : undefined}
            />
          ) : (
            <p className="text-xs text-muted">No resource for this filter.</p>
          )}
          {alternatives.length > 0 && (
            <button
              onClick={() => setShowAlternatives((s) => !s)}
              className="text-xs text-muted hover:text-foreground"
            >
              {showAlternatives
                ? "Hide"
                : `Show ${alternatives.length} alternative${alternatives.length > 1 ? "s" : ""}`}
            </button>
          )}
          {showAlternatives &&
            alternatives.map((r) => (
              <ResourceRow
                key={r.id}
                r={r}
                chosen={chosen === r.id}
                onChoose={() => pick(r.id)}
                onDelete={r.custom ? () => removeResource(r.id) : undefined}
              />
            ))}
        </div>
      )}

      <div className={cn("border-t border-border", resources || !loading ? "mt-3 pt-3" : "")}>
        {!showAddForm ? (
          <button
            onClick={async () => {
              if (!resources && !loading) await openResources();
              setShowAddForm(true);
            }}
            className="text-xs font-medium text-muted hover:text-foreground"
          >
            + Add your own resource
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">
              Add a resource
            </p>
            <input
              className="input"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              className="input"
              placeholder="https://…"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
            <div className="flex gap-2">
              <select
                className="select flex-1"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                className="select flex-1"
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            {addError && <p className="text-[11px] text-[var(--danger)]">{addError}</p>}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="subtle" onClick={submitResource} disabled={addBusy}>
                {addBusy ? "Adding…" : "Add resource"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setAddError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceRow({
  r,
  chosen,
  onChoose,
  onDelete,
}: {
  r: PickerResource;
  chosen: boolean;
  onChoose: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border p-3",
        chosen ? "border-[var(--phase-1)] bg-surface-2" : "border-border",
      )}
    >
      <div className="min-w-0">
        <a
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium hover:underline"
        >
          {r.title}
        </a>
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          <TypeBadge type={r.type} />
          {r.language === "hi" && <Badge>Hindi</Badge>}
          {r.custom && <Badge color="var(--phase-6)">Added by you</Badge>}
          {r.provider && <span className="text-[11px] text-muted-2">{r.provider}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={onChoose}
          className={cn(
            "rounded-md px-2 py-1 text-[11px] font-medium",
            chosen ? "bg-[var(--phase-1)] text-white" : "bg-surface-3 hover:bg-surface-2",
          )}
        >
          {chosen ? "Chosen" : "Choose"}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            title="Delete this resource"
            aria-label="Delete this resource"
            className="rounded-md px-1.5 py-1 text-[11px] text-muted-2 hover:bg-surface-2 hover:text-[var(--danger)]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
