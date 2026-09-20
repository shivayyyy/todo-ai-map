import dns from "node:dns";
import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Some local networks have no IPv6 route; prefer IPv4 so the Neon fetch resolves.
dns.setDefaultResultOrder("ipv4first");
import { PHASES } from "../../data/phases";
import { ADDITIONAL_TOPICS } from "../../data/additional";
import { PROJECTS } from "../../data/projects";
import { PDF_RESOURCES } from "../../data/resources-pdf";
import { CURATED_RESOURCES } from "../../data/resources-curated";
import { ACCELERATED_SCHEDULE } from "../../data/schedule";
import { ROADMAP_SH_ADDITIONAL_TOPICS } from "../../data/roadmap-sh-additions";
import { CURATED_RESOURCE_MAPPINGS } from "../../data/curated-resource-mappings";
import type { ResourceRef, ResourceSeed, TopicSeed } from "../../data/types";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !databaseUrl.startsWith("postgres")) {
  throw new Error(
    "DATABASE_URL must be set to a Neon PostgreSQL connection string before seeding.",
  );
}

const sql = neon(databaseUrl);
const db = drizzle({ client: sql, schema });
const CHUNK_SIZE = 100;

function resId(key: string) {
  return `res_${key}`;
}

function chunks<T>(rows: T[]): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    result.push(rows.slice(i, i + CHUNK_SIZE));
  }
  return result;
}

async function main() {
  const allResources = new Map<string, ResourceSeed>();
  for (const resource of [...PDF_RESOURCES, ...CURATED_RESOURCES]) {
    if (!allResources.has(resource.key)) allResources.set(resource.key, resource);
  }

  const resourceRows: (typeof schema.resources.$inferInsert)[] = [
    ...allResources.values(),
  ].map((resource) => ({
    id: resId(resource.key),
    title: resource.title,
    url: resource.url,
    provider: resource.provider ?? null,
    type: resource.type,
    language: resource.language ?? "en",
    difficulty: resource.difficulty ?? null,
    durationText: resource.durationText ?? null,
    freeNote: resource.freeNote ?? null,
    source: resource.source ?? "pdf",
    checkedDate: resource.checkedDate ?? null,
  }));
  const phaseRows: (typeof schema.phases.$inferInsert)[] = [];
  const weekRows: (typeof schema.weeks.$inferInsert)[] = [];
  const topicRows: (typeof schema.topics.$inferInsert)[] = [];
  const subtopicRows: (typeof schema.subtopics.$inferInsert)[] = [];
  const subtopicResourceRows: (typeof schema.subtopicResources.$inferInsert)[] = [];
  const projectRows: (typeof schema.projects.$inferInsert)[] = [];
  const milestoneRows: (typeof schema.projectMilestones.$inferInsert)[] = [];
  const scheduleRows: (typeof schema.scheduleMappings.$inferInsert)[] = [];

  let missingRefs = 0;
  const seenLinks = new Set<string>();

  function linkResources(subtopicId: string, refs: ResourceRef[] | undefined) {
    if (!refs) return;
    for (const ref of refs) {
      if (!allResources.has(ref.key)) {
        missingRefs++;
        console.warn("Missing resource key:", ref.key);
        continue;
      }
      const role = ref.role ?? "learn";
      const id = `sr_${subtopicId}__${ref.key}__${role}`;
      if (seenLinks.has(id)) continue;
      seenLinks.add(id);
      subtopicResourceRows.push({
        id,
        subtopicId,
        resourceId: resId(ref.key),
        rank: ref.rank ?? 1,
        role,
      });
    }
  }

  function insertTopic(
    topic: TopicSeed,
    weekId: string,
    phaseId: string,
    order: number,
  ) {
    const topicId = `tp_${weekId}_${topic.slug}`;
    topicRows.push({
      id: topicId,
      weekId,
      phaseId,
      slug: topic.slug,
      order,
      title: topic.title,
      summary: topic.summary,
      whyItMatters: topic.whyItMatters,
      estMinutes: topic.estMinutes ?? 0,
      lane: topic.lane ?? "learn",
    });

    topic.subtopics.forEach((subtopic, index) => {
      const subtopicId = `st_${topicId}_${subtopic.slug}`;
      subtopicRows.push({
        id: subtopicId,
        topicId,
        slug: subtopic.slug,
        order: index,
        title: subtopic.title,
        explanation: subtopic.explanation,
        whyItMatters: subtopic.whyItMatters ?? null,
        prerequisites: subtopic.prerequisites ?? null,
        learningOutcomes: subtopic.learningOutcomes ?? null,
        practicalTask: subtopic.practicalTask ?? null,
        doneWhen: subtopic.doneWhen ?? null,
        estMinutes: subtopic.estMinutes ?? 0,
        source: subtopic.source ?? "pdf",
        tier: subtopic.tier ?? "core",
        weight: subtopic.weight ?? 1,
      });

      const phaseSlug = phaseId.replace(/^ph_/, "");
      const mappedRefs = CURATED_RESOURCE_MAPPINGS.filter(
        (mapping) =>
          mapping.phaseSlug === phaseSlug &&
          (!mapping.topicSlug || mapping.topicSlug === topic.slug) &&
          (!mapping.subtopicSlug || mapping.subtopicSlug === subtopic.slug),
      ).flatMap((mapping) => mapping.resources);
      const baseRefs = subtopic.resources ?? topic.resources ?? [];
      linkResources(subtopicId, [...baseRefs, ...mappedRefs]);
    });
  }

  for (const phase of PHASES) {
    const phaseId = `ph_${phase.slug}`;
    phaseRows.push({
      id: phaseId,
      order: phase.order,
      slug: phase.slug,
      title: phase.title,
      subtitle: phase.subtitle,
      description: phase.description,
      colorVar: phase.colorVar,
      weekStart: phase.weekStart,
      weekEnd: phase.weekEnd,
      doneWhen: phase.doneWhen,
      antiPatternTitle: phase.antiPatternTitle ?? null,
      antiPatternBody: phase.antiPatternBody ?? null,
    });

    let lastWeekId = "";
    let lastWeekTopicCount = 0;
    phase.weeks.forEach((week, weekIndex) => {
      const weekId = `wk_${week.weekNumber}`;
      weekRows.push({
        id: weekId,
        phaseId,
        weekNumber: week.weekNumber,
        order: weekIndex,
        title: week.title,
        summary: week.summary,
        shipTitle: week.shipTitle ?? null,
        shipDescription: week.shipDescription ?? null,
      });
      week.topics.forEach((topic, topicIndex) =>
        insertTopic(topic, weekId, phaseId, topicIndex),
      );
      lastWeekId = weekId;
      lastWeekTopicCount = week.topics.length;
    });

    const extras = [
      ...(ADDITIONAL_TOPICS[phase.slug] ?? []),
      ...(ROADMAP_SH_ADDITIONAL_TOPICS[phase.slug] ?? []),
    ];
    extras.forEach((topic, index) =>
      insertTopic(topic, lastWeekId, phaseId, lastWeekTopicCount + index),
    );
  }

  for (const project of PROJECTS) {
    const projectId = `pj_${project.number}`;
    projectRows.push({
      id: projectId,
      phaseId: `ph_${project.phaseSlug}`,
      number: project.number,
      originalWeek: project.originalWeek,
      origin: project.origin ?? "pdf",
      kind: project.kind ?? "portfolio",
      title: project.title,
      problem: project.problem,
      whyUseful: project.whyUseful,
      realWorldProblem: project.realWorldProblem ?? null,
      learningGoal: project.learningGoal ?? null,
      intuitionFocus: project.intuitionFocus ?? null,
      newConcepts: project.newConcepts ?? null,
      revisitConcepts: project.revisitConcepts ?? null,
      mixNote: project.mixNote ?? null,
      beginnerBrief: project.beginnerBrief ?? null,
      approach: project.approach ?? null,
      resourceLinks: project.resourceLinks ?? null,
      shipping: project.shipping ?? null,
      ideas: project.ideas,
      requiredKnowledge: project.requiredKnowledge,
      features: project.features,
      proves: project.proves,
      extensions: project.extensions ?? null,
      startResourceId: project.startResourceKey
        ? resId(project.startResourceKey)
        : null,
    });
    project.milestones.forEach((milestone, index) => {
      milestoneRows.push({
        id: `ms_${project.number}_${index}`,
        projectId,
        order: index,
        title: milestone.title,
        description: milestone.description,
      });
    });
  }

  for (const schedule of ACCELERATED_SCHEDULE) {
    for (const weekNumber of schedule.originalWeeks) {
      scheduleRows.push({
        id: `sc_accelerated_${schedule.appWeek}_${weekNumber}`,
        mode: "accelerated",
        appWeek: schedule.appWeek,
        weekId: `wk_${weekNumber}`,
        focus: schedule.focus,
      });
    }
  }

  // Idempotent for a fresh production database: interrupted runs can safely be
  // repeated. Existing content is never deleted and user progress is untouched.
  for (const batch of chunks(resourceRows))
    await db.insert(schema.resources).values(batch).onConflictDoNothing();
  await db.insert(schema.phases).values(phaseRows).onConflictDoNothing();
  await db.insert(schema.weeks).values(weekRows).onConflictDoNothing();
  for (const batch of chunks(topicRows))
    await db.insert(schema.topics).values(batch).onConflictDoNothing();
  for (const batch of chunks(subtopicRows))
    await db.insert(schema.subtopics).values(batch).onConflictDoNothing();
  for (const batch of chunks(subtopicResourceRows))
    await db.insert(schema.subtopicResources).values(batch).onConflictDoNothing();
  await db.insert(schema.projects).values(projectRows).onConflictDoNothing();
  await db.insert(schema.projectMilestones).values(milestoneRows).onConflictDoNothing();
  await db.insert(schema.scheduleMappings).values(scheduleRows).onConflictDoNothing();

  const [phaseCount] = await db.select({ value: count() }).from(schema.phases);
  const [topicCount] = await db.select({ value: count() }).from(schema.topics);
  const [subtopicCount] = await db.select({ value: count() }).from(schema.subtopics);
  const [projectCount] = await db.select({ value: count() }).from(schema.projects);
  const [resourceCount] = await db.select({ value: count() }).from(schema.resources);

  console.log("PostgreSQL seed complete:");
  console.log("  phases:", phaseCount.value);
  console.log("  topics:", topicCount.value);
  console.log("  subtopics:", subtopicCount.value);
  console.log("  projects:", projectCount.value);
  console.log("  resources:", resourceCount.value);
  if (missingRefs) console.warn("  missing resource refs:", missingRefs);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
