import type { PhaseSeed } from "../types";

export const phase08: PhaseSeed = {
  order: 8,
  slug: "agents-and-mcp",
  title: "AI agents and MCP",
  subtitle: "Tools in a loop, connected to real systems, on a leash",
  description:
    "Agents are models that use tools in a loop until a task is done. Learn to build them, connect them to real systems through MCP, and keep them safe with limits and approvals.",
  colorVar: 8,
  weekStart: 19,
  weekEnd: 20,
  doneWhen: [
    "You can explain when a plain workflow beats an agent.",
    "Your agent stops itself: step, cost and approval limits.",
    "You have built and connected your own MCP server.",
  ],
  antiPatternTitle: "Framework first",
  antiPatternBody:
    "Starting with a multi-agent framework. Start with one model, a few good tools and a loop; add agents only when that fails.",
  weeks: [
    {
      weekNumber: 19,
      title: "Agent fundamentals",
      summary: "The agent loop, ReAct, tool design, memory, LangGraph.",
      shipTitle: "Research agent with tools and traces",
      shipDescription:
        "A research agent with search and calculator tools, a step limit and full traces.",
      topics: [
        {
          slug: "agent-loop",
          title: "The agent loop",
          summary: "Workflow vs agent, the model-tool-observation loop, ReAct.",
          whyItMatters:
            "Knowing when NOT to build an agent saves enormous complexity.",
          lane: "learn",
          resources: [
            { key: "building-e-ective-agents", role: "learn", rank: 0 },
            { key: "hugging-face-ai-agents-course", role: "course" },
            { key: "the-react-paper", role: "learn" },
            { key: "what-are-ai-agents-in-depth", role: "video" },
            { key: "agents-long-essay", role: "learn" },
          ],
          subtopics: [
            {
              slug: "workflow-vs-agent",
              title: "Workflow or agent: when autonomy helps",
              explanation:
                "A workflow follows fixed steps; an agent decides its own steps. Autonomy adds power and unpredictability.",
              whyItMatters:
                "Most tasks are better as workflows; agents are for open-ended ones.",
              prerequisites: ["Function / tool calling end to end"],
              learningOutcomes: ["Decide workflow vs agent for a task"],
              practicalTask: "Classify three tasks as workflow or agent and justify.",
              doneWhen: ["You can explain when a workflow beats an agent"],
              estMinutes: 45,
            },
            {
              slug: "loop-react",
              title: "The loop: model, tool, observation, and ReAct",
              explanation:
                "The agent reasons, calls a tool, observes the result, and repeats until done, interleaving reasoning and acting (ReAct).",
              whyItMatters:
                "This loop is the core of every agent framework.",
              prerequisites: ["Workflow or agent: when autonomy helps"],
              learningOutcomes: ["Trace one iteration of the loop"],
              practicalTask: "Implement a minimal reason-act-observe loop by hand.",
              doneWhen: ["Your loop calls a tool and uses its output"],
              estMinutes: 75,
            },
          ],
        },
        {
          slug: "tools-memory-langgraph",
          title: "Tools, memory and LangGraph",
          summary: "Tool design, short/long-term memory, state graphs.",
          whyItMatters:
            "Good tools and explicit state are what make agents reliable.",
          lane: "build",
          resources: [
            { key: "introduction-to-langgraph", role: "course", rank: 0 },
            { key: "writing-e-ective-tools-for-agents", role: "learn" },
            { key: "memory-overview", role: "learn" },
            { key: "agentic-ai-using-langgraph", role: "video" },
          ],
          subtopics: [
            {
              slug: "tool-design",
              title: "Tool design: names, schemas, errors",
              explanation:
                "Give tools clear names, typed schemas and helpful error messages so the model uses them correctly.",
              whyItMatters:
                "Most agent failures are bad tool descriptions, not bad models.",
              prerequisites: ["The loop: model, tool, observation, and ReAct"],
              learningOutcomes: ["Write a well-described tool schema"],
              practicalTask: "Give your agent a search and a calculator tool.",
              doneWhen: ["The agent picks the right tool for a query"],
              estMinutes: 60,
            },
            {
              slug: "memory",
              title: "Short- and long-term memory",
              explanation:
                "Short-term memory is the context window; long-term memory persists facts across sessions, often in a store.",
              whyItMatters:
                "Memory is what makes an agent feel coherent over time.",
              prerequisites: ["Tool design: names, schemas, errors"],
              learningOutcomes: ["Explain short vs long-term memory"],
              practicalTask: "Add simple memory of prior steps to your agent.",
              doneWhen: ["The agent references earlier steps"],
              estMinutes: 45,
            },
            {
              slug: "langgraph-limits",
              title: "LangGraph state, nodes, edges and step limits",
              explanation:
                "Model the agent as a graph with explicit state and hard limits on steps, tokens and cost, and capture full traces.",
              whyItMatters:
                "Explicit graphs and limits stop agents from looping forever.",
              prerequisites: ["Short- and long-term memory"],
              learningOutcomes: [
                "Build a LangGraph agent with a step limit",
                "Capture a trace of every step",
              ],
              practicalTask:
                "Build a research agent with a step limit and full traces.",
              doneWhen: [
                "The agent stops at its step limit",
                "Every step is traced",
              ],
              estMinutes: 90,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 20,
      title: "MCP, multi-agent and safety",
      summary: "MCP servers, human approval, multi-agent, guardrails.",
      shipTitle: "MCP server used by an agent that asks first",
      shipDescription:
        "An MCP server for a real API, used by an agent that asks before it acts.",
      topics: [
        {
          slug: "mcp",
          title: "Model Context Protocol",
          summary: "MCP tools, resources, prompts; build a server and client.",
          whyItMatters:
            "MCP is the emerging standard for giving models safe, real tools.",
          lane: "build",
          resources: [
            { key: "build-an-mcp-server", role: "learn", rank: 0 },
            { key: "what-is-mcp", role: "learn" },
            { key: "introduction-to-model-context-protocol", role: "course" },
            { key: "build-an-mcp-client", role: "learn" },
            { key: "mcp-inspector", role: "practice" },
            { key: "model-context-protocol", role: "video" },
          ],
          subtopics: [
            {
              slug: "mcp-primitives",
              title: "MCP: tools, resources, prompts",
              explanation:
                "MCP servers expose tools (actions), resources (data) and prompts to any MCP-aware client.",
              whyItMatters:
                "One MCP server can serve many agents and apps.",
              prerequisites: ["Tool design: names, schemas, errors"],
              learningOutcomes: ["Explain MCP's three primitives"],
              practicalTask: "Sketch which of your API's capabilities map to each primitive.",
              doneWhen: ["Your mapping is sensible"],
              estMinutes: 45,
            },
            {
              slug: "build-mcp-server",
              title: "Build an MCP server and connect a client",
              explanation:
                "Implement a server for a real API and connect it to an agent via an MCP client, testing with the Inspector.",
              whyItMatters:
                "Building your own server proves you can give models safe capabilities.",
              prerequisites: ["MCP: tools, resources, prompts"],
              learningOutcomes: [
                "Build and run an MCP server",
                "Connect it to an agent",
              ],
              practicalTask: "Build an MCP server for a real API.",
              doneWhen: ["An agent successfully uses your MCP server"],
              estMinutes: 120,
            },
          ],
        },
        {
          slug: "safety-multiagent",
          title: "Safety and multi-agent",
          summary: "Human approval, permissions, limits, orchestration.",
          whyItMatters:
            "Autonomous systems that act on the world need real guardrails.",
          lane: "build",
          resources: [
            { key: "interrupts-human-in-the-loop", role: "learn", rank: 0 },
            { key: "the-lethal-trifecta-for-ai-agents", role: "learn" },
            { key: "how-we-built-our-multi-agent-research-system", role: "learn" },
            { key: "demystifying-evals-for-ai-agents", role: "learn" },
          ],
          subtopics: [
            {
              slug: "human-approval",
              title: "Human approval before risky actions",
              explanation:
                "Pause the agent and require a person to approve anything that writes, pays or sends.",
              whyItMatters:
                "Ask-first is the simplest, strongest safety control.",
              prerequisites: ["Build an MCP server and connect a client"],
              learningOutcomes: ["Add an approval interrupt to an agent"],
              practicalTask: "Make your agent ask before any state-changing action.",
              doneWhen: ["The agent waits for approval on risky steps"],
              estMinutes: 60,
            },
            {
              slug: "limits-guardrails",
              title: "Permissions, step limits and cost limits",
              explanation:
                "Apply least privilege to tools and cap steps, tokens and cost on every run; avoid the lethal trifecta.",
              whyItMatters:
                "Hard limits prevent runaway loops and expensive mistakes.",
              prerequisites: ["Human approval before risky actions"],
              learningOutcomes: [
                "Set least-privilege tool access",
                "Cap steps, tokens and cost",
              ],
              practicalTask: "Add permission and cost/step limits to your agent.",
              doneWhen: ["The agent cannot exceed its limits"],
              estMinutes: 45,
            },
          ],
        },
      ],
    },
  ],
};
