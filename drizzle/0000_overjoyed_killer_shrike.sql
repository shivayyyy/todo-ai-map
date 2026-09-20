CREATE TABLE "activity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestone_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"milestone_id" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phases" (
	"id" text PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text NOT NULL,
	"color_var" integer NOT NULL,
	"week_start" integer NOT NULL,
	"week_end" integer NOT NULL,
	"done_when" jsonb NOT NULL,
	"anti_pattern_title" text,
	"anti_pattern_body" text,
	CONSTRAINT "phases_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"project_id" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"repo_url" text,
	"demo_url" text,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"phase_id" text NOT NULL,
	"number" integer NOT NULL,
	"original_week" integer NOT NULL,
	"origin" text DEFAULT 'pdf' NOT NULL,
	"kind" text DEFAULT 'portfolio' NOT NULL,
	"title" text NOT NULL,
	"problem" text NOT NULL,
	"why_useful" text NOT NULL,
	"real_world_problem" text,
	"learning_goal" text,
	"intuition_focus" text,
	"new_concepts" jsonb,
	"revisit_concepts" jsonb,
	"mix_note" text,
	"beginner_brief" text,
	"approach" jsonb,
	"resource_links" jsonb,
	"shipping" jsonb,
	"ideas" jsonb NOT NULL,
	"required_knowledge" jsonb NOT NULL,
	"features" jsonb NOT NULL,
	"proves" text NOT NULL,
	"extensions" jsonb,
	"start_resource_id" text
);
--> statement-breakpoint
CREATE TABLE "resource_selections" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subtopic_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"status" text DEFAULT 'chosen' NOT NULL,
	"time_spent_min" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"provider" text,
	"type" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"difficulty" text,
	"duration_text" text,
	"free_note" text,
	"source" text DEFAULT 'pdf' NOT NULL,
	"checked_date" text,
	"added_by_user_id" text
);
--> statement-breakpoint
CREATE TABLE "schedule_mappings" (
	"id" text PRIMARY KEY NOT NULL,
	"mode" text NOT NULL,
	"app_week" integer NOT NULL,
	"week_id" text NOT NULL,
	"focus" text
);
--> statement-breakpoint
CREATE TABLE "subtopic_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subtopic_id" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"evidence_url" text,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subtopic_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"subtopic_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"role" text DEFAULT 'learn' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subtopics" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"slug" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"explanation" text NOT NULL,
	"why_it_matters" text,
	"prerequisites" jsonb,
	"learning_outcomes" jsonb,
	"practical_task" text,
	"done_when" jsonb,
	"est_minutes" integer DEFAULT 0 NOT NULL,
	"source" text DEFAULT 'pdf' NOT NULL,
	"tier" text DEFAULT 'core' NOT NULL,
	"weight" double precision DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"lane" text DEFAULT 'learn' NOT NULL,
	"est_minutes" integer,
	"due_date" text,
	"due_time" text,
	"sort_order" double precision DEFAULT 0 NOT NULL,
	"linked_type" text,
	"linked_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"week_id" text NOT NULL,
	"phase_id" text NOT NULL,
	"slug" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"why_it_matters" text NOT NULL,
	"est_minutes" integer DEFAULT 0 NOT NULL,
	"lane" text DEFAULT 'learn' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"starting_point" text DEFAULT 'week0' NOT NULL,
	"weekly_hours" integer DEFAULT 22 NOT NULL,
	"target_date" text,
	"start_date" text,
	"mode" text DEFAULT 'accelerated' NOT NULL,
	"pref_language" text DEFAULT 'en' NOT NULL,
	"pref_resource_type" text DEFAULT 'any' NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weeks" (
	"id" text PRIMARY KEY NOT NULL,
	"phase_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"ship_title" text,
	"ship_description" text
);
--> statement-breakpoint
ALTER TABLE "milestone_progress" ADD CONSTRAINT "milestone_progress_milestone_id_project_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."project_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_progress" ADD CONSTRAINT "project_progress_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_phase_id_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_selections" ADD CONSTRAINT "resource_selections_subtopic_id_subtopics_id_fk" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_selections" ADD CONSTRAINT "resource_selections_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_mappings" ADD CONSTRAINT "schedule_mappings_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtopic_progress" ADD CONSTRAINT "subtopic_progress_subtopic_id_subtopics_id_fk" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtopic_resources" ADD CONSTRAINT "subtopic_resources_subtopic_id_subtopics_id_fk" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtopic_resources" ADD CONSTRAINT "subtopic_resources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtopics" ADD CONSTRAINT "subtopics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_phase_id_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weeks" ADD CONSTRAINT "weeks_phase_id_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_user_idx" ON "activity" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "msprog_user_idx" ON "milestone_progress" USING btree ("user_id","milestone_id");--> statement-breakpoint
CREATE INDEX "milestones_project_idx" ON "project_milestones" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projprog_user_idx" ON "project_progress" USING btree ("user_id","project_id");--> statement-breakpoint
CREATE INDEX "ressel_user_idx" ON "resource_selections" USING btree ("user_id","subtopic_id");--> statement-breakpoint
CREATE INDEX "subprog_user_idx" ON "subtopic_progress" USING btree ("user_id","subtopic_id");--> statement-breakpoint
CREATE INDEX "subres_subtopic_idx" ON "subtopic_resources" USING btree ("subtopic_id");--> statement-breakpoint
CREATE INDEX "subtopics_topic_idx" ON "subtopics" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "todos_user_idx" ON "todos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "topics_week_idx" ON "topics" USING btree ("week_id");--> statement-breakpoint
CREATE INDEX "weeks_phase_idx" ON "weeks" USING btree ("phase_id");