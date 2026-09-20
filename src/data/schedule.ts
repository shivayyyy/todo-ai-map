import type { ScheduleSeed } from "./types";

/**
 * Accelerated 16-week schedule (~22-24 h/week) mapping each app week to the
 * original roadmap weeks it covers. The original 24-week order is preserved;
 * this only compresses the calendar for a 4-month target.
 */
export const ACCELERATED_SCHEDULE: ScheduleSeed[] = [
  { appWeek: 1, focus: "Setup + Python basics", originalWeeks: [1] },
  { appWeek: 2, focus: "Real-world Python + Git/terminal/SQL", originalWeeks: [2, 3] },
  { appWeek: 3, focus: "APIs/FastAPI + NumPy/pandas", originalWeeks: [4, 5] },
  { appWeek: 4, focus: "Math you need + finish EDA", originalWeeks: [6] },
  { appWeek: 5, focus: "How machines learn", originalWeeks: [7] },
  { appWeek: 6, focus: "Trees, ensembles, clustering", originalWeeks: [8] },
  { appWeek: 7, focus: "End-to-end ML + neural nets from scratch", originalWeeks: [9, 10] },
  { appWeek: 8, focus: "PyTorch + CNNs/transfer learning", originalWeeks: [11, 12] },
  { appWeek: 9, focus: "Attention + tiny GPT", originalWeeks: [13] },
  { appWeek: 10, focus: "LLM internals + APIs/prompting", originalWeeks: [14, 15] },
  { appWeek: 11, focus: "Structured output + tool calling", originalWeeks: [16] },
  { appWeek: 12, focus: "Embeddings + first RAG", originalWeeks: [17] },
  { appWeek: 13, focus: "Hybrid retrieval + RAG evals", originalWeeks: [18] },
  { appWeek: 14, focus: "Agents + MCP + safety", originalWeeks: [19, 20] },
  { appWeek: 15, focus: "Fine-tuning + evals/tracing/security", originalWeeks: [21, 22] },
  { appWeek: 16, focus: "Production deploy + capstone + job hunt", originalWeeks: [23, 24] },
];
