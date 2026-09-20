export type ResourceType =
  | "course"
  | "playlist"
  | "video"
  | "docs"
  | "article"
  | "book"
  | "paper"
  | "tool"
  | "practice"
  | "github"
  | "job"
  | "newsletter"
  | "podcast"
  | "website";

export type ResourceSeed = {
  key: string;
  title: string;
  url: string;
  provider?: string;
  type: ResourceType;
  language?: "en" | "hi";
  difficulty?: "beginner" | "intermediate" | "advanced";
  durationText?: string;
  freeNote?: string;
  source?: "pdf" | "curated";
  checkedDate?: string;
};

export type ResourceRef = {
  key: string;
  role?: "learn" | "video" | "practice" | "course";
  rank?: number; // 0 = primary
};

export type SubtopicSeed = {
  slug: string;
  title: string;
  explanation: string;
  whyItMatters?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  practicalTask?: string;
  doneWhen?: string[];
  estMinutes?: number;
  source?: "pdf" | "curated";
  tier?: "core" | "additional";
  weight?: number;
  resources?: ResourceRef[];
};

export type TopicSeed = {
  slug: string;
  title: string;
  summary: string;
  whyItMatters: string;
  estMinutes?: number;
  lane?: "learn" | "build" | "practice" | "portfolio";
  subtopics: SubtopicSeed[];
  resources?: ResourceRef[]; // topic-level resources (also surfaced on subtopics without their own)
};

export type WeekSeed = {
  weekNumber: number;
  title: string;
  summary: string;
  shipTitle?: string;
  shipDescription?: string;
  topics: TopicSeed[];
};

export type PhaseSeed = {
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  colorVar: number;
  weekStart: number;
  weekEnd: number;
  doneWhen: string[];
  antiPatternTitle?: string;
  antiPatternBody?: string;
  weeks: WeekSeed[];
};

export type MilestoneSeed = { title: string; description: string };

export type ProjectLink = { label: string; url: string };

export type ProjectSeed = {
  number: number;
  phaseSlug: string;
  originalWeek: number;
  origin?: "pdf" | "curated";
  kind?: "portfolio" | "phase-capstone";
  title: string;
  problem: string;
  whyUseful: string;
  realWorldProblem?: string;
  learningGoal?: string;
  /** What mental model / intuition this project is designed to build. */
  intuitionFocus?: string;
  /** ~60% weight: concepts introduced in the current phase. */
  newConcepts?: string[];
  /** ~40% weight: earlier-phase concepts deliberately revisited. */
  revisitConcepts?: string[];
  /** One line explaining the 60/40 cumulative blend for this project. */
  mixNote?: string;
  /** Plain-language description a complete beginner can understand. */
  beginnerBrief?: string;
  /** Step-by-step "how to approach this" guidance. */
  approach?: string[];
  /** Curated links (docs, tutorials, tools) needed to build it. */
  resourceLinks?: ProjectLink[];
  /** How to ship / show this project (handles non-deployable artifacts like CLIs). */
  shipping?: string[];
  ideas: string[];
  requiredKnowledge: string[];
  features: string[];
  proves: string;
  extensions?: string[];
  startResourceKey?: string;
  milestones: MilestoneSeed[];
};

// accelerated 16-week schedule: appWeek -> original week numbers
export type ScheduleSeed = {
  appWeek: number;
  focus: string;
  originalWeeks: number[];
};
