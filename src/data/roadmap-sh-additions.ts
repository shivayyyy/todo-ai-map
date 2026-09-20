import type { TopicSeed } from "./types";

/**
 * Optional depth recovered from CampusX's public roadmap.sh graph.
 * These additions do not change the four-month core path.
 */
export const ROADMAP_SH_ADDITIONAL_TOPICS: Record<string, TopicSeed[]> = {
  "programming-foundations": [
    {
      slug: "ai-assisted-coding",
      title: "AI-assisted coding",
      summary: "Use coding agents after you can read and debug the code yourself.",
      whyItMatters:
        "Coding agents can accelerate implementation, but only foundational skill lets you verify, debug and improve their output.",
      lane: "learn",
      resources: [
        { key: "campusx-agentic-coding", role: "video", rank: 0 },
      ],
      subtopics: [
        {
          slug: "ai-coding-workflow",
          title: "Prompt, inspect, test and refactor AI-generated code",
          explanation:
            "Use one coding agent to explore a codebase, propose a plan and implement small changes. Read every diff, run tests and ask the agent to explain unfamiliar code instead of accepting it blindly.",
          whyItMatters:
            "The productive workflow is AI-assisted engineering, not replacing Python knowledge with generated code.",
          learningOutcomes: [
            "Give a coding agent scoped, evidence-based instructions",
            "Review generated diffs and verify them with tests",
            "Recognise when the agent is guessing",
          ],
          practicalTask:
            "Use a coding agent to add one small feature to an existing Python project, then review and test every changed line.",
          doneWhen: [
            "You can explain the final code without the agent",
            "The change passes tests and you reviewed the diff",
          ],
          estMinutes: 60,
          tier: "additional",
          source: "curated",
        },
      ],
    },
  ],
  "classical-ml": [
    {
      slug: "modality-primers",
      title: "Data modality primers",
      summary:
        "Optional foundations for text, images and ordered time-series data before applying deep learning.",
      whyItMatters:
        "Each modality has its own cleaning, representation, validation and leakage rules. Pick one aligned to your target role; do not attempt all three during the core plan.",
      lane: "learn",
      subtopics: [
        {
          slug: "classical-nlp-primer",
          title: "Classical NLP: clean, represent and classify text",
          explanation:
            "Normalize and tokenize text, represent it with bag-of-words, n-grams or TF-IDF, then build a leakage-safe pipeline with Naive Bayes, logistic regression or an SVM.",
          practicalTask:
            "Build a TF-IDF plus logistic-regression sentiment or spam classifier.",
          doneWhen: [
            "Preprocessing lives inside the pipeline",
            "You report precision and recall on unseen text",
          ],
          estMinutes: 150,
          tier: "additional",
          source: "curated",
          resources: [
            { key: "campusx-nlp", role: "video", rank: 0 },
          ],
        },
        {
          slug: "classical-cv-primer",
          title: "Classical computer vision: image operations and features",
          explanation:
            "Read and resize images, work with colour spaces and thresholds, then understand edges, keypoints, descriptors and geometric or morphological transformations.",
          practicalTask:
            "Build an OpenCV pipeline that cleans an image and detects document or object boundaries.",
          doneWhen: [
            "You can explain every transformation in the pipeline",
            "The same pipeline works on several unseen images",
          ],
          estMinutes: 150,
          tier: "additional",
          source: "curated",
          resources: [
            { key: "campusx-image-processing", role: "video", rank: 0 },
          ],
        },
        {
          slug: "time-series-primer",
          title: "Time-series: order, trends, seasonality and validation",
          explanation:
            "Treat time as ordered data: inspect trends and seasonality, create lag and rolling features, establish a naive baseline and validate without shuffling the future into the past.",
          practicalTask:
            "Forecast a weekly series with a naive baseline and one classical model using time-aware validation.",
          doneWhen: [
            "Your split preserves time order",
            "Your model is compared against a naive forecast",
          ],
          estMinutes: 150,
          tier: "additional",
          source: "curated",
          resources: [
            { key: "stats-for-data-science", role: "video", rank: 0 },
          ],
        },
      ],
    },
  ],
  "building-llm-apps": [
    {
      slug: "context-engineering",
      title: "Context engineering",
      summary:
        "Select, structure, compress and budget everything the model sees at inference time.",
      whyItMatters:
        "An LLM is stateless and can only act on its current context. Good context selection often improves an application more than changing its prompt or model.",
      lane: "learn",
      resources: [
        { key: "e-ective-context-engineering", role: "learn", rank: 0 },
      ],
      subtopics: [
        {
          slug: "context-selection-budgeting",
          title: "Context selection, structure, compression and token budgets",
          explanation:
            "Decide which system instructions, user history, retrieved passages, tool results and memories belong in the current request; order and compress them to fit the context window.",
          learningOutcomes: [
            "Distinguish memory from context",
            "Allocate a token budget across instructions, evidence and output",
            "Detect context overflow and stale or irrelevant context",
          ],
          practicalTask:
            "Instrument an LLM request to show how its token budget is divided, then remove low-value context without lowering quality.",
          doneWhen: [
            "The request stays within its budget",
            "Removing context does not reduce fixed-set quality",
          ],
          estMinutes: 90,
          tier: "additional",
          source: "curated",
        },
      ],
    },
  ],
  "agents-and-mcp": [
    {
      slug: "ai-automation",
      title: "AI workflow automation",
      summary:
        "Use trigger-based tools such as n8n or Make for deterministic business workflows with selected AI steps.",
      whyItMatters:
        "Not every automation needs an autonomous agent. Visual workflow tools are often cheaper, safer and easier to maintain for repeatable business processes.",
      lane: "build",
      resources: [
        { key: "campusx-n8n", role: "video", rank: 0 },
        { key: "campusx-make", role: "video" },
      ],
      subtopics: [
        {
          slug: "triggered-ai-workflows",
          title: "Triggers, conditions, retries and AI steps",
          explanation:
            "Create a workflow triggered by an event, route it with explicit conditions, call an LLM only where judgment is needed, and add retries plus human approval before side effects.",
          practicalTask:
            "Build an email-triage workflow that classifies a message, routes it, drafts a reply and requires approval before sending.",
          doneWhen: [
            "The deterministic steps do not depend on an agent",
            "Failures retry safely and sending requires approval",
          ],
          estMinutes: 120,
          tier: "additional",
          source: "curated",
        },
      ],
    },
  ],
};
