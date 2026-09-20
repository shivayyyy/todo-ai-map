import type { ResourceRef } from "./types";

export type CuratedResourceMapping = {
  phaseSlug: string;
  topicSlug?: string;
  subtopicSlug?: string;
  resources: ResourceRef[];
};

/** Hindi resources retrieved from CampusX's public roadmap.sh node records. */
export const CURATED_RESOURCE_MAPPINGS: CuratedResourceMapping[] = [
  {
    phaseSlug: "programming-foundations",
    topicSlug: "setup",
    resources: [{ key: "campusx-python-ai", role: "video" }],
  },
  {
    phaseSlug: "programming-foundations",
    subtopicSlug: "modules-envs",
    resources: [{ key: "campusx-uv-python", role: "video" }],
  },
  {
    phaseSlug: "programming-foundations",
    topicSlug: "git",
    resources: [{ key: "campusx-git-github", role: "video" }],
  },
  {
    phaseSlug: "programming-foundations",
    topicSlug: "sql",
    resources: [{ key: "campusx-sql-ai", role: "video" }],
  },
  {
    phaseSlug: "programming-foundations",
    topicSlug: "http",
    resources: [{ key: "campusx-api-intro", role: "video" }],
  },
  {
    phaseSlug: "programming-foundations",
    topicSlug: "py-deep-dive",
    resources: [{ key: "campusx-python-ai", role: "video" }],
  },
  {
    phaseSlug: "programming-foundations",
    topicSlug: "dsa",
    resources: [{ key: "campusx-dsa-ai", role: "video" }],
  },
  {
    phaseSlug: "classical-ml",
    topicSlug: "ship-demo",
    resources: [{ key: "campusx-ml-projects", role: "video" }],
  },
  {
    phaseSlug: "deep-learning",
    subtopicSlug: "gans-diffusion",
    resources: [{ key: "campusx-gan", role: "video" }],
  },
  {
    phaseSlug: "rag",
    subtopicSlug: "vector-stores",
    resources: [{ key: "campusx-vector-databases", role: "video" }],
  },
  {
    phaseSlug: "agents-and-mcp",
    subtopicSlug: "frameworks-agents",
    resources: [{ key: "campusx-crewai", role: "video" }],
  },
  {
    phaseSlug: "evals-and-production",
    subtopicSlug: "tracing",
    resources: [{ key: "campusx-langsmith", role: "video" }],
  },
];
