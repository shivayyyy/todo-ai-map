import "server-only";
import { and, asc, desc, eq, gte, inArray } from "drizzle-orm";
import { cacheGet, cacheSet, ROADMAP_CACHE_PREFIX } from "./cache";
import { db, schema } from "./db";

export type SubtopicNode = {
  id: string;
  slug: string;
  title: string;
  explanation: string;
  whyItMatters: string | null;
  prerequisites: string[] | null;
  learningOutcomes: string[] | null;
  practicalTask: string | null;
  doneWhen: string[] | null;
  estMinutes: number;
  tier: string;
  source: string;
  status: string; // not_started | in_progress | done
  evidenceUrl: string | null;
  notes: string | null;
  chosenResourceId: string | null;
};

export type TopicNode = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whyItMatters: string;
  lane: string;
  estMinutes: number;
  core: SubtopicNode[];
  additional: SubtopicNode[];
  coreDone: number;
  coreTotal: number;
};

export type WeekNode = {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  shipTitle: string | null;
  shipDescription: string | null;
  topics: TopicNode[];
};

export type ProjectLite = {
  id: string;
  number: number;
  kind: string;
  origin: string;
  title: string;
  problem: string;
  status: string;
};

export type PhaseSummary = {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  colorVar: number;
  weekStart: number;
  weekEnd: number;
  coreDone: number;
  coreTotal: number;
  additionalDone: number;
  additionalTotal: number;
  projectCount: number;
  projectsDone: number;
};

export type PhaseDetail = {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  colorVar: number;
  weekStart: number;
  weekEnd: number;
  doneWhen: string[];
  antiPatternTitle: string | null;
  antiPatternBody: string | null;
  weeks: WeekNode[];
  projects: (ProjectLite & {
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
    extensions: string[] | null;
    repoUrl: string | null;
    demoUrl: string | null;
    milestones: { id: string; title: string; description: string; done: boolean }[];
  })[];
  coreDone: number;
  coreTotal: number;
};

async function progressMap(userId: string) {
  const rows = await db
    .select()
    .from(schema.subtopicProgress)
    .where(eq(schema.subtopicProgress.userId, userId));
  const m = new Map<string, (typeof rows)[number]>();
  for (const r of rows) m.set(r.subtopicId, r);
  return m;
}

async function selectionMap(userId: string) {
  const rows = await db
    .select()
    .from(schema.resourceSelections)
    .where(eq(schema.resourceSelections.userId, userId));
  const m = new Map<string, string>();
  for (const r of rows) if (!m.has(r.subtopicId)) m.set(r.subtopicId, r.resourceId);
  return m;
}

export async function getPhaseSummaries(userId: string): Promise<PhaseSummary[]> {
  const phases = await db
    .select()
    .from(schema.phases)
    .orderBy(asc(schema.phases.order));

  const allSubs = await db
    .select({
      id: schema.subtopics.id,
      tier: schema.subtopics.tier,
      phaseId: schema.topics.phaseId,
    })
    .from(schema.subtopics)
    .innerJoin(schema.topics, eq(schema.subtopics.topicId, schema.topics.id));

  const prog = await progressMap(userId);

  const projects = await db.select().from(schema.projects);
  const projProg = await db
    .select()
    .from(schema.projectProgress)
    .where(eq(schema.projectProgress.userId, userId));
  const projStatus = new Map<string, string>();
  for (const p of projProg) projStatus.set(p.projectId, p.status);

  return phases.map((ph) => {
    const subs = allSubs.filter((s) => s.phaseId === ph.id);
    let coreTotal = 0,
      coreDone = 0,
      additionalTotal = 0,
      additionalDone = 0;
    for (const s of subs) {
      const done = prog.get(s.id)?.status === "done";
      if (s.tier === "core") {
        coreTotal++;
        if (done) coreDone++;
      } else {
        additionalTotal++;
        if (done) additionalDone++;
      }
    }
    const phProjects = projects.filter((p) => p.phaseId === ph.id);
    const projectsDone = phProjects.filter(
      (p) => projStatus.get(p.id) === "done",
    ).length;
    return {
      id: ph.id,
      slug: ph.slug,
      order: ph.order,
      title: ph.title,
      subtitle: ph.subtitle,
      colorVar: ph.colorVar,
      weekStart: ph.weekStart,
      weekEnd: ph.weekEnd,
      coreDone,
      coreTotal,
      additionalDone,
      additionalTotal,
      projectCount: phProjects.length,
      projectsDone,
    };
  });
}

export async function getPhaseDetail(
  userId: string,
  slug: string,
): Promise<PhaseDetail | null> {
  const phaseRows = await db
    .select()
    .from(schema.phases)
    .where(eq(schema.phases.slug, slug))
    .limit(1);
  const phase = phaseRows[0];
  if (!phase) return null;

  const weeks = await db
    .select()
    .from(schema.weeks)
    .where(eq(schema.weeks.phaseId, phase.id))
    .orderBy(asc(schema.weeks.order));

  const topics = await db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.phaseId, phase.id))
    .orderBy(asc(schema.topics.order));

  const topicIds = topics.map((t) => t.id);
  const subs = topicIds.length
    ? await db
        .select()
        .from(schema.subtopics)
        .where(inArray(schema.subtopics.topicId, topicIds))
        .orderBy(asc(schema.subtopics.order))
    : [];

  const prog = await progressMap(userId);
  const sel = await selectionMap(userId);

  const subsByTopic = new Map<string, SubtopicNode[]>();
  for (const s of subs) {
    const node: SubtopicNode = {
      id: s.id,
      slug: s.slug,
      title: s.title,
      explanation: s.explanation,
      whyItMatters: s.whyItMatters,
      prerequisites: s.prerequisites,
      learningOutcomes: s.learningOutcomes,
      practicalTask: s.practicalTask,
      doneWhen: s.doneWhen,
      estMinutes: s.estMinutes,
      tier: s.tier,
      source: s.source,
      status: prog.get(s.id)?.status ?? "not_started",
      evidenceUrl: prog.get(s.id)?.evidenceUrl ?? null,
      notes: prog.get(s.id)?.notes ?? null,
      chosenResourceId: sel.get(s.id) ?? null,
    };
    const arr = subsByTopic.get(s.topicId) ?? [];
    arr.push(node);
    subsByTopic.set(s.topicId, arr);
  }

  const topicsByWeek = new Map<string, TopicNode[]>();
  let coreDone = 0,
    coreTotal = 0;
  for (const t of topics) {
    const all = subsByTopic.get(t.id) ?? [];
    const core = all.filter((s) => s.tier === "core");
    const additional = all.filter((s) => s.tier === "additional");
    const cDone = core.filter((s) => s.status === "done").length;
    coreDone += cDone;
    coreTotal += core.length;
    const node: TopicNode = {
      id: t.id,
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      whyItMatters: t.whyItMatters,
      lane: t.lane,
      estMinutes: t.estMinutes,
      core,
      additional,
      coreDone: cDone,
      coreTotal: core.length,
    };
    const arr = topicsByWeek.get(t.weekId) ?? [];
    arr.push(node);
    topicsByWeek.set(t.weekId, arr);
  }

  const weekNodes: WeekNode[] = weeks.map((w) => ({
    id: w.id,
    weekNumber: w.weekNumber,
    title: w.title,
    summary: w.summary,
    shipTitle: w.shipTitle,
    shipDescription: w.shipDescription,
    topics: topicsByWeek.get(w.id) ?? [],
  }));

  // Projects
  const projects = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.phaseId, phase.id))
    .orderBy(asc(schema.projects.number));
  const projIds = projects.map((p) => p.id);
  const milestones = projIds.length
    ? await db
        .select()
        .from(schema.projectMilestones)
        .where(inArray(schema.projectMilestones.projectId, projIds))
        .orderBy(asc(schema.projectMilestones.order))
    : [];
  const projProg = await db
    .select()
    .from(schema.projectProgress)
    .where(eq(schema.projectProgress.userId, userId));
  const msProg = await db
    .select()
    .from(schema.milestoneProgress)
    .where(eq(schema.milestoneProgress.userId, userId));
  const projStatus = new Map(projProg.map((p) => [p.projectId, p]));
  const msDone = new Set(
    msProg.filter((m) => m.done).map((m) => m.milestoneId),
  );

  const projectNodes = projects.map((p) => ({
    id: p.id,
    number: p.number,
    kind: p.kind,
    origin: p.origin,
    title: p.title,
    problem: p.problem,
    status: projStatus.get(p.id)?.status ?? "not_started",
    whyUseful: p.whyUseful,
    realWorldProblem: p.realWorldProblem,
    learningGoal: p.learningGoal,
    intuitionFocus: p.intuitionFocus,
    newConcepts: p.newConcepts,
    revisitConcepts: p.revisitConcepts,
    mixNote: p.mixNote,
    beginnerBrief: p.beginnerBrief,
    approach: p.approach,
    resourceLinks: p.resourceLinks,
    shipping: p.shipping,
    proves: p.proves,
    ideas: p.ideas,
    requiredKnowledge: p.requiredKnowledge,
    features: p.features,
    extensions: p.extensions,
    repoUrl: projStatus.get(p.id)?.repoUrl ?? null,
    demoUrl: projStatus.get(p.id)?.demoUrl ?? null,
    milestones: milestones
      .filter((m) => m.projectId === p.id)
      .map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        done: msDone.has(m.id),
      })),
  }));

  return {
    id: phase.id,
    slug: phase.slug,
    order: phase.order,
    title: phase.title,
    subtitle: phase.subtitle,
    description: phase.description,
    colorVar: phase.colorVar,
    weekStart: phase.weekStart,
    weekEnd: phase.weekEnd,
    doneWhen: phase.doneWhen,
    antiPatternTitle: phase.antiPatternTitle,
    antiPatternBody: phase.antiPatternBody,
    weeks: weekNodes,
    projects: projectNodes,
    coreDone,
    coreTotal,
  };
}

export async function getOverallProgress(userId: string) {
  const summaries = await getPhaseSummaries(userId);
  const coreTotal = summaries.reduce((a, s) => a + s.coreTotal, 0);
  const coreDone = summaries.reduce((a, s) => a + s.coreDone, 0);
  const projectCount = summaries.reduce((a, s) => a + s.projectCount, 0);
  const projectsDone = summaries.reduce((a, s) => a + s.projectsDone, 0);
  return { coreTotal, coreDone, projectCount, projectsDone };
}

export type ActivityDay = {
  date: string;
  count: number;
  score: number;
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
};

export type ActivityTracker = {
  startDate: string;
  endDate: string;
  today: string;
  weeks: number;
  days: ActivityDay[];
  totalContributions: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; count: number } | null;
  recent: { id: string; type: string; label: string; createdAt: string }[];
};

const DAY_MS = 86_400_000;

function utcDate(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function activityWeight(type: string): number {
  if (type === "project_done") return 4;
  if (type === "project_started" || type === "project_evidence") return 3;
  if (type === "lesson_done" || type === "milestone" || type === "evidence") return 2;
  return 1;
}

function activityLevel(score: number, strongestAction: number): ActivityDay["level"] {
  if (score <= 0) return 0;
  // Shipping a project is always the strongest green. Several smaller actions
  // can also earn a strong day, while a single lightweight action stays subtle.
  if (strongestAction >= 4 || score >= 7) return 4;
  if (strongestAction >= 3 || score >= 4) return 3;
  if (strongestAction >= 2 || score >= 2) return 2;
  return 1;
}

/**
 * A stable Sunday-aligned 26-week activity calendar. UTC boundaries avoid
 * hydration/date drift between the server and browser. Future cells in the
 * current week are included for grid alignment but never count toward stats.
 */
export async function getActivityTracker(
  userId: string,
  now = new Date(),
  weeks = 26,
): Promise<ActivityTracker> {
  const safeWeeks = Math.min(53, Math.max(1, Math.trunc(weeks)));
  const todayDate = utcDate(now);
  const gridEnd = new Date(todayDate.getTime() + (6 - todayDate.getUTCDay()) * DAY_MS);
  const gridStart = new Date(gridEnd.getTime() - (safeWeeks * 7 - 1) * DAY_MS);

  const rows = await db
    .select({
      id: schema.activity.id,
      type: schema.activity.type,
      label: schema.activity.label,
      createdAt: schema.activity.createdAt,
    })
    .from(schema.activity)
    .where(
      and(
        eq(schema.activity.userId, userId),
        gte(schema.activity.createdAt, gridStart),
      ),
    )
    .orderBy(desc(schema.activity.createdAt));

  const visibleRows = rows.filter((row) => utcDate(row.createdAt) <= todayDate);
  const counts = new Map<string, number>();
  const scores = new Map<string, number>();
  const strongestActions = new Map<string, number>();
  for (const row of visibleRows) {
    const key = dateKey(utcDate(row.createdAt));
    const weight = activityWeight(row.type);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    scores.set(key, (scores.get(key) ?? 0) + weight);
    strongestActions.set(key, Math.max(strongestActions.get(key) ?? 0, weight));
  }

  const days: ActivityDay[] = [];
  for (let i = 0; i < safeWeeks * 7; i++) {
    const date = new Date(gridStart.getTime() + i * DAY_MS);
    const key = dateKey(date);
    const future = date > todayDate;
    const count = future ? 0 : (counts.get(key) ?? 0);
    const score = future ? 0 : (scores.get(key) ?? 0);
    days.push({
      date: key,
      count,
      score,
      level: activityLevel(score, strongestActions.get(key) ?? 0),
      future,
    });
  }

  const completedDays = days.filter((day) => !day.future);
  const totalContributions = completedDays.reduce((sum, day) => sum + day.count, 0);
  const activeDays = completedDays.filter((day) => day.count > 0).length;

  let longestStreak = 0;
  let running = 0;
  for (const day of completedDays) {
    if (day.count > 0) {
      running++;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 0;
    }
  }

  // A quiet current day does not immediately break yesterday's streak.
  let streakIndex = completedDays.length - 1;
  if (streakIndex >= 0 && completedDays[streakIndex].count === 0) streakIndex--;
  let currentStreak = 0;
  while (streakIndex >= 0 && completedDays[streakIndex].count > 0) {
    currentStreak++;
    streakIndex--;
  }

  let bestDay: ActivityTracker["bestDay"] = null;
  for (const day of completedDays) {
    if (day.count > 0 && (!bestDay || day.count > bestDay.count)) {
      bestDay = { date: day.date, count: day.count };
    }
  }

  return {
    startDate: dateKey(gridStart),
    endDate: dateKey(gridEnd),
    today: dateKey(todayDate),
    weeks: safeWeeks,
    days,
    totalContributions,
    activeDays,
    currentStreak,
    longestStreak,
    bestDay,
    recent: visibleRows.slice(0, 5).map((row) => ({
      id: row.id,
      type: row.type,
      label: row.label,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

export type TodoLessonOption = {
  id: string;
  title: string;
  topic: string;
  phase: string;
  phaseOrder: number;
  weekNumber: number;
  tier: string;
  estMinutes: number;
};

export type QuickAddSuggestion = {
  id: string;
  title: string;
  topic: string;
  phase: string;
  phaseOrder: number;
  weekNumber: number;
  tier: string;
  estMinutes: number;
  suggestedDate: string; // yyyy-mm-dd
};

export type QuickAddData = {
  lastCompleted: { title: string; topic: string; phase: string } | null;
  completedCount: number;
  coreTotal: number;
  dailyBudgetMin: number;
  suggestions: QuickAddSuggestion[];
};

function isoAddDays(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Suggests the next core lessons to schedule, based on what the user has
 * already completed. Each suggestion gets a minimum time (its estimate) and a
 * suggested day, spread out using the user's weekly-hours budget. Lessons
 * already added as todos are skipped.
 */
export async function getQuickAddData(
  userId: string,
  weeklyHours = 22,
  limit = 6,
): Promise<QuickAddData> {
  const rows = await db
    .select({
      id: schema.subtopics.id,
      title: schema.subtopics.title,
      topic: schema.topics.title,
      phase: schema.phases.title,
      phaseOrder: schema.phases.order,
      weekNumber: schema.weeks.weekNumber,
      topicOrder: schema.topics.order,
      subOrder: schema.subtopics.order,
      tier: schema.subtopics.tier,
      estMinutes: schema.subtopics.estMinutes,
    })
    .from(schema.subtopics)
    .innerJoin(schema.topics, eq(schema.subtopics.topicId, schema.topics.id))
    .innerJoin(schema.weeks, eq(schema.topics.weekId, schema.weeks.id))
    .innerJoin(schema.phases, eq(schema.topics.phaseId, schema.phases.id))
    .where(eq(schema.subtopics.tier, "core"))
    .orderBy(
      asc(schema.phases.order),
      asc(schema.weeks.weekNumber),
      asc(schema.topics.order),
      asc(schema.subtopics.order),
    );

  const prog = await db
    .select()
    .from(schema.subtopicProgress)
    .where(eq(schema.subtopicProgress.userId, userId));
  const statusById = new Map(prog.map((p) => [p.subtopicId, p.status]));

  const existingTodos = await db
    .select({ linkedId: schema.todos.linkedId })
    .from(schema.todos)
    .where(
      and(
        eq(schema.todos.userId, userId),
        eq(schema.todos.linkedType, "subtopic"),
      ),
    );
  const alreadyAdded = new Set(
    existingTodos.map((t) => t.linkedId).filter(Boolean) as string[],
  );

  let lastCompleted: QuickAddData["lastCompleted"] = null;
  let completedCount = 0;
  for (const r of rows) {
    if (statusById.get(r.id) === "done") {
      completedCount++;
      lastCompleted = { title: r.title, topic: r.topic, phase: r.phase };
    }
  }

  const dailyBudgetMin = Math.min(
    240,
    Math.max(30, Math.round((weeklyHours * 60) / 7)),
  );

  const next = rows
    .filter((r) => statusById.get(r.id) !== "done" && !alreadyAdded.has(r.id))
    .slice(0, limit);

  const suggestions: QuickAddSuggestion[] = [];
  let dayOffset = 0;
  let usedToday = 0;
  for (const r of next) {
    const est = r.estMinutes > 0 ? r.estMinutes : 45;
    if (usedToday > 0 && usedToday + est > dailyBudgetMin) {
      dayOffset++;
      usedToday = 0;
    }
    usedToday += est;
    suggestions.push({
      id: r.id,
      title: r.title,
      topic: r.topic,
      phase: r.phase,
      phaseOrder: r.phaseOrder,
      weekNumber: r.weekNumber,
      tier: r.tier,
      estMinutes: est,
      suggestedDate: isoAddDays(dayOffset),
    });
  }

  return {
    lastCompleted,
    completedCount,
    coreTotal: rows.length,
    dailyBudgetMin,
    suggestions,
  };
}

/** Compact curriculum index for the Todo lesson picker. */
export async function getTodoLessonOptions(): Promise<TodoLessonOption[]> {
  const key = `${ROADMAP_CACHE_PREFIX}:todo-lesson-options`;
  const cached = await cacheGet<TodoLessonOption[]>(key);
  if (cached) return cached;

  const rows = await db
    .select({
      id: schema.subtopics.id,
      title: schema.subtopics.title,
      topic: schema.topics.title,
      phase: schema.phases.title,
      phaseOrder: schema.phases.order,
      weekNumber: schema.weeks.weekNumber,
      tier: schema.subtopics.tier,
      estMinutes: schema.subtopics.estMinutes,
    })
    .from(schema.subtopics)
    .innerJoin(schema.topics, eq(schema.subtopics.topicId, schema.topics.id))
    .innerJoin(schema.weeks, eq(schema.topics.weekId, schema.weeks.id))
    .innerJoin(schema.phases, eq(schema.topics.phaseId, schema.phases.id))
    .orderBy(
      asc(schema.phases.order),
      asc(schema.weeks.weekNumber),
      asc(schema.topics.order),
      asc(schema.subtopics.order),
    );
  await cacheSet(key, rows, 60 * 60);
  return rows;
}
