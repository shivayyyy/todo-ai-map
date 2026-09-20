import type { PhaseSeed } from "../types";

export const phase10: PhaseSeed = {
  order: 10,
  slug: "evals-and-production",
  title: "Evals and production",
  subtitle: "Measure quality, then ship to a public URL",
  description:
    "A demo is not a product. Measure quality, trace every call, defend against prompt injection, then ship a container that strangers can use.",
  colorVar: 10,
  weekStart: 22,
  weekEnd: 23,
  doneWhen: [
    "You know your failure rate, and which failures matter.",
    "Every request is traced with cost and latency.",
    "A stranger can use your app at a public URL.",
  ],
  antiPatternTitle: "No evals",
  antiPatternBody:
    "Shipping without measurement. If you cannot measure quality, you cannot improve it or prove it in an interview.",
  weeks: [
    {
      weekNumber: 22,
      title: "Evals, tracing and security",
      summary: "Error analysis, LLM-as-judge, tracing, prompt injection.",
      shipTitle: "Eval harness + tracing for your RAG app",
      shipDescription:
        "An eval harness and tracing for your RAG app, run on every change.",
      topics: [
        {
          slug: "evals",
          title: "Evals",
          summary: "Error analysis, eval sets, LLM-as-judge.",
          whyItMatters:
            "Evals are how you improve quality and prove it to an interviewer.",
          lane: "build",
          resources: [
            { key: "llm-evals-everything-you-need-to-know", role: "learn", rank: 0 },
            { key: "your-ai-product-needs-evals", role: "learn" },
            { key: "using-llm-as-a-judge-a-complete-guide", role: "learn" },
            { key: "llm-evaluation-for-builders", role: "video" },
          ],
          subtopics: [
            {
              slug: "error-analysis",
              title: "Error analysis: read outputs, label failures",
              explanation:
                "Read real outputs, label what went wrong, and turn those labels into an eval set.",
              whyItMatters:
                "Looking at data beats guessing; it reveals what to fix first.",
              prerequisites: ["Retrieval hit-rate and faithfulness scores"],
              learningOutcomes: ["Build an eval set from real failures"],
              practicalTask: "Label 20-50 real failures into categories.",
              doneWhen: ["You know which failures matter most"],
              estMinutes: 75,
            },
            {
              slug: "llm-judge",
              title: "LLM-as-judge, and checking the judge",
              explanation:
                "Use an LLM to score outputs against a rubric, and validate the judge against human labels.",
              whyItMatters:
                "An unchecked judge can be confidently wrong.",
              prerequisites: ["Error analysis: read outputs, label failures"],
              learningOutcomes: ["Build and validate an LLM judge"],
              practicalTask: "Score your app with a judge and spot-check it.",
              doneWhen: ["Your judge agrees with human labels on a sample"],
              estMinutes: 60,
            },
          ],
        },
        {
          slug: "tracing-security",
          title: "Tracing and security",
          summary: "Tracing with Langfuse/Phoenix, prompt injection, guardrails.",
          whyItMatters:
            "You cannot debug or secure what you cannot see.",
          lane: "build",
          resources: [
            { key: "langfuse-tracing-docs", role: "learn", rank: 0 },
            { key: "arize-phoenix", role: "learn" },
            { key: "owasp-top-10-for-llm-apps-2026", role: "learn" },
            { key: "prompt-injection-series", role: "learn" },
            { key: "agent-breaker-prompt-injection-game", role: "practice" },
          ],
          subtopics: [
            {
              slug: "tracing",
              title: "Tracing with Langfuse or Phoenix",
              explanation:
                "Record every model call with inputs, outputs, latency, tokens and cost so you can debug and monitor.",
              whyItMatters:
                "Tracing is the backbone of production observability.",
              prerequisites: ["LLM-as-judge, and checking the judge"],
              learningOutcomes: ["Add tracing to your RAG app"],
              practicalTask: "Trace every request with cost and latency.",
              doneWhen: ["Every request is traced"],
              estMinutes: 60,
            },
            {
              slug: "prompt-injection",
              title: "Prompt injection and the OWASP LLM Top 10",
              explanation:
                "Untrusted content can hijack your prompts; learn the OWASP risks and add input/output guardrails.",
              whyItMatters:
                "Injection is the defining security risk of LLM apps.",
              prerequisites: ["Tracing with Langfuse or Phoenix"],
              learningOutcomes: [
                "Explain direct vs indirect injection",
                "Add a basic input/output guardrail",
              ],
              practicalTask: "Attempt an injection on your app and mitigate it.",
              doneWhen: ["A basic injection is blocked"],
              estMinutes: 60,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 23,
      title: "Ship to production",
      summary: "FastAPI, Docker, deploy, caching, cost and latency.",
      shipTitle: "Dockerised app at a public URL",
      shipDescription:
        "A Dockerised app at a public URL with a cost and latency log.",
      topics: [
        {
          slug: "serve-ship",
          title: "Serve and ship",
          summary: "FastAPI serving, Docker, deploy, caching, retries.",
          whyItMatters:
            "The done-when for this phase is a working public URL.",
          lane: "build",
          resources: [
            { key: "docker-get-started", role: "learn", rank: 0 },
            { key: "vllm-quickstart", role: "learn" },
            { key: "ollama-quickstart", role: "learn" },
            { key: "made-with-ml", role: "course" },
            { key: "render", role: "practice" },
            { key: "hugging-face-spaces", role: "practice" },
            { key: "docker-tutorial-for-beginners", role: "video" },
          ],
          subtopics: [
            {
              slug: "fastapi-serve",
              title: "Serve your app with FastAPI and streaming",
              explanation:
                "Wrap your pipeline in a FastAPI service with streaming, validation and clear errors.",
              whyItMatters:
                "This is the service layer every deployment needs.",
              prerequisites: ["FastAPI routes, Pydantic models, /docs"],
              learningOutcomes: ["Serve your app behind FastAPI"],
              practicalTask: "Expose your RAG app via FastAPI with streaming.",
              doneWhen: ["The service runs and streams responses"],
              estMinutes: 60,
            },
            {
              slug: "docker-deploy",
              title: "Docker images, containers and deploy",
              explanation:
                "Containerise the app with a Dockerfile and deploy it to a free host so anyone can use it.",
              whyItMatters:
                "Containers make deploys reproducible and portable.",
              prerequisites: ["Serve your app with FastAPI and streaming"],
              learningOutcomes: [
                "Write a Dockerfile",
                "Deploy to a public URL",
              ],
              practicalTask: "Dockerise and deploy your app to a public URL.",
              doneWhen: ["A stranger can use your app at a URL"],
              estMinutes: 90,
            },
            {
              slug: "caching-cost",
              title: "Caching, rate limits, retries; log cost and latency",
              explanation:
                "Add caching, rate limits, timeouts, retries and a fallback, and log tokens/cost/latency per request.",
              whyItMatters:
                "These turn a demo into something safe and affordable to run.",
              prerequisites: ["Docker images, containers and deploy"],
              learningOutcomes: [
                "Add caching and rate limits",
                "Log cost and latency per request",
              ],
              practicalTask: "Add a cost and latency log to your deployed app.",
              doneWhen: ["Cost and latency are logged for every request"],
              estMinutes: 60,
            },
          ],
        },
      ],
    },
  ],
};
