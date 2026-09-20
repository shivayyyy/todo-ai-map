"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { addRoadmapTodos, addTodo, deleteTodo, updateTodo } from "@/lib/actions";
import type { QuickAddData, TodoLessonOption } from "@/lib/queries";
import { Badge, Card } from "@/components/ui";
import { cn, todayISO } from "@/lib/utils";

export type TodoItem = {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  priority: string;
  lane: string;
  estMinutes: number | null;
  dueDate: string | null;
  dueTime: string | null;
  linkedType: string | null;
  linkedId: string | null;
};

type Draft = {
  title: string;
  notes?: string;
  lane: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  dueTime?: string;
  estMinutes?: number;
  linkedType?: string;
  linkedId?: string;
};

type View = "list" | "board" | "calendar";

const priorityColor: Record<string, string> = {
  low: "var(--muted-2)",
  medium: "var(--primary)",
  high: "var(--danger)",
};

export function TodoBoard({
  initial,
  lessons,
  quickAdd,
}: {
  initial: TodoItem[];
  lessons: TodoLessonOption[];
  quickAdd: QuickAddData;
}) {
  const [todos, setTodos] = useState(initial);
  const [view] = useState<View>("list");
  const [composerOpen, setComposerOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [, startTransition] = useTransition();

  function create(data: Draft) {
    const temporaryId = `tmp_${Date.now()}`;
    const optimistic: TodoItem = {
      id: temporaryId,
      title: data.title,
      notes: data.notes ?? null,
      status: "todo",
      priority: data.priority,
      lane: data.lane,
      estMinutes: data.estMinutes ?? null,
      dueDate: data.dueDate ?? null,
      dueTime: data.dueTime ?? null,
      linkedType: data.linkedType ?? "custom",
      linkedId: data.linkedId ?? null,
    };
    setTodos((current) => [optimistic, ...current]);
    startTransition(async () => {
      const saved = await addTodo(data);
      setTodos((current) =>
        current.map((todo) =>
          todo.id === temporaryId
            ? {
                ...todo,
                id: saved.id,
                notes: saved.notes,
                dueTime: saved.dueTime,
              }
            : todo,
        ),
      );
    });
  }

  function createMany(items: QuickAddDraft[]) {
    if (items.length === 0) return;
    const stamp = Date.now();
    const optimistic: TodoItem[] = items.map((item, index) => ({
      id: `tmp_${stamp}_${index}`,
      title: item.title,
      notes: null,
      status: "todo",
      priority: item.priority,
      lane: "lesson",
      estMinutes: item.estMinutes ?? null,
      dueDate: item.dueDate ?? null,
      dueTime: null,
      linkedType: "subtopic",
      linkedId: item.linkedId ?? null,
    }));
    setTodos((current) => [...optimistic, ...current]);
    startTransition(async () => {
      const saved = await addRoadmapTodos(items);
      setTodos((current) => {
        const optimisticIds = new Set(optimistic.map((o) => o.id));
        const withoutOptimistic = current.filter((t) => !optimisticIds.has(t.id));
        return [...(saved as TodoItem[]), ...withoutOptimistic];
      });
    });
  }

  function setStatus(id: string, status: string) {
    setTodos((current) => current.map((t) => (t.id === id ? { ...t, status } : t)));
    startTransition(() => updateTodo(id, { status }));
  }

  function patch(id: string, values: Partial<TodoItem>) {
    setTodos((current) => current.map((t) => (t.id === id ? { ...t, ...values } : t)));
    startTransition(() =>
      updateTodo(id, {
        priority: values.priority as "low" | "medium" | "high" | undefined,
        lane: values.lane,
        dueDate: values.dueDate ?? undefined,
        dueTime: values.dueTime ?? undefined,
      }),
    );
  }

  function remove(id: string) {
    setTodos((current) => current.filter((t) => t.id !== id));
    startTransition(() => deleteTodo(id));
  }

  const openCount = todos.filter((t) => t.status !== "done").length;
  const doneCount = todos.length - openCount;

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <span className="font-mono text-[0.63rem] uppercase tracking-wider text-muted-2">
          {openCount} open / {doneCount} done
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickOpen(true)}
            aria-label="Quick add next roadmap lessons"
            title="Quick add next roadmap lessons"
            className="group flex h-11 items-center gap-2 border border-border bg-surface px-3 font-mono text-[0.63rem] uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Quick add</span>
          </button>
          <button
            onClick={() => setComposerOpen(true)}
            aria-label="Add a task or lesson"
            title="Add a task or lesson"
            className="group flex h-11 w-11 items-center justify-center border border-primary bg-primary text-primary-fg shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </div>

      <div className="mt-8">
        {view === "list" && (
          <ListView todos={todos} onStatus={setStatus} onPatch={patch} onRemove={remove} />
        )}
        {view === "board" && (
          <BoardView todos={todos} onStatus={setStatus} onRemove={remove} />
        )}
        {view === "calendar" && (
          <CalendarView todos={todos} onStatus={setStatus} />
        )}
      </div>

      {composerOpen && (
        <TodoComposer
          lessons={lessons}
          onClose={() => setComposerOpen(false)}
          onCreate={create}
        />
      )}

      {quickOpen && (
        <QuickAddModal
          data={quickAdd}
          onClose={() => setQuickOpen(false)}
          onConfirm={(items) => {
            createMany(items);
            setQuickOpen(false);
          }}
        />
      )}
    </div>
  );
}

type QuickAddDraft = {
  title: string;
  estMinutes?: number;
  dueDate?: string;
  linkedId?: string;
  priority: "low" | "medium" | "high";
};

function QuickAddModal({
  data,
  onClose,
  onConfirm,
}: {
  data: QuickAddData;
  onClose: () => void;
  onConfirm: (items: QuickAddDraft[]) => void;
}) {
  type Row = {
    id: string;
    include: boolean;
    title: string;
    dueDate: string;
    estMinutes: string;
    priority: "low" | "medium" | "high";
    context: string;
  };
  const [rows, setRows] = useState<Row[]>(() =>
    data.suggestions.map((s) => ({
      id: s.id,
      include: true,
      title: s.title,
      dueDate: s.suggestedDate,
      estMinutes: String(s.estMinutes),
      priority: "medium" as const,
      context: `Phase ${String(s.phaseOrder).padStart(2, "0")} · Week ${s.weekNumber} · ${s.topic}`,
    })),
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function patchRow(id: string, patch: Partial<Row>) {
    setRows((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const selected = rows.filter((r) => r.include);
  const totalMinutes = selected.reduce((sum, r) => sum + (Number(r.estMinutes) || 0), 0);

  function submit() {
    const items: QuickAddDraft[] = selected.map((r) => ({
      title: r.title.trim() || "Untitled lesson",
      estMinutes: r.estMinutes ? Number(r.estMinutes) : undefined,
      dueDate: r.dueDate || undefined,
      linkedId: r.id,
      priority: r.priority,
    }));
    onConfirm(items);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="quick-add-title">
        <header className="flex items-start justify-between border-b border-border px-5 py-5 sm:px-7">
          <div>
            <p className="fig-label">FIG_004 · QUICK ADD FROM ROADMAP</p>
            <h2 id="quick-add-title" className="mt-2 flex items-center gap-2 text-4xl text-primary">
              <Zap className="h-7 w-7" /> What&apos;s next
            </h2>
            <p className="mt-2 text-sm text-muted">
              {data.lastCompleted
                ? `You last completed "${data.lastCompleted.title}" in ${data.lastCompleted.phase}. Here are the next lessons to schedule.`
                : "Here are the first lessons to schedule from your roadmap."}
            </p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
              {data.completedCount}/{data.coreTotal} core done · budget ~{data.dailyBudgetMin} min/day
            </p>
          </div>
          <button onClick={onClose} aria-label="Close quick add" className="flex h-10 w-10 items-center justify-center border border-border text-muted hover:border-primary hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="max-h-[52vh] space-y-3 overflow-y-auto px-5 py-5 sm:px-7">
          {rows.length === 0 && (
            <div className="border border-dashed border-border py-12 text-center">
              <p className="fig-label">ALL CAUGHT UP</p>
              <p className="mt-2 text-sm text-muted">No pending core lessons to suggest. Nice work.</p>
            </div>
          )}
          {rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "border p-3 transition-colors",
                row.include ? "border-primary bg-[var(--blueprint-tint)]" : "border-border opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => patchRow(row.id, { include: !row.include })}
                  aria-label={row.include ? "Exclude lesson" : "Include lesson"}
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                    row.include ? "border-primary bg-primary text-primary-fg" : "border-muted-2 bg-background",
                  )}
                >
                  {row.include && <Check className="h-3.5 w-3.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    className="input text-sm font-semibold"
                    value={row.title}
                    onChange={(e) => patchRow(row.id, { title: e.target.value })}
                  />
                  <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-wider text-muted-2">{row.context}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <label className="block">
                      <span className="meta-label">Day</span>
                      <input type="date" className="input mt-1" value={row.dueDate} onChange={(e) => patchRow(row.id, { dueDate: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="meta-label">Min time</span>
                      <input type="number" min="0" className="input mt-1" value={row.estMinutes} onChange={(e) => patchRow(row.id, { estMinutes: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="meta-label">Priority</span>
                      <select className="select mt-1" value={row.priority} onChange={(e) => patchRow(row.id, { priority: e.target.value as Row["priority"] })}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-7">
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
            {selected.length} selected · {totalMinutes} min total
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="border border-border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted hover:border-foreground">Cancel</button>
            <button type="button" onClick={submit} disabled={selected.length === 0} className="border border-primary bg-primary px-5 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-primary-fg hover:bg-[var(--primary-hover)] disabled:opacity-40">
              Add {selected.length || ""} to plan
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function TodoComposer({
  lessons,
  onClose,
  onCreate,
}: {
  lessons: TodoLessonOption[];
  onClose: () => void;
  onCreate: (draft: Draft) => void;
}) {
  const [mode, setMode] = useState<"activity" | "lesson">("activity");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState<Draft["priority"]>("medium");
  const [dueDate, setDueDate] = useState(todayISO());
  const [dueTime, setDueTime] = useState("");
  const [estMinutes, setEstMinutes] = useState("");
  const [query, setQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<TodoLessonOption | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => titleRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [onClose]);

  const filteredLessons = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return lessons.slice(0, 24);
    return lessons
      .filter((lesson) =>
        `${lesson.title} ${lesson.topic} ${lesson.phase}`.toLowerCase().includes(needle),
      )
      .slice(0, 40);
  }, [lessons, query]);

  function selectLesson(lesson: TodoLessonOption) {
    setSelectedLesson(lesson);
    setQuery(lesson.title);
    setEstMinutes(lesson.estMinutes ? String(lesson.estMinutes) : "");
    setCategory("lesson");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const finalTitle = mode === "lesson" ? selectedLesson?.title : title.trim();
    if (!finalTitle) return;
    onCreate({
      title: finalTitle,
      notes: notes.trim() || undefined,
      lane: mode === "lesson" ? "lesson" : category.trim() || "personal",
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      estMinutes: estMinutes ? Number(estMinutes) : undefined,
      linkedType: mode === "lesson" ? "subtopic" : "custom",
      linkedId: selectedLesson?.id,
    });
    onClose();
  }

  const quickCategories = ["personal", "work", "health", "gym", "errand", "social", "movie"];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <header className="flex items-start justify-between border-b border-border px-5 py-5 sm:px-7">
          <div>
            <p className="fig-label">FIG_003 · NEW PLAN ITEM</p>
            <h2 id="composer-title" className="mt-2 text-4xl text-primary">Plan something</h2>
          </div>
          <button onClick={onClose} aria-label="Close composer" className="flex h-10 w-10 items-center justify-center border border-border text-muted hover:border-primary hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="border-b border-border px-5 py-4 sm:px-7">
            <div className="grid grid-cols-2 border border-border">
              <ModeButton active={mode === "activity"} onClick={() => { setMode("activity"); setSelectedLesson(null); }} icon={<Sparkles className="h-4 w-4" />} label="Any activity" />
              <ModeButton active={mode === "lesson"} onClick={() => setMode("lesson")} icon={<BookOpen className="h-4 w-4" />} label="Roadmap lesson" />
            </div>
          </div>

          <div className="space-y-6 px-5 py-6 sm:px-7">
            {mode === "activity" ? (
              <div>
                <FieldLabel>What are you planning?</FieldLabel>
                <input
                  ref={titleRef}
                  className="input mt-2 text-base"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Gym, movie night, finish a report, call home..."
                  required
                />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {quickCategories.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setCategory(item)}
                      className={cn(
                        "border px-2.5 py-1 font-mono text-[0.59rem] uppercase tracking-wider",
                        category === item ? "border-primary bg-[var(--blueprint-tint)] text-primary" : "border-border text-muted hover:border-primary",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block">
                  <span className="meta-label">Or type any category</span>
                  <input className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Anything" />
                </label>
              </div>
            ) : (
              <div>
                <FieldLabel>Choose any lesson</FieldLabel>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-2" />
                  <input
                    ref={titleRef}
                    className="input pl-10"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedLesson(null); }}
                    placeholder="Search 303 lessons by topic or phase..."
                  />
                </div>
                {!selectedLesson && (
                  <div className="mt-2 max-h-56 overflow-y-auto border border-border bg-surface">
                    {filteredLessons.map((lesson) => (
                      <button
                        type="button"
                        key={lesson.id}
                        onClick={() => selectLesson(lesson)}
                        className="flex w-full items-start justify-between gap-4 border-b border-border px-3 py-2.5 text-left last:border-b-0 hover:bg-[var(--blueprint-tint)]"
                      >
                        <span>
                          <span className="block text-sm font-semibold">{lesson.title}</span>
                          <span className="block font-mono text-[0.58rem] uppercase tracking-wider text-muted-2">
                            Phase {String(lesson.phaseOrder).padStart(2, "0")} · Week {lesson.weekNumber} · {lesson.topic}
                          </span>
                        </span>
                        <Badge color={lesson.tier === "core" ? "var(--primary)" : undefined}>{lesson.tier}</Badge>
                      </button>
                    ))}
                    {filteredLessons.length === 0 && <p className="p-4 text-sm text-muted">No lesson matches that search.</p>}
                  </div>
                )}
                {selectedLesson && (
                  <div className="mt-2 flex items-center justify-between border border-primary bg-[var(--blueprint-tint)] p-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">{selectedLesson.title}</p>
                      <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">Phase {selectedLesson.phaseOrder} · Week {selectedLesson.weekNumber} · {selectedLesson.topic}</p>
                    </div>
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <FieldLabel>Date</FieldLabel>
                <div className="relative mt-2">
                  <CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-2" />
                  <input type="date" className="input pl-10" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                </div>
              </label>
              <label>
                <FieldLabel>Time (optional)</FieldLabel>
                <div className="relative mt-2">
                  <Clock3 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-2" />
                  <input type="time" className="input pl-10" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
                </div>
              </label>
              <label>
                <FieldLabel>Duration in minutes</FieldLabel>
                <input type="number" min="0" className="input mt-2" value={estMinutes} onChange={(e) => setEstMinutes(e.target.value)} placeholder="45" />
              </label>
              <label>
                <FieldLabel>Priority</FieldLabel>
                <select className="select mt-2" value={priority} onChange={(e) => setPriority(e.target.value as Draft["priority"])}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <label className="block">
              <FieldLabel>Notes (optional)</FieldLabel>
              <textarea className="textarea mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context, location, what done looks like..." />
            </label>
          </div>

          <footer className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-7">
            <span className="hidden font-mono text-[0.6rem] uppercase tracking-wider text-muted-2 sm:block">Press Esc to close</span>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onClose} className="border border-border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted hover:border-foreground">Cancel</button>
              <button type="submit" disabled={mode === "lesson" ? !selectedLesson : !title.trim()} className="border border-primary bg-primary px-5 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-primary-fg hover:bg-[var(--primary-hover)] disabled:opacity-40">Add to plan</button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}

function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex items-center justify-center gap-2 px-3 py-3 font-mono text-[0.67rem] uppercase tracking-wider first:border-r first:border-border", active ? "bg-primary text-primary-fg" : "bg-surface text-muted hover:text-primary")}>
      {icon}{label}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="meta-label block">{children}</span>;
}

function bucketOf(dueDate: string | null): string {
  if (!dueDate) return "Unscheduled";
  const today = todayISO();
  if (dueDate < today) return "Overdue";
  if (dueDate === today) return "Today";
  const end = new Date(`${today}T00:00:00`);
  end.setDate(end.getDate() + 7);
  if (dueDate <= end.toISOString().slice(0, 10)) return "Next 7 days";
  return "Later";
}

const BUCKET_ORDER = ["Overdue", "Today", "Next 7 days", "Later", "Unscheduled"];

function ListView({ todos, onStatus, onPatch, onRemove }: { todos: TodoItem[]; onStatus: (id: string, status: string) => void; onPatch: (id: string, patch: Partial<TodoItem>) => void; onRemove: (id: string) => void }) {
  const open = todos.filter((todo) => todo.status !== "done");
  const done = todos.filter((todo) => todo.status === "done");
  const groups = useMemo(() => {
    const output: Record<string, TodoItem[]> = {};
    for (const todo of open) (output[bucketOf(todo.dueDate)] ??= []).push(todo);
    return output;
  }, [open]);

  if (open.length === 0 && done.length === 0) {
    return (
      <div className="border-y border-border py-16 text-center">
        <p className="fig-label">NO TASKS YET</p>
        <p className="mt-2 text-sm text-muted">Use the + button above when you want to add one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {BUCKET_ORDER.filter((bucket) => groups[bucket]?.length).map((bucket, sectionIndex) => (
        <section key={bucket}>
          <div className="mb-3 flex items-center justify-between border-b border-foreground pb-2">
            <p className={cn("fig-label", bucket === "Overdue" && "!text-danger")}>FIG_{String(sectionIndex + 10).padStart(3, "0")} · {bucket}</p>
            <span className="font-mono text-[0.62rem] text-muted-2">{groups[bucket].length} item{groups[bucket].length > 1 ? "s" : ""}</span>
          </div>
          <div>
            {groups[bucket].map((todo) => <TodoRow key={todo.id} todo={todo} onStatus={onStatus} onPatch={onPatch} onRemove={onRemove} />)}
          </div>
        </section>
      ))}
      {done.length > 0 && (
        <details className="border-t border-border pt-4">
          <summary className="cursor-pointer font-mono text-[0.65rem] uppercase tracking-wider text-muted-2 hover:text-primary">Completed · {done.length}</summary>
          <div className="mt-3 opacity-70">
            {done.map((todo) => <TodoRow key={todo.id} todo={todo} onStatus={onStatus} onPatch={onPatch} onRemove={onRemove} />)}
          </div>
        </details>
      )}
    </div>
  );
}

function TodoRow({ todo, onStatus, onPatch, onRemove }: { todo: TodoItem; onStatus: (id: string, status: string) => void; onPatch: (id: string, patch: Partial<TodoItem>) => void; onRemove: (id: string) => void }) {
  const isLesson = todo.linkedType === "subtopic";
  return (
    <article className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-[rgba(15,20,36,.7)] px-2 py-4 transition-colors hover:bg-[var(--blueprint-tint)] sm:px-3">
      <button onClick={() => onStatus(todo.id, todo.status === "done" ? "todo" : "done")} aria-label={todo.status === "done" ? "Mark incomplete" : "Mark complete"} className={cn("flex h-6 w-6 items-center justify-center border", todo.status === "done" ? "border-primary bg-primary text-primary-fg" : "border-muted-2 bg-background hover:border-primary")}>
        {todo.status === "done" && <Check className="h-3.5 w-3.5" />}
      </button>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className={cn("text-lg text-foreground", todo.status === "done" && "line-through opacity-60")}>{todo.title}</h4>
          {isLesson && <Badge color="var(--primary)">Lesson</Badge>}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5" style={{ background: priorityColor[todo.priority] }} />{todo.priority}</span>
          <span>{todo.lane}</span>
          {todo.dueTime && <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{todo.dueTime}</span>}
          {todo.estMinutes ? <span>{todo.estMinutes} min</span> : null}
        </div>
        {todo.notes && <p className="mt-1 line-clamp-1 text-sm text-muted">{todo.notes}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="date" value={todo.dueDate ?? ""} onChange={(e) => onPatch(todo.id, { dueDate: e.target.value })} aria-label="Task date" className="hidden border border-transparent bg-transparent px-1 py-1 font-mono text-[0.62rem] text-muted hover:border-border sm:block" />
        <button onClick={() => onRemove(todo.id)} aria-label="Delete item" className="p-2 text-muted-2 opacity-40 transition-opacity hover:text-danger group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
      </div>
    </article>
  );
}

function BoardView({ todos, onStatus, onRemove }: { todos: TodoItem[]; onStatus: (id: string, status: string) => void; onRemove: (id: string) => void }) {
  const columns = [{ key: "todo", label: "To do", fig: "A" }, { key: "doing", label: "In progress", fig: "B" }, { key: "done", label: "Done", fig: "C" }];
  return (
    <div className="grid gap-px border border-foreground bg-foreground md:grid-cols-3">
      {columns.map((column) => {
        const items = todos.filter((todo) => todo.status === column.key);
        return (
          <section key={column.key} className="min-h-72 bg-background">
            <header className="flex items-center justify-between border-b border-foreground bg-surface-2 px-4 py-3">
              <span className="fig-label">COL_{column.fig} · {column.label}</span>
              <span className="font-mono text-xs text-muted-2">{items.length}</span>
            </header>
            <div className="p-3">
              {items.map((todo) => (
                <Card key={todo.id} className="mb-3 p-3 transition-transform hover:-translate-y-px hover:shadow-[2px_2px_0_var(--foreground)]">
                  <div className="flex items-start gap-2">
                    {todo.linkedType === "subtopic" ? <BookOpen className="mt-1 h-3.5 w-3.5 text-primary" /> : <ListTodo className="mt-1 h-3.5 w-3.5 text-muted-2" />}
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-semibold", todo.status === "done" && "line-through opacity-60")}>{todo.title}</p>
                      <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-muted-2">{todo.dueDate ?? "No date"}{todo.dueTime ? ` · ${todo.dueTime}` : ""}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 border-t border-border pt-2">
                    {column.key !== "todo" && <MoveButton label="Previous" onClick={() => onStatus(todo.id, column.key === "done" ? "doing" : "todo")}><ArrowLeft className="h-3 w-3" /></MoveButton>}
                    {column.key !== "done" && <MoveButton label="Next" onClick={() => onStatus(todo.id, column.key === "todo" ? "doing" : "done")}><ArrowRight className="h-3 w-3" /></MoveButton>}
                    <button onClick={() => onRemove(todo.id)} aria-label="Delete" className="ml-auto p-1.5 text-muted-2 hover:text-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function MoveButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} aria-label={label} className="border border-border p-1.5 text-muted hover:border-primary hover:text-primary">{children}</button>;
}

function CalendarView({ todos, onStatus }: { todos: TodoItem[]; onStatus: (id: string, status: string) => void }) {
  const days = useMemo(() => {
    const output: { date: string; day: string; dateLabel: string; today: boolean }[] = [];
    const cursor = new Date();
    for (let i = 0; i < 14; i++) {
      const date = cursor.toISOString().slice(0, 10);
      output.push({ date, day: cursor.toLocaleDateString(undefined, { weekday: "short" }), dateLabel: cursor.toLocaleDateString(undefined, { month: "short", day: "numeric" }), today: i === 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    return output;
  }, []);

  const unscheduled = todos.filter((todo) => !todo.dueDate && todo.status !== "done");
  return (
    <div>
      <div className="grid gap-px border border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day) => {
          const items = todos.filter((todo) => todo.dueDate === day.date && todo.status !== "done");
          return (
            <section key={day.date} className="min-h-36 bg-background">
              <header className={cn("border-b border-border px-3 py-2", day.today && "bg-primary text-primary-fg")}>
                <p className="font-mono text-[0.58rem] uppercase tracking-widest">{day.day}</p>
                <p className="text-sm font-semibold">{day.dateLabel}</p>
              </header>
              <div className="p-2">
                {items.map((todo) => (
                  <button key={todo.id} onClick={() => onStatus(todo.id, "done")} className="mb-1.5 w-full border-l-2 border-primary bg-surface-2 px-2 py-1.5 text-left hover:bg-[var(--blueprint-tint)]">
                    <span className="block text-xs font-semibold leading-tight">{todo.title}</span>
                    {todo.dueTime && <span className="font-mono text-[0.55rem] text-muted-2">{todo.dueTime}</span>}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {unscheduled.length > 0 && (
        <div className="mt-6 border-t border-foreground pt-3">
          <p className="fig-label">UNSCHEDULED · {unscheduled.length}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {unscheduled.map((todo) => <div key={todo.id} className="border border-border bg-surface px-3 py-2 text-sm">{todo.title}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
