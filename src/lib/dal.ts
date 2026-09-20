import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, asc, eq, inArray, isNull, or } from "drizzle-orm";
import { auth } from "./auth";
import { cacheGet, cacheSet, ROADMAP_CACHE_PREFIX } from "./cache";
import { db, schema } from "./db";

/* ------------------------------------------------------------------ */
/* Session / auth                                                      */
/* ------------------------------------------------------------------ */

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session.user;
});

export async function getProfile(userId: string) {
  const rows = await db
    .select()
    .from(schema.userProfiles)
    .where(eq(schema.userProfiles.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

/* ------------------------------------------------------------------ */
/* Roadmap content (public/seeded)                                     */
/* ------------------------------------------------------------------ */

export const getPhases = cache(async () => {
  const key = `${ROADMAP_CACHE_PREFIX}:phases`;
  const cached = await cacheGet<(typeof schema.phases.$inferSelect)[]>(key);
  if (cached) return cached;
  const rows = await db.select().from(schema.phases).orderBy(asc(schema.phases.order));
  await cacheSet(key, rows, 60 * 60);
  return rows;
});

export const getPhaseBySlug = cache(async (slug: string) => {
  const key = `${ROADMAP_CACHE_PREFIX}:phase:${slug}`;
  const cached = await cacheGet<typeof schema.phases.$inferSelect>(key);
  if (cached) return cached;
  const rows = await db
    .select()
    .from(schema.phases)
    .where(eq(schema.phases.slug, slug))
    .limit(1);
  const phase = rows[0] ?? null;
  if (phase) await cacheSet(key, phase, 60 * 60);
  return phase;
});

export async function getWeeksForPhase(phaseId: string) {
  return db
    .select()
    .from(schema.weeks)
    .where(eq(schema.weeks.phaseId, phaseId))
    .orderBy(asc(schema.weeks.order));
}

export async function getTopicsForPhase(phaseId: string) {
  return db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.phaseId, phaseId))
    .orderBy(asc(schema.topics.order));
}

export async function getSubtopicsForTopics(topicIds: string[]) {
  if (topicIds.length === 0) return [];
  return db
    .select()
    .from(schema.subtopics)
    .where(inArray(schema.subtopics.topicId, topicIds))
    .orderBy(asc(schema.subtopics.order));
}

export async function getProjectsForPhase(phaseId: string) {
  return db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.phaseId, phaseId))
    .orderBy(asc(schema.projects.number));
}

export async function getResourcesForSubtopic(
  userId: string,
  subtopicId: string,
) {
  return db
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
        eq(schema.subtopicResources.subtopicId, subtopicId),
        or(
          isNull(schema.resources.addedByUserId),
          eq(schema.resources.addedByUserId, userId),
        ),
      ),
    )
    .orderBy(asc(schema.subtopicResources.rank));
}

export async function getMilestonesForProject(projectId: string) {
  return db
    .select()
    .from(schema.projectMilestones)
    .where(eq(schema.projectMilestones.projectId, projectId))
    .orderBy(asc(schema.projectMilestones.order));
}

export const getSchedule = cache(async (mode = "accelerated") => {
  const key = `${ROADMAP_CACHE_PREFIX}:schedule:${mode}`;
  const cached = await cacheGet<(typeof schema.scheduleMappings.$inferSelect)[]>(key);
  if (cached) return cached;
  const rows = await db
    .select()
    .from(schema.scheduleMappings)
    .where(eq(schema.scheduleMappings.mode, mode))
    .orderBy(asc(schema.scheduleMappings.appWeek));
  await cacheSet(key, rows, 60 * 60);
  return rows;
});

/* ------------------------------------------------------------------ */
/* User progress (owner-scoped)                                        */
/* ------------------------------------------------------------------ */

export async function getSubtopicProgress(userId: string) {
  return db
    .select()
    .from(schema.subtopicProgress)
    .where(eq(schema.subtopicProgress.userId, userId));
}

export async function getResourceSelections(userId: string) {
  return db
    .select()
    .from(schema.resourceSelections)
    .where(eq(schema.resourceSelections.userId, userId));
}

export async function getProjectProgress(userId: string) {
  return db
    .select()
    .from(schema.projectProgress)
    .where(eq(schema.projectProgress.userId, userId));
}

export async function getMilestoneProgress(userId: string) {
  return db
    .select()
    .from(schema.milestoneProgress)
    .where(eq(schema.milestoneProgress.userId, userId));
}

export async function getTodos(userId: string) {
  return db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.userId, userId))
    .orderBy(asc(schema.todos.sortOrder), asc(schema.todos.createdAt));
}

export async function getResourceSelectionForSubtopic(
  userId: string,
  subtopicId: string,
) {
  const rows = await db
    .select()
    .from(schema.resourceSelections)
    .where(
      and(
        eq(schema.resourceSelections.userId, userId),
        eq(schema.resourceSelections.subtopicId, subtopicId),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}
