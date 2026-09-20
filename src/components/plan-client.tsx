"use client";
import { useState, useTransition } from "react";
import {
  setSubtopicStatus,
  addTodo,
  setProjectStatus,
  toggleMilestone,
  saveProjectLinks,
} from "@/lib/actions";
import { Badge, Button } from "@/components/ui";
import { ResourcePicker } from "@/components/resource-picker";
import { cn } from "@/lib/utils";
import type { SubtopicNode } from "@/lib/queries";

const STATUS_NEXT: Record<string, string> = {
  not_started: "in_progress",
  in_progress: "done",
  done: "not_started",
};

export function StatusDot({
  status,
  onClick,
  color,
}: {
  status: string;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={status.replace("_", " ")}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
        status === "done"
          ? "border-transparent text-white"
          : status === "in_progress"
            ? "border-[var(--warning)]"
            : "border-border hover:border-muted",
      )}
      style={status === "done" ? { background: color ?? "var(--success)" } : undefined}
    >
      {status === "done" ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : status === "in_progress" ? (
        <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
      ) : null}
    </button>
  );
}

export function SubtopicItem({
  sub,
  color,
}: {
  sub: SubtopicNode;
  color: string;
}) {
  const [status, setStatus] = useState(sub.status);
  const [open, setOpen] = useState(false);
  const [addedTodo, setAddedTodo] = useState(false);
  const [, startTransition] = useTransition();

  function cycleStatus() {
    const next = STATUS_NEXT[status];
    setStatus(next);
    startTransition(() => setSubtopicStatus(sub.id, next));
  }

  const [pickingDay, setPickingDay] = useState(false);
  const [chosenDay, setChosenDay] = useState<"today" | "tomorrow">("tomorrow");
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);

  function localISO(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function commitAddTodo() {
    const dueDate = localISO(chosenDay === "today" ? 0 : 1);
    setAddedTodo(true);
    setPickingDay(false);
    setScheduledFor(chosenDay);
    startTransition(async () => {
      await addTodo({
        title: sub.title,
        lane: "learn",
        priority: "medium",
        estMinutes: sub.estMinutes || undefined,
        linkedType: "subtopic",
        linkedId: sub.id,
        dueDate,
      });
    });
  }

  return (
    <div className="subtopic-card" style={{ borderLeftColor: color }}>
      <div className="flex items-start gap-3 p-3">
        <StatusDot status={status} onClick={cycleStatus} color={color} />
        <div className="min-w-0 flex-1">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <span className={cn("hierarchy-subtopic", status === "done" && "text-muted line-through")}>
              {sub.title}
            </span>
            <span className="flex items-center gap-2">
              {sub.estMinutes > 0 && (
                <span className="text-[11px] text-muted-2">{sub.estMinutes}m</span>
              )}
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                className={cn("text-muted transition-transform", open && "rotate-180")}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <p className="subtopic-summary">{sub.explanation}</p>

          {open && (
            <div className="mt-4 space-y-4 border-t border-border pt-4 animate-fade-in">
              {sub.whyItMatters && (
                <Detail label="Why it matters">{sub.whyItMatters}</Detail>
              )}
              {sub.prerequisites && sub.prerequisites.length > 0 && (
                <Detail label="Prerequisites">{sub.prerequisites.join(" · ")}</Detail>
              )}
              {sub.learningOutcomes && sub.learningOutcomes.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">You will learn</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
                    {sub.learningOutcomes.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}
              {sub.practicalTask && (
                <Detail label="Practical task">{sub.practicalTask}</Detail>
              )}
              {sub.doneWhen && sub.doneWhen.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Done when</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
                    {sub.doneWhen.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}

              <ResourcePicker
                subtopicId={sub.id}
                initialChosenId={sub.chosenResourceId}
              />


              <div className="flex flex-wrap items-center gap-2">
                {addedTodo ? (
                  <Button size="sm" variant="subtle" disabled>
                    Added for {scheduledFor === "today" ? "today" : "tomorrow"} ✓
                  </Button>
                ) : !pickingDay ? (
                  <Button
                    size="sm"
                    variant="subtle"
                    onClick={() => {
                      setChosenDay("tomorrow");
                      setPickingDay(true);
                    }}
                  >
                    Add to Todo
                  </Button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 border border-border bg-surface-2/70 px-2 py-1">
                    <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-2">
                      Schedule
                    </span>
                    <div className="flex overflow-hidden rounded border border-border">
                      <button
                        type="button"
                        onClick={() => setChosenDay("today")}
                        aria-pressed={chosenDay === "today"}
                        className={cn(
                          "px-2 py-1 text-[11px] font-medium transition-colors",
                          chosenDay === "today"
                            ? "bg-primary text-primary-fg"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setChosenDay("tomorrow")}
                        aria-pressed={chosenDay === "tomorrow"}
                        className={cn(
                          "border-l border-border px-2 py-1 text-[11px] font-medium transition-colors",
                          chosenDay === "tomorrow"
                            ? "bg-primary text-primary-fg"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        Tomorrow
                      </button>
                    </div>
                    <Button size="sm" variant="subtle" onClick={commitAddTodo}>
                      Add
                    </Button>
                    <button
                      type="button"
                      onClick={() => setPickingDay(false)}
                      aria-label="Cancel scheduling"
                      className="rounded-md p-1 text-muted-2 hover:text-foreground"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <Button size="sm" variant="ghost" onClick={cycleStatus}>
                  Mark {STATUS_NEXT[status].replace("_", " ")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="detail-block">
      <p className="meta-label">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

/* ------------------------------- Projects ------------------------------- */

export function ProjectItem({
  project,
  color,
}: {
  project: {
    id: string;
    number: number;
    kind: string;
    origin: string;
    title: string;
    problem: string;
    whyUseful: string;
    realWorldProblem: string | null;
    learningGoal: string | null;
    intuitionFocus: string | null;
    newConcepts: string[] | null;
    revisitConcepts: string[] | null;
    mixNote: string | null;
    beginnerBrief: string | null;
    approach: string[] | null;
    resourceLinks: { label: string; url: string }[] | null;
    shipping: string[] | null;
    proves: string;
    ideas: string[];
    requiredKnowledge: string[];
    features: string[];
    status: string;
    repoUrl: string | null;
    demoUrl: string | null;
    milestones: { id: string; title: string; description: string; done: boolean }[];
  };
  color: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(project.status);
  const [milestones, setMilestones] = useState(project.milestones);
  const [pickingDay, setPickingDay] = useState(false);
  const [chosenDay, setChosenDay] = useState<"today" | "tomorrow">("tomorrow");
  const [addedTodo, setAddedTodo] = useState(false);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function cycle() {
    const next = STATUS_NEXT[status];
    setStatus(next);
    startTransition(() => setProjectStatus(project.id, next));
  }

  function toggle(id: string, done: boolean) {
    setMilestones((ms) => ms.map((m) => (m.id === id ? { ...m, done } : m)));
    startTransition(() => toggleMilestone(id, done));
  }

  function localISO(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function commitAddTodo() {
    const dueDate = localISO(chosenDay === "today" ? 0 : 1);
    setAddedTodo(true);
    setPickingDay(false);
    setScheduledFor(chosenDay);
    startTransition(async () => {
      await addTodo({
        title: project.title,
        lane: "build",
        priority: "medium",
        linkedType: "project",
        linkedId: project.id,
        dueDate,
      });
    });
  }

  const doneCount = milestones.filter((m) => m.done).length;

  return (
    <div className="subtopic-card" style={{ borderLeftColor: color }}>
      <div className="flex items-start gap-3 p-3">
        <StatusDot status={status} onClick={cycle} color={color} />
        <div className="min-w-0 flex-1">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <span className="flex flex-wrap items-center gap-2 font-body text-base font-bold text-foreground">
              {project.title}
              {project.kind === "phase-capstone" ? (
                <Badge color="var(--phase-8)">Cumulative · intuition</Badge>
              ) : (
                <Badge>Portfolio</Badge>
              )}
            </span>
            <span className="text-[11px] text-muted-2">
              {doneCount}/{milestones.length}
            </span>
          </button>
          <p className="subtopic-summary">{project.problem}</p>

          {open && (
            <div className="mt-3 space-y-3 animate-fade-in">
              {project.beginnerBrief && (
                <div className="border-l-2 border-primary bg-[var(--blueprint-tint)] px-3 py-2">
                  <p className="meta-label" style={{ color: "var(--primary)" }}>New to this? Start here</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{project.beginnerBrief}</p>
                </div>
              )}
              {project.approach && project.approach.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">How to approach it</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs text-muted marker:text-muted-2">
                    {project.approach.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>
              )}
              {project.intuitionFocus && (
                <Detail label="Builds intuition for">{project.intuitionFocus}</Detail>
              )}
              {project.mixNote && (
                <div className="border-l-2 border-[var(--phase-8)] bg-surface-2/60 px-3 py-2">
                  <p className="meta-label" style={{ color: "var(--phase-8)" }}>60 / 40 blend</p>
                  <p className="mt-1 text-sm text-muted">{project.mixNote}</p>
                </div>
              )}
              {project.newConcepts && project.newConcepts.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">New this phase (~60%)</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
                    {project.newConcepts.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
              {project.revisitConcepts && project.revisitConcepts.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Revisits from earlier phases (~40%)</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
                    {project.revisitConcepts.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
              {project.learningGoal && (
                <Detail label="What it teaches you">{project.learningGoal}</Detail>
              )}
              <Detail label="Why it's useful">{project.whyUseful}</Detail>
              <Detail label="Proves">{project.proves}</Detail>
              {project.ideas.length > 0 && (
                <Detail label="Ideas">{project.ideas.join(" · ")}</Detail>
              )}
              {project.features.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Features to build</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
                    {project.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
              {project.resourceLinks && project.resourceLinks.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Resources to learn / build</p>
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {project.resourceLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 border border-border bg-surface-2/50 px-2.5 py-1.5 text-xs transition-colors hover:border-primary hover:bg-[var(--blueprint-tint)]"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-2 group-hover:text-primary">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span className="truncate font-medium text-foreground group-hover:text-primary">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {project.shipping && project.shipping.length > 0 && (
                <div className="border-l-2 border-[var(--phase-6)] bg-surface-2/60 px-3 py-2">
                  <p className="meta-label" style={{ color: "var(--phase-6)" }}>How to ship it</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted">
                    {project.shipping.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Milestones</p>
                <div className="mt-1 space-y-1">
                  {milestones.map((m) => (
                    <label key={m.id} className="flex cursor-pointer items-start gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={m.done}
                        onChange={(e) => toggle(m.id, e.target.checked)}
                        className="mt-0.5"
                      />
                      <span className={cn(m.done && "text-muted line-through")}>
                        <span className="font-medium text-foreground">{m.title}.</span>{" "}
                        <span className="text-muted">{m.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <ProjectLinks project={project} />

              <div className="flex flex-wrap items-center gap-2">
                {addedTodo ? (
                  <Button size="sm" variant="subtle" disabled>
                    Added for {scheduledFor === "today" ? "today" : "tomorrow"} ✓
                  </Button>
                ) : !pickingDay ? (
                  <Button
                    size="sm"
                    variant="subtle"
                    onClick={() => {
                      setChosenDay("tomorrow");
                      setPickingDay(true);
                    }}
                  >
                    Add to Todo
                  </Button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 border border-border bg-surface-2/70 px-2 py-1">
                    <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-2">
                      Schedule
                    </span>
                    <div className="flex overflow-hidden rounded border border-border">
                      <button
                        type="button"
                        onClick={() => setChosenDay("today")}
                        aria-pressed={chosenDay === "today"}
                        className={cn(
                          "px-2 py-1 text-[11px] font-medium transition-colors",
                          chosenDay === "today"
                            ? "bg-primary text-primary-fg"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setChosenDay("tomorrow")}
                        aria-pressed={chosenDay === "tomorrow"}
                        className={cn(
                          "border-l border-border px-2 py-1 text-[11px] font-medium transition-colors",
                          chosenDay === "tomorrow"
                            ? "bg-primary text-primary-fg"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        Tomorrow
                      </button>
                    </div>
                    <Button size="sm" variant="subtle" onClick={commitAddTodo}>
                      Add
                    </Button>
                    <button
                      type="button"
                      onClick={() => setPickingDay(false)}
                      aria-label="Cancel scheduling"
                      className="rounded-md p-1 text-muted-2 hover:text-foreground"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectLinks({
  project,
}: {
  project: { id: string; repoUrl: string | null; demoUrl: string | null };
}) {
  const [repo, setRepo] = useState(project.repoUrl ?? "");
  const [demo, setDemo] = useState(project.demoUrl ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function save() {
    setSaved(true);
    startTransition(() => saveProjectLinks(project.id, repo, demo));
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Save your work</p>
      <p className="mt-0.5 text-xs text-muted">
        Paste your repo and live demo (or the recorded-demo link for CLIs, scripts and notebooks). These are stored in your tracker.
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input
          className="input"
          placeholder="Repo URL"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <input
          className="input"
          placeholder="Live demo / recorded demo URL"
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
        />
        <div>
          <Button size="sm" variant="subtle" onClick={save}>
            {saved ? "Saved ✓" : "Save links"}
          </Button>
        </div>
      </div>
    </div>
  );
}
