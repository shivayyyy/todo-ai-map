"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, eq, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "./db";
import { requireUser } from "./dal";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function uid() {
  const user = await requireUser();
  return user.id;
}

function now() {
  return new Date();
}

/* ------------------------------------------------------------------ */
/* Subtopic progress                                                   */
/* ------------------------------------------------------------------ */

const statusSchema = z.enum(["not_started", "in_progress", "done"]);

export async function setSubtopicStatus(subtopicId: string, status: string) {
  const userId = await uid();
  const parsed = statusSchema.parse(status);
  const id = z.string().min(1).parse(subtopicId);

  const existing = await db
    .select()
    .from(schema.subtopicProgress)
    .where(
      and(
        eq(schema.subtopicProgress.userId, userId),
        eq(schema.subtopicProgress.subtopicId, id),
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.subtopicProgress)
      .set({ status: parsed, updatedAt: now() })
      .where(eq(schema.subtopicProgress.id, existing[0].id));
  } else {
    await db.insert(schema.subtopicProgress).values({
      id: randomUUID(),
      userId,
      subtopicId: id,
      status: parsed,
      updatedAt: now(),
    });
  }
  if (parsed !== "not_started") {
    await logActivity(
      userId,
      parsed === "done" ? "lesson_done" : "lesson_started",
      parsed === "done" ? "Completed a roadmap lesson" : "Started a roadmap lesson",
    );
  }
  revalidatePath("/plan");
}

export async function saveSubtopicNotes(
  subtopicId: string,
  notes: string,
  evidenceUrl: string,
) {
  const userId = await uid();
  const id = z.string().min(1).parse(subtopicId);
  const n = z.string().max(4000).parse(notes);
  const e = z.string().max(1000).parse(evidenceUrl);

  const existing = await db
    .select()
    .from(schema.subtopicProgress)
    .where(
      and(
        eq(schema.subtopicProgress.userId, userId),
        eq(schema.subtopicProgress.subtopicId, id),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db
      .update(schema.subtopicProgress)
      .set({ notes: n, evidenceUrl: e, updatedAt: now() })
      .where(eq(schema.subtopicProgress.id, existing[0].id));
  } else {
    await db.insert(schema.subtopicProgress).values({
      id: randomUUID(),
      userId,
      subtopicId: id,
      status: "in_progress",
      notes: n,
      evidenceUrl: e,
      updatedAt: now(),
    });
  }
  const contentChanged = existing[0]
    ? existing[0].notes !== n || existing[0].evidenceUrl !== e
    : Boolean(n.trim() || e.trim());
  if (contentChanged && (n.trim() || e.trim())) {
    await logActivity(
      userId,
      e.trim() ? "evidence" : "notes",
      e.trim() ? "Added learning evidence" : "Updated learning notes",
    );
  }
  revalidatePath("/plan");
}

/* ------------------------------------------------------------------ */
/* Resource selection + on-demand loading                              */
/* ------------------------------------------------------------------ */

export async function loadSubtopicResources(subtopicId: string) {
  const userId = await uid();
  const id = z.string().min(1).parse(subtopicId);
  const rows = await db
    .select({
      id: schema.resources.id,
      title: schema.resources.title,
      url: schema.resources.url,
      provider: schema.resources.provider,
      type: schema.resources.type,
      language: schema.resources.language,
      difficulty: schema.resources.difficulty,
      durationText: schema.resources.durationText,
      freeNote: schema.resources.freeNote,
      source: schema.resources.source,
      addedByUserId: schema.resources.addedByUserId,
      rank: schema.subtopicResources.rank,
      role: schema.subtopicResources.role,
    })
    .from(schema.subtopicResources)
    .innerJoin(
      schema.resources,
      eq(schema.subtopicResources.resourceId, schema.resources.id),
    )
    .where(
      and(
        eq(schema.subtopicResources.subtopicId, id),
        or(
          isNull(schema.resources.addedByUserId),
          eq(schema.resources.addedByUserId, userId),
        ),
      ),
    )
    .orderBy(schema.subtopicResources.rank);

  // Flag rows this user added so the UI can offer a delete control.
  return rows.map(({ addedByUserId, ...r }) => ({
    ...r,
    custom: r.source === "user" && addedByUserId === userId,
  }));
}

const addResourceInput = z.object({
  subtopicId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(300),
  url: z.string().trim().url("Enter a valid URL").max(1000),
  type: z
    .enum([
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
    ])
    .default("article"),
  provider: z.string().trim().max(120).optional(),
  language: z.enum(["en", "hi"]).default("en"),
});

export async function addResourceToSubtopic(
  input: z.infer<typeof addResourceInput>,
) {
  const userId = await uid();
  const data = addResourceInput.parse(input);

  // Confirm the subtopic exists before linking anything to it.
  const sub = await db
    .select({ id: schema.subtopics.id })
    .from(schema.subtopics)
    .where(eq(schema.subtopics.id, data.subtopicId))
    .limit(1);
  if (!sub[0]) throw new Error("Subtopic not found");

  // Place new resources after existing ones (larger rank sorts last).
  const existing = await db
    .select({ rank: schema.subtopicResources.rank })
    .from(schema.subtopicResources)
    .where(eq(schema.subtopicResources.subtopicId, data.subtopicId));
  const nextRank =
    existing.reduce((max, r) => Math.max(max, r.rank ?? 0), 0) + 1;

  const resourceId = randomUUID();
  await db.insert(schema.resources).values({
    id: resourceId,
    title: data.title,
    url: data.url,
    provider: data.provider || null,
    type: data.type,
    language: data.language,
    source: "user",
    addedByUserId: userId,
  });
  await db.insert(schema.subtopicResources).values({
    id: randomUUID(),
    subtopicId: data.subtopicId,
    resourceId,
    rank: nextRank,
    role: "learn",
  });

  await logActivity(userId, "resource", `Added a resource: ${data.title}`);
  revalidatePath("/plan");

  return {
    id: resourceId,
    title: data.title,
    url: data.url,
    provider: data.provider || null,
    type: data.type,
    language: data.language,
    difficulty: null as string | null,
    durationText: null as string | null,
    freeNote: null as string | null,
    source: "user",
    rank: nextRank,
    role: "learn",
    custom: true,
  };
}

export async function deleteResource(resourceId: string) {
  const userId = await uid();
  const rid = z.string().min(1).parse(resourceId);

  // Only allow deleting resources this user added; never seeded content.
  const rows = await db
    .select({ id: schema.resources.id, addedByUserId: schema.resources.addedByUserId, source: schema.resources.source })
    .from(schema.resources)
    .where(eq(schema.resources.id, rid))
    .limit(1);
  const row = rows[0];
  if (!row || row.source !== "user" || row.addedByUserId !== userId) {
    throw new Error("Not allowed to delete this resource");
  }

  // Cascades remove subtopic_resources links and any resource_selections.
  await db.delete(schema.resources).where(eq(schema.resources.id, rid));
  revalidatePath("/plan");
}

export async function chooseResource(subtopicId: string, resourceId: string) {
  const userId = await uid();
  const sid = z.string().min(1).parse(subtopicId);
  const rid = z.string().min(1).parse(resourceId);

  const existing = await db
    .select()
    .from(schema.resourceSelections)
    .where(
      and(
        eq(schema.resourceSelections.userId, userId),
        eq(schema.resourceSelections.subtopicId, sid),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db
      .update(schema.resourceSelections)
      .set({ resourceId: rid, updatedAt: now() })
      .where(eq(schema.resourceSelections.id, existing[0].id));
  } else {
    await db.insert(schema.resourceSelections).values({
      id: randomUUID(),
      userId,
      subtopicId: sid,
      resourceId: rid,
      status: "chosen",
      updatedAt: now(),
    });
  }
  revalidatePath("/plan");
}

/* ------------------------------------------------------------------ */
/* Projects + milestones                                               */
/* ------------------------------------------------------------------ */

export async function setProjectStatus(projectId: string, status: string) {
  const userId = await uid();
  const pid = z.string().min(1).parse(projectId);
  const st = z.enum(["not_started", "in_progress", "done"]).parse(status);
  const existing = await db
    .select()
    .from(schema.projectProgress)
    .where(
      and(
        eq(schema.projectProgress.userId, userId),
        eq(schema.projectProgress.projectId, pid),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db
      .update(schema.projectProgress)
      .set({ status: st, updatedAt: now() })
      .where(eq(schema.projectProgress.id, existing[0].id));
  } else {
    await db.insert(schema.projectProgress).values({
      id: randomUUID(),
      userId,
      projectId: pid,
      status: st,
      updatedAt: now(),
    });
  }
  if (st !== "not_started") {
    await logActivity(
      userId,
      st === "done" ? "project_done" : "project_started",
      st === "done" ? "Shipped a roadmap project" : "Started a roadmap project",
    );
  }
  revalidatePath("/plan");
}

export async function saveProjectLinks(
  projectId: string,
  repoUrl: string,
  demoUrl: string,
) {
  const userId = await uid();
  const pid = z.string().min(1).parse(projectId);
  const repo = z.string().max(500).parse(repoUrl);
  const demo = z.string().max(500).parse(demoUrl);
  const existing = await db
    .select()
    .from(schema.projectProgress)
    .where(
      and(
        eq(schema.projectProgress.userId, userId),
        eq(schema.projectProgress.projectId, pid),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db
      .update(schema.projectProgress)
      .set({ repoUrl: repo, demoUrl: demo, updatedAt: now() })
      .where(eq(schema.projectProgress.id, existing[0].id));
  } else {
    await db.insert(schema.projectProgress).values({
      id: randomUUID(),
      userId,
      projectId: pid,
      status: "in_progress",
      repoUrl: repo,
      demoUrl: demo,
      updatedAt: now(),
    });
  }
  const linksChanged = existing[0]
    ? existing[0].repoUrl !== (repo || null) || existing[0].demoUrl !== (demo || null)
    : Boolean(repo || demo);
  if (linksChanged && (repo || demo)) {
    await logActivity(userId, "project_evidence", "Saved project evidence");
  }
  revalidatePath("/plan");
}

export async function toggleMilestone(milestoneId: string, done: boolean) {
  const userId = await uid();
  const mid = z.string().min(1).parse(milestoneId);
  const existing = await db
    .select()
    .from(schema.milestoneProgress)
    .where(
      and(
        eq(schema.milestoneProgress.userId, userId),
        eq(schema.milestoneProgress.milestoneId, mid),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db
      .update(schema.milestoneProgress)
      .set({ done })
      .where(eq(schema.milestoneProgress.id, existing[0].id));
  } else {
    await db.insert(schema.milestoneProgress).values({
      id: randomUUID(),
      userId,
      milestoneId: mid,
      done,
    });
  }
  if (done) {
    await logActivity(userId, "milestone", "Completed a project milestone");
  }
  revalidatePath("/plan");
}

/* ------------------------------------------------------------------ */
/* Todos                                                               */
/* ------------------------------------------------------------------ */

const todoInput = z.object({
  title: z.string().min(1).max(300),
  notes: z.string().max(4000).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  lane: z.string().trim().min(1).max(40).default("personal"),
  estMinutes: z.coerce.number().int().min(0).max(100000).optional(),
  dueDate: z.string().max(20).optional(),
  dueTime: z.string().max(10).optional(),
  linkedType: z.string().max(30).optional(),
  linkedId: z.string().max(80).optional(),
});

export async function addTodo(input: z.infer<typeof todoInput>) {
  const userId = await uid();
  const data = todoInput.parse(input);
  const id = randomUUID();
  const createdAt = now();
  const todo = {
    id,
    userId,
    title: data.title,
    notes: data.notes ?? null,
    status: "todo",
    priority: data.priority,
    lane: data.lane,
    estMinutes: data.estMinutes ?? null,
    dueDate: data.dueDate || null,
    dueTime: data.dueTime || null,
    sortOrder: Date.now(),
    linkedType: data.linkedType ?? "custom",
    linkedId: data.linkedId ?? null,
    createdAt,
    completedAt: null,
  };
  await db.insert(schema.todos).values(todo);
  await logActivity(
    userId,
    data.linkedType === "subtopic" ? "lesson_planned" : "todo_added",
    data.linkedType === "subtopic" ? "Planned a roadmap lesson" : "Added a todo",
  );
  revalidatePath("/todo");
  revalidatePath("/plan");
  return todo;
}

const roadmapTodoItem = z.object({
  title: z.string().min(1).max(300),
  estMinutes: z.coerce.number().int().min(0).max(100000).optional(),
  dueDate: z.string().max(20).optional(),
  linkedId: z.string().max(80).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

/** Quick-add several roadmap lessons as todos in one go. */
export async function addRoadmapTodos(
  items: z.infer<typeof roadmapTodoItem>[],
) {
  const userId = await uid();
  const parsed = z.array(roadmapTodoItem).min(1).max(30).parse(items);
  const createdAt = now();
  const base = Date.now();
  const rows = parsed.map((d, i) => ({
    id: randomUUID(),
    userId,
    title: d.title,
    notes: null as string | null,
    status: "todo",
    priority: d.priority,
    lane: "lesson",
    estMinutes: d.estMinutes ?? null,
    dueDate: d.dueDate || null,
    dueTime: null as string | null,
    sortOrder: base + i,
    linkedType: "subtopic",
    linkedId: d.linkedId ?? null,
    createdAt,
    completedAt: null as Date | null,
  }));
  await db.insert(schema.todos).values(rows);
  await logActivity(
    userId,
    "todo",
    `Quick-added ${rows.length} roadmap lesson${rows.length > 1 ? "s" : ""}`,
  );
  revalidatePath("/todo");
  revalidatePath("/plan");
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    notes: r.notes,
    status: r.status,
    priority: r.priority,
    lane: r.lane,
    estMinutes: r.estMinutes,
    dueDate: r.dueDate,
    dueTime: r.dueTime,
    linkedType: r.linkedType,
    linkedId: r.linkedId,
  }));
}

export async function updateTodo(
  id: string,
  patch: Partial<z.infer<typeof todoInput>> & { status?: string },
) {
  const userId = await uid();
  const tid = z.string().min(1).parse(id);
  const set: Record<string, unknown> = {};
  if (patch.title !== undefined) set.title = z.string().min(1).max(300).parse(patch.title);
  if (patch.notes !== undefined) set.notes = z.string().max(4000).parse(patch.notes);
  if (patch.priority !== undefined)
    set.priority = z.enum(["low", "medium", "high"]).parse(patch.priority);
  if (patch.lane !== undefined)
    set.lane = z.string().trim().min(1).max(40).parse(patch.lane);
  if (patch.estMinutes !== undefined) set.estMinutes = patch.estMinutes;
  if (patch.dueDate !== undefined) set.dueDate = patch.dueDate || null;
  if (patch.dueTime !== undefined) set.dueTime = patch.dueTime || null;
  if (patch.status !== undefined) {
    const st = z.enum(["todo", "doing", "done"]).parse(patch.status);
    set.status = st;
    set.completedAt = st === "done" ? now() : null;
  }
  await db
    .update(schema.todos)
    .set(set)
    .where(and(eq(schema.todos.id, tid), eq(schema.todos.userId, userId)));
  if (patch.status === "done") {
    await logActivity(userId, "todo_done", "Completed a todo");
  }
  revalidatePath("/todo");
}

export async function deleteTodo(id: string) {
  const userId = await uid();
  const tid = z.string().min(1).parse(id);
  await db
    .delete(schema.todos)
    .where(and(eq(schema.todos.id, tid), eq(schema.todos.userId, userId)));
  revalidatePath("/todo");
}

export async function reorderTodo(id: string, sortOrder: number) {
  const userId = await uid();
  const tid = z.string().min(1).parse(id);
  await db
    .update(schema.todos)
    .set({ sortOrder })
    .where(and(eq(schema.todos.id, tid), eq(schema.todos.userId, userId)));
  revalidatePath("/todo");
}

/* ------------------------------------------------------------------ */
/* Profile / onboarding                                                */
/* ------------------------------------------------------------------ */

const profileInput = z.object({
  startingPoint: z.enum(["week0", "week3", "week5", "week13"]).default("week0"),
  weeklyHours: z.coerce.number().int().min(4).max(80).default(22),
  targetDate: z.string().max(20).optional(),
  startDate: z.string().max(20).optional(),
  mode: z.enum(["accelerated", "original"]).default("accelerated"),
  prefLanguage: z.enum(["en", "hi", "any"]).default("en"),
  prefResourceType: z.string().max(30).default("any"),
});

export async function saveProfile(input: z.infer<typeof profileInput>) {
  const userId = await uid();
  const data = profileInput.parse(input);
  const existing = await db
    .select()
    .from(schema.userProfiles)
    .where(eq(schema.userProfiles.userId, userId))
    .limit(1);
  const values = {
    userId,
    startingPoint: data.startingPoint,
    weeklyHours: data.weeklyHours,
    targetDate: data.targetDate || null,
    startDate: data.startDate || null,
    mode: data.mode,
    prefLanguage: data.prefLanguage,
    prefResourceType: data.prefResourceType,
    onboarded: true,
  };
  if (existing[0]) {
    await db
      .update(schema.userProfiles)
      .set(values)
      .where(eq(schema.userProfiles.userId, userId));
  } else {
    await db.insert(schema.userProfiles).values(values);
  }
  revalidatePath("/plan");
}

async function logActivity(userId: string, type: string, label: string) {
  await db.insert(schema.activity).values({
    id: randomUUID(),
    userId,
    type,
    label,
    createdAt: now(),
  });
}
