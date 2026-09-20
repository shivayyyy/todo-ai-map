import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Better Auth tables                                                  */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Roadmap content (seeded, read-only for normal users)               */
/* ------------------------------------------------------------------ */

export const phases = pgTable("phases", {
  id: text("id").primaryKey(),
  order: integer("order").notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  colorVar: integer("color_var").notNull(),
  weekStart: integer("week_start").notNull(),
  weekEnd: integer("week_end").notNull(),
  doneWhen: jsonb("done_when").$type<string[]>().notNull(),
  antiPatternTitle: text("anti_pattern_title"),
  antiPatternBody: text("anti_pattern_body"),
});

export const weeks = pgTable(
  "weeks",
  {
    id: text("id").primaryKey(),
    phaseId: text("phase_id")
      .notNull()
      .references(() => phases.id, { onDelete: "cascade" }),
    weekNumber: integer("week_number").notNull(),
    order: integer("order").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    shipTitle: text("ship_title"),
    shipDescription: text("ship_description"),
  },
  (t) => [index("weeks_phase_idx").on(t.phaseId)],
);

export const topics = pgTable(
  "topics",
  {
    id: text("id").primaryKey(),
    weekId: text("week_id")
      .notNull()
      .references(() => weeks.id, { onDelete: "cascade" }),
    phaseId: text("phase_id")
      .notNull()
      .references(() => phases.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    order: integer("order").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    whyItMatters: text("why_it_matters").notNull(),
    estMinutes: integer("est_minutes").notNull().default(0),
    lane: text("lane").notNull().default("learn"),
  },
  (t) => [index("topics_week_idx").on(t.weekId)],
);

export const subtopics = pgTable(
  "subtopics",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    order: integer("order").notNull(),
    title: text("title").notNull(),
    explanation: text("explanation").notNull(),
    whyItMatters: text("why_it_matters"),
    prerequisites: jsonb("prerequisites").$type<string[]>(),
    learningOutcomes: jsonb("learning_outcomes").$type<string[]>(),
    practicalTask: text("practical_task"),
    doneWhen: jsonb("done_when").$type<string[]>(),
    estMinutes: integer("est_minutes").notNull().default(0),
    source: text("source").notNull().default("pdf"),
    tier: text("tier").notNull().default("core"),
    weight: doublePrecision("weight").notNull().default(1),
  },
  (t) => [index("subtopics_topic_idx").on(t.topicId)],
);

export const resources = pgTable("resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  provider: text("provider"),
  type: text("type").notNull(),
  language: text("language").notNull().default("en"),
  difficulty: text("difficulty"),
  durationText: text("duration_text"),
  freeNote: text("free_note"),
  source: text("source").notNull().default("pdf"),
  checkedDate: text("checked_date"),
  addedByUserId: text("added_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
});

export const subtopicResources = pgTable(
  "subtopic_resources",
  {
    id: text("id").primaryKey(),
    subtopicId: text("subtopic_id")
      .notNull()
      .references(() => subtopics.id, { onDelete: "cascade" }),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull().default(0),
    role: text("role").notNull().default("learn"),
  },
  (t) => [index("subres_subtopic_idx").on(t.subtopicId)],
);

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  phaseId: text("phase_id")
    .notNull()
    .references(() => phases.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  originalWeek: integer("original_week").notNull(),
  origin: text("origin").notNull().default("pdf"),
  kind: text("kind").notNull().default("portfolio"),
  title: text("title").notNull(),
  problem: text("problem").notNull(),
  whyUseful: text("why_useful").notNull(),
  realWorldProblem: text("real_world_problem"),
  learningGoal: text("learning_goal"),
  intuitionFocus: text("intuition_focus"),
  newConcepts: jsonb("new_concepts").$type<string[]>(),
  revisitConcepts: jsonb("revisit_concepts").$type<string[]>(),
  mixNote: text("mix_note"),
  beginnerBrief: text("beginner_brief"),
  approach: jsonb("approach").$type<string[]>(),
  resourceLinks: jsonb("resource_links").$type<{ label: string; url: string }[]>(),
  shipping: jsonb("shipping").$type<string[]>(),
  ideas: jsonb("ideas").$type<string[]>().notNull(),
  requiredKnowledge: jsonb("required_knowledge").$type<string[]>().notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  proves: text("proves").notNull(),
  extensions: jsonb("extensions").$type<string[]>(),
  startResourceId: text("start_resource_id"),
});

export const projectMilestones = pgTable(
  "project_milestones",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
  },
  (t) => [index("milestones_project_idx").on(t.projectId)],
);

export const scheduleMappings = pgTable("schedule_mappings", {
  id: text("id").primaryKey(),
  mode: text("mode").notNull(),
  appWeek: integer("app_week").notNull(),
  weekId: text("week_id")
    .notNull()
    .references(() => weeks.id, { onDelete: "cascade" }),
  focus: text("focus"),
});

/* ------------------------------------------------------------------ */
/* User-owned data                                                     */
/* ------------------------------------------------------------------ */

export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  startingPoint: text("starting_point").notNull().default("week0"),
  weeklyHours: integer("weekly_hours").notNull().default(22),
  targetDate: text("target_date"),
  startDate: text("start_date"),
  mode: text("mode").notNull().default("accelerated"),
  prefLanguage: text("pref_language").notNull().default("en"),
  prefResourceType: text("pref_resource_type").notNull().default("any"),
  onboarded: boolean("onboarded").notNull().default(false),
});

export const subtopicProgress = pgTable(
  "subtopic_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subtopicId: text("subtopic_id")
      .notNull()
      .references(() => subtopics.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("not_started"),
    evidenceUrl: text("evidence_url"),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("subprog_user_idx").on(t.userId, t.subtopicId)],
);

export const resourceSelections = pgTable(
  "resource_selections",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subtopicId: text("subtopic_id")
      .notNull()
      .references(() => subtopics.id, { onDelete: "cascade" }),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("chosen"),
    timeSpentMin: integer("time_spent_min").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("ressel_user_idx").on(t.userId, t.subtopicId)],
);

export const projectProgress = pgTable(
  "project_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("not_started"),
    repoUrl: text("repo_url"),
    demoUrl: text("demo_url"),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("projprog_user_idx").on(t.userId, t.projectId)],
);

export const milestoneProgress = pgTable(
  "milestone_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    milestoneId: text("milestone_id")
      .notNull()
      .references(() => projectMilestones.id, { onDelete: "cascade" }),
    done: boolean("done").notNull().default(false),
  },
  (t) => [index("msprog_user_idx").on(t.userId, t.milestoneId)],
);

export const todos = pgTable(
  "todos",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default("todo"),
    priority: text("priority").notNull().default("medium"),
    lane: text("lane").notNull().default("learn"),
    estMinutes: integer("est_minutes"),
    dueDate: text("due_date"),
    dueTime: text("due_time"),
    sortOrder: doublePrecision("sort_order").notNull().default(0),
    linkedType: text("linked_type"),
    linkedId: text("linked_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("todos_user_idx").on(t.userId)],
);

export const activity = pgTable(
  "activity",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    label: text("label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("activity_user_idx").on(t.userId, t.createdAt)],
);

export type Phase = typeof phases.$inferSelect;
export type Week = typeof weeks.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Subtopic = typeof subtopics.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
