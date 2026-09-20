import type { PhaseSeed } from "../types";

export const phase06: PhaseSeed = {
  order: 6,
  slug: "building-llm-apps",
  title: "Building LLM apps",
  subtitle: "APIs, prompting, structured output and tool calling",
  description:
    "Now you build. Call models through APIs, write prompts that hold up, force output into validated JSON and let models call your functions.",
  colorVar: 6,
  weekStart: 15,
  weekEnd: 16,
  doneWhen: [
    "You get valid JSON from a model every time, or fail loudly.",
    "You know what a request costs on the model you use.",
    "Your app runs at least one tool the model chooses.",
  ],
  antiPatternTitle: "Vibe prompting",
  antiPatternBody:
    "Changing prompts without a test set. Keep 20 fixed inputs and re-run them after every prompt change.",
  weeks: [
    {
      weekNumber: 15,
      title: "LLM APIs and prompting",
      summary: "API calls, prompting, streaming, tokens and cost.",
      shipTitle: "Streaming chatbot with cost display",
      shipDescription:
        "A streaming chatbot that shows token count and cost for every reply.",
      topics: [
        {
          slug: "llm-apis",
          title: "Calling model APIs",
          summary: "Messages, parameters, local models, cost.",
          whyItMatters:
            "Calling models correctly and cheaply is the core AI-engineering skill.",
          lane: "build",
          resources: [
            { key: "gemini-api-getting-started", role: "learn", rank: 0 },
            { key: "ollama-documentation", role: "learn" },
            { key: "gemini-via-the-openai-library", role: "learn" },
            { key: "groq-openai-compatibility", role: "learn" },
            { key: "openai-tokenizer", role: "practice" },
            { key: "ollama-masterclass-2026", role: "video" },
          ],
          subtopics: [
            {
              slug: "chat-messages",
              title: "Chat APIs: system, user, assistant messages",
              explanation:
                "Conversations are lists of role-tagged messages; the system message sets behaviour.",
              whyItMatters:
                "Message structure is the interface for every chat model.",
              prerequisites: ["Call REST APIs and keep keys in .env"],
              learningOutcomes: ["Send a multi-turn conversation", "Use a system prompt"],
              practicalTask: "Call a model with system+user messages and print the reply.",
              doneWhen: ["You get a coherent multi-turn reply"],
              estMinutes: 45,
            },
            {
              slug: "streaming",
              title: "Stream responses into a UI",
              explanation:
                "Stream tokens as they generate so the UI feels instant instead of waiting for the full reply.",
              whyItMatters:
                "Streaming is expected UX for chat apps.",
              prerequisites: ["Chat APIs: system, user, assistant messages", "async / await basics"],
              learningOutcomes: ["Stream tokens to a console or UI"],
              practicalTask: "Build a streaming chatbot UI.",
              doneWhen: ["Tokens appear progressively"],
              estMinutes: 60,
              resources: [{ key: "build-a-basic-llm-chat-app", role: "learn", rank: 0 }],
            },
            {
              slug: "tokens-cost",
              title: "Tokens, context windows, pricing and caching",
              explanation:
                "Count tokens to estimate cost and stay within context; cache repeated prompts and pick a model for the cost/quality tradeoff.",
              whyItMatters:
                "Cost awareness separates hobby projects from production thinking.",
              prerequisites: ["Stream responses into a UI"],
              learningOutcomes: [
                "Estimate the cost of a request",
                "Explain when caching helps",
              ],
              practicalTask: "Show token count and cost for every reply.",
              doneWhen: ["You know what a request costs on your model"],
              estMinutes: 45,
              resources: [
                { key: "prompt-caching", role: "learn", rank: 0 },
                { key: "openai-tokenizer", role: "practice" },
              ],
            },
          ],
        },
        {
          slug: "prompting",
          title: "Prompting that holds up",
          summary: "Clear tasks, examples, delimiters, and a test set.",
          whyItMatters:
            "Reliable prompts with a fixed test set beat endless vibe-tweaking.",
          lane: "learn",
          resources: [
            { key: "prompt-engineering-whitepaper", role: "learn", rank: 0 },
            { key: "prompt-engineering-overview", role: "learn" },
            { key: "interactive-prompt-engineering-tutorial", role: "practice" },
            { key: "prompt-engineering-guide", role: "learn" },
          ],
          subtopics: [
            {
              slug: "prompt-structure",
              title: "Prompts: clear task, examples, delimiters",
              explanation:
                "State the task plainly, show a few examples, and delimit inputs so the model does not confuse instructions with data.",
              whyItMatters:
                "Most 'model' failures are actually prompt failures.",
              prerequisites: ["Chat APIs: system, user, assistant messages"],
              learningOutcomes: ["Write a few-shot prompt with clear delimiters"],
              practicalTask: "Turn a vague prompt into a structured one with examples.",
              doneWhen: ["Output quality improves measurably"],
              estMinutes: 45,
            },
            {
              slug: "test-set",
              title: "A fixed test set for your prompts",
              explanation:
                "Keep 20 fixed inputs and re-run them after every prompt change to measure real improvement.",
              whyItMatters:
                "Without a test set you cannot tell progress from luck.",
              prerequisites: ["Prompts: clear task, examples, delimiters"],
              learningOutcomes: ["Build and reuse a prompt test set"],
              practicalTask: "Create 20 fixed inputs and score prompt versions against them.",
              doneWhen: ["Prompt changes are judged on the test set"],
              estMinutes: 45,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 16,
      title: "Structured output and tool calling",
      summary: "JSON schemas, Pydantic, function calling, retries.",
      shipTitle: "Document-to-JSON extractor",
      shipDescription:
        "A resume or invoice to JSON extractor, validated and tested on 20 files.",
      topics: [
        {
          slug: "structured-output",
          title: "Structured output",
          summary: "JSON mode, schemas, Pydantic validation, retries.",
          whyItMatters:
            "Reliable JSON is what lets LLMs plug into real software.",
          lane: "build",
          resources: [
            { key: "structured-model-outputs", role: "learn", rank: 0 },
            { key: "instructor-docs", role: "learn" },
          ],
          subtopics: [
            {
              slug: "json-schema-pydantic",
              title: "JSON mode vs schema-enforced output with Pydantic",
              explanation:
                "Define a Pydantic model and force the LLM to return output matching that schema, validating every field.",
              whyItMatters:
                "Schema enforcement turns flaky text into dependable data.",
              prerequisites: ["Classes, objects and dataclasses", "A fixed test set for your prompts"],
              learningOutcomes: [
                "Define a Pydantic output schema",
                "Validate model output against it",
              ],
              practicalTask: "Extract fields from a document into a validated Pydantic model.",
              doneWhen: ["Invalid output is caught, not silently used"],
              estMinutes: 75,
            },
            {
              slug: "retries",
              title: "Retries, timeouts and fallbacks",
              explanation:
                "Handle malformed output and transient failures with retries, timeouts and a fallback model.",
              whyItMatters:
                "Real APIs fail; robust apps recover instead of crashing.",
              prerequisites: ["JSON mode vs schema-enforced output with Pydantic"],
              learningOutcomes: ["Add retry-on-invalid and a timeout"],
              practicalTask: "Retry on invalid JSON and fall back on timeout.",
              doneWhen: ["The extractor fails loudly, never silently"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "tool-calling",
          title: "Tool / function calling",
          summary: "Define tools, handle calls, return results, multimodal.",
          whyItMatters:
            "Tool calling is the bridge from chat to agents that act.",
          lane: "build",
          resources: [
            { key: "function-calling-guide", role: "learn", rank: 0 },
            { key: "langchain-v1-overview", role: "learn" },
            { key: "generative-ai-using-langchain", role: "video" },
          ],
          subtopics: [
            {
              slug: "function-calling",
              title: "Function / tool calling end to end",
              explanation:
                "Describe tools with schemas, let the model choose one, run it, and feed the result back for the final answer.",
              whyItMatters:
                "This loop is the foundation of every agent you build next phase.",
              prerequisites: ["JSON mode vs schema-enforced output with Pydantic"],
              learningOutcomes: [
                "Define a tool schema",
                "Execute a model-chosen tool and return its result",
              ],
              practicalTask: "Give your app one tool the model can choose to call.",
              doneWhen: ["The model successfully calls your tool"],
              estMinutes: 75,
            },
            {
              slug: "multimodal",
              title: "Images and PDFs as inputs",
              explanation:
                "Send images or documents to multimodal models to extract or reason over their content.",
              whyItMatters:
                "Document extraction is a common, valuable real-world task.",
              prerequisites: ["Function / tool calling end to end"],
              learningOutcomes: ["Pass an image or PDF to a model"],
              practicalTask: "Extract structured data from a scanned document.",
              doneWhen: ["Extraction works on 20 test files"],
              estMinutes: 60,
            },
          ],
        },
      ],
    },
  ],
};
