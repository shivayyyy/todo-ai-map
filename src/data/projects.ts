import type { ProjectSeed } from "./types";

/**
 * Projects fall into two kinds:
 *  - "portfolio": the 12 projects from the source roadmap (origin: pdf)
 *  - "phase-capstone": 1 cumulative "intuition" project per phase (origin: curated).
 *    Each is designed to BUILD INTUITION for the current phase while deliberately
 *    revisiting earlier phases in a ~60% new / ~40% prior blend (spaced repetition),
 *    so learning topic C also re-exercises topics A and B.
 *
 * Every project also carries beginner guidance: a plain-language `beginnerBrief`,
 * a step-by-step `approach`, and curated `resourceLinks` so a newcomer knows
 * exactly what to build and where to learn it.
 */

export const PROJECTS: ProjectSeed[] = [
  /* =============================== PDF PORTFOLIO (12) =============== */
  {
    number: 1,
    phaseSlug: "programming-foundations",
    originalWeek: 4,
    origin: "pdf",
    kind: "portfolio",
    title: "API wrapper service",
    problem:
      "Public APIs are useful but raw: no caching, no validation, no docs. Wrap one behind your own clean service.",
    whyUseful:
      "Proves you can build and test a real web service, the base skill for serving models later.",
    beginnerBrief:
      "You'll build a tiny web server that sits in front of someone else's public API (like weather or cricket scores). Your server calls theirs, tidies up the response, remembers recent answers so it's fast, and shows friendly errors. Think of it as a polite receptionist for a messy API.",
    approach: [
      "Pick one free public API and write down the 2 endpoints you want to expose.",
      "Create a FastAPI app with those endpoints; call the upstream API with httpx.",
      "Describe the response shape with a Pydantic model so bad data is caught early.",
      "Add simple in-memory caching and clear error messages for when the upstream fails.",
      "Write 2-3 tests, check the auto /docs page, then push to GitHub with a README.",
    ],
    resourceLinks: [
      { label: "FastAPI tutorial (user guide)", url: "https://fastapi.tiangolo.com/tutorial/" },
      { label: "HTTPX (HTTP client)", url: "https://www.python-httpx.org/" },
      { label: "Free public APIs to practise on", url: "https://github.com/public-apis/public-apis" },
      { label: "FastAPI for ML (Hindi playlist)", url: "https://www.youtube.com/playlist?list=PLKnIA16_RmvZ41tjbKB2ZnwchfniNsMuQ" },
    ],
    ideas: [
      "Weather for Indian cities",
      "Live cricket scores",
      "News headlines by topic",
      "Currency or crypto rates",
    ],
    requiredKnowledge: ["FastAPI", "HTTP clients", "Pydantic", "pytest", ".env secrets"],
    features: [
      "Two or more endpoints wrapping a public API",
      "Response caching",
      "Input validation and clear errors",
      "Auto-generated /docs",
      "Tests for the happy path and failures",
    ],
    proves: "You can build and test a real web service.",
    shipping: [
      "Deploy the API free to Render or Google Cloud Run and share the live /docs URL.",
      "Put the code on GitHub with a README, example requests, and the live link.",
      "Paste the repo and live URL into this project's Repo/Demo fields below.",
    ],
    startResourceKey: "fastapi-tutorial-user-guide",
    milestones: [
      { title: "Pick an API and design endpoints", description: "Choose a public API and sketch two endpoints and their response models." },
      { title: "Implement with FastAPI + httpx", description: "Call the upstream API, validate with Pydantic, and return clean JSON." },
      { title: "Add caching and error handling", description: "Cache responses and handle upstream failures gracefully." },
      { title: "Test and document", description: "Write tests and confirm /docs works, then push with a README." },
    ],
  },
  {
    number: 2,
    phaseSlug: "data-and-math",
    originalWeek: 6,
    origin: "pdf",
    kind: "portfolio",
    title: "India data story",
    problem:
      "Raw public datasets hide insight. Clean one and tell a clear, honest story with charts.",
    whyUseful: "Proves you can reason with messy, real data.",
    beginnerBrief:
      "You'll take a real, messy public dataset (say air quality) and turn it into a short, honest story: clean it up, draw a few charts that each answer one question, and write what you found. This is the everyday work of anyone who uses data.",
    approach: [
      "Download a real dataset from data.gov.in or Kaggle and load it in pandas.",
      "Clean it: fix missing values, wrong types and duplicates, noting each fix.",
      "Ask five simple questions and make one chart that answers each.",
      "Write five plain findings and one recommendation in the notebook.",
      "Publish the notebook so others can read the story.",
    ],
    resourceLinks: [
      { label: "Kaggle Learn: Pandas", url: "https://www.kaggle.com/learn/pandas" },
      { label: "Kaggle Learn: Data Cleaning", url: "https://www.kaggle.com/learn/data-cleaning" },
      { label: "Kaggle Learn: Data Visualization", url: "https://www.kaggle.com/learn/data-visualization" },
      { label: "data.gov.in datasets", url: "https://www.data.gov.in/" },
    ],
    ideas: ["Air quality", "Rainfall", "Public transport", "Education or census"],
    requiredKnowledge: ["pandas", "cleaning", "EDA", "visualization"],
    features: [
      "A cleaned real Indian dataset",
      "Five charts that each answer one question",
      "Five written findings",
      "One clear recommendation",
    ],
    proves: "You can reason with messy, real data.",
    shipping: [
      "This is a notebook, not an app: publish it as a public Kaggle notebook or a GitHub repo with the rendered .ipynb (viewable via nbviewer).",
      "Add a short README with your five findings and the recommendation.",
      "Link the notebook URL as the project's demo below.",
    ],
    startResourceKey: "data-gov-in-datasets",
    milestones: [
      { title: "Find and load a dataset", description: "Pick a real dataset from data.gov.in or Kaggle and load it." },
      { title: "Clean it", description: "Handle missing values, dtypes and duplicates; document each fix." },
      { title: "Make five charts", description: "Each chart answers exactly one question." },
      { title: "Write findings", description: "Write five findings and one recommendation in the notebook." },
    ],
  },
  {
    number: 3,
    phaseSlug: "classical-ml",
    originalWeek: 9,
    origin: "pdf",
    kind: "portfolio",
    title: "Churn predictor app",
    problem:
      "Businesses lose customers silently. Predict who will churn so they can intervene.",
    whyUseful: "Proves you can train, evaluate and ship a model.",
    beginnerBrief:
      "You'll build a model that guesses which customers are about to leave a service, then put it behind a simple web app anyone can try. The twist: 'leavers' are rare, so plain accuracy lies, and you'll learn to measure honestly.",
    approach: [
      "Get a churn dataset (telecom or subscriptions) and split it into train/test cleanly.",
      "Build one scikit-learn Pipeline that preprocesses and trains a model together.",
      "Because churn is imbalanced, report precision and recall for the rare class, not accuracy.",
      "Save the trained model to a file you can load back.",
      "Wrap it in a Streamlit or Gradio app and deploy a public demo.",
    ],
    resourceLinks: [
      { label: "Kaggle Learn: Intermediate ML", url: "https://www.kaggle.com/learn/intermediate-machine-learning" },
      { label: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
      { label: "StatQuest: Machine Learning", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF" },
      { label: "Gradio quickstart", url: "https://www.gradio.app/guides/quickstart" },
    ],
    ideas: ["Telecom churn", "Subscription churn", "Bank customer attrition"],
    requiredKnowledge: ["scikit-learn pipelines", "imbalanced data", "metrics", "Streamlit/Gradio"],
    features: [
      "A pipeline with the right metric for imbalance",
      "Honest precision/recall for the rare class",
      "A saved, loadable model",
      "A live Streamlit demo",
    ],
    proves: "You can train, evaluate and ship a model.",
    shipping: [
      "Deploy the Streamlit/Gradio app free to Streamlit Community Cloud or Hugging Face Spaces.",
      "Commit the pipeline and the saved model to GitHub with a README.",
      "Add both the live link and repo below.",
    ],
    startResourceKey: "kaggle-learn-intermediate-ml",
    milestones: [
      { title: "Frame and split", description: "Frame the task, split cleanly, and note leakage risks." },
      { title: "Build a pipeline", description: "Preprocess and model inside one scikit-learn Pipeline." },
      { title: "Handle imbalance and evaluate", description: "Report precision/recall for the rare class, not just accuracy." },
      { title: "Deploy a demo", description: "Publish a Streamlit or Gradio demo with a public link." },
    ],
  },
  {
    number: 4,
    phaseSlug: "deep-learning",
    originalWeek: 12,
    origin: "pdf",
    kind: "portfolio",
    title: "Photo classifier on Spaces",
    problem:
      "You want a model that recognises your own categories of images, deployed for anyone to try.",
    whyUseful: "Proves you can train deep nets and publish them.",
    beginnerBrief:
      "You'll teach a computer to recognise your own image categories (say plant species) by re-using a model that already knows about images, then put it online so anyone can upload a photo and get an answer.",
    approach: [
      "Collect and label a few hundred images into your own categories.",
      "Start from a pretrained CNN and fine-tune it (transfer learning) instead of training from zero.",
      "Add data augmentation so the model sees varied examples, and watch the training curves.",
      "Check test accuracy and look at what it gets wrong.",
      "Deploy a Gradio demo to Hugging Face Spaces for free.",
    ],
    resourceLinks: [
      { label: "Practical Deep Learning for Coders (fast.ai)", url: "https://course.fast.ai/" },
      { label: "PyTorch: Learn the Basics", url: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html" },
      { label: "Gradio quickstart", url: "https://www.gradio.app/guides/quickstart" },
      { label: "Hugging Face Spaces", url: "https://huggingface.co/docs/hub/spaces-overview" },
    ],
    ideas: ["Plant species", "Food dishes", "Waste sorting", "Landmarks"],
    requiredKnowledge: ["PyTorch", "transfer learning", "augmentation", "Gradio", "Hugging Face Spaces"],
    features: [
      "A pretrained CNN fine-tuned on your own photos",
      "Data augmentation",
      "Training curves and test accuracy",
      "A free public Gradio demo on Spaces",
    ],
    proves: "You can train deep nets and publish them.",
    shipping: [
      "Deploy the Gradio demo to Hugging Face Spaces (free) so anyone can upload a photo.",
      "Push the training code and curves to GitHub.",
      "Link the Space and the repo below.",
    ],
    startResourceKey: "practical-deep-learning-for-coders",
    milestones: [
      { title: "Collect and label photos", description: "Gather your own images into labelled categories." },
      { title: "Fine-tune a pretrained model", description: "Transfer-learn a CNN and track training curves." },
      { title: "Evaluate", description: "Report test accuracy and inspect misclassifications." },
      { title: "Publish on Spaces", description: "Deploy a Gradio demo to Hugging Face Spaces." },
    ],
  },
  {
    number: 5,
    phaseSlug: "transformers-and-llms",
    originalWeek: 13,
    origin: "pdf",
    kind: "portfolio",
    title: "Tiny GPT from scratch",
    problem:
      "LLMs feel like magic until you build one. Train a small character-level transformer yourself.",
    whyUseful: "Proves you understand LLMs from the inside.",
    beginnerBrief:
      "You'll build a very small version of the technology behind ChatGPT, character by character, and train it on text you like. It won't be smart, but building it once removes the magic and shows you exactly how these models work.",
    approach: [
      "Follow Karpathy's 'Let's build GPT' video and code along, don't just watch.",
      "Implement self-attention and a transformer block in PyTorch yourself.",
      "Train on a small text file (Shakespeare, lyrics, your notes) and watch the loss fall.",
      "Add temperature and top-k controls to change how the samples read.",
      "Write a README with generated samples and a short explanation of how it works.",
    ],
    resourceLinks: [
      { label: "Let's build GPT from scratch (Karpathy)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" },
      { label: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
      { label: "Transformer Explainer (interactive)", url: "https://poloclub.github.io/transformer-explainer/" },
      { label: "Let's build the GPT Tokenizer", url: "https://www.youtube.com/watch?v=zduSFxRajkE" },
    ],
    ideas: ["Train on Shakespeare", "Train on song lyrics", "Train on your own writing"],
    requiredKnowledge: ["self-attention", "transformer blocks", "PyTorch", "sampling"],
    features: [
      "A character-level transformer you wrote",
      "Trained on text you chose",
      "Temperature and sampling controls",
      "Generated samples in the README",
    ],
    proves: "You understand LLMs from the inside.",
    shipping: [
      "A training script is not deployable as a website: ship a GitHub repo with the code, a README showing generated samples, and an Add-in-Colab button.",
      "Record a short GIF or asciinema of it generating text.",
      "Link the repo below as your evidence.",
    ],
    startResourceKey: "let-s-build-gpt-from-scratch-in-code",
    milestones: [
      { title: "Build the blocks", description: "Implement attention and a transformer block from scratch." },
      { title: "Train", description: "Train on a text corpus you chose and watch the loss fall." },
      { title: "Add sampling controls", description: "Expose temperature and top-k and generate samples." },
      { title: "Document", description: "Write up how it works and include generated samples." },
    ],
  },
  {
    number: 6,
    phaseSlug: "building-llm-apps",
    originalWeek: 16,
    origin: "pdf",
    kind: "portfolio",
    title: "Document-to-JSON extractor",
    problem:
      "Turning messy documents into structured data by hand is slow. Make an LLM do it reliably.",
    whyUseful: "Proves you can make model output reliable.",
    beginnerBrief:
      "You'll make an LLM read messy documents (like resumes or invoices) and return clean, predictable JSON every time. The real skill is making a chatty model behave reliably, with retries when it messes up.",
    approach: [
      "Decide the exact fields you want out and write them as a Pydantic model.",
      "Prompt an LLM to fill that schema from a document; validate the output against it.",
      "When the model returns invalid JSON, retry with the error fed back in.",
      "Collect 20 sample documents and measure how often it succeeds.",
      "Handle timeouts and clearly report failures.",
    ],
    resourceLinks: [
      { label: "OpenAI: Structured outputs", url: "https://developers.openai.com/api/docs/guides/structured-outputs" },
      { label: "Instructor (structured LLM output)", url: "https://python.useinstructor.com/" },
      { label: "OpenAI: Function calling guide", url: "https://developers.openai.com/api/docs/guides/function-calling" },
      { label: "Prompt engineering guide", url: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    ],
    ideas: ["Resumes to JSON", "Invoices to JSON", "Receipts to JSON"],
    requiredKnowledge: ["structured output", "Pydantic", "retries", "multimodal input"],
    features: [
      "Documents parsed into a validated Pydantic schema",
      "Retries on invalid output",
      "A 20-document test set",
      "Clear failure handling",
    ],
    proves: "You can make model output reliable.",
    shipping: [
      "Deploy the extraction API to Render, or if you keep it local, record a 60-90s demo video (Loom/GIF) of it turning docs into JSON.",
      "Include sample inputs/outputs and your 20-document accuracy in the README.",
      "Link the repo and demo below.",
    ],
    startResourceKey: "instructor-docs",
    milestones: [
      { title: "Define the schema", description: "Model the target output as a Pydantic schema." },
      { title: "Extract with validation", description: "Prompt the model and validate against the schema." },
      { title: "Add retries and fallbacks", description: "Retry on invalid JSON and handle timeouts." },
      { title: "Test on 20 files", description: "Run and report accuracy on a fixed 20-document set." },
    ],
  },
  {
    number: 7,
    phaseSlug: "rag",
    originalWeek: 18,
    origin: "pdf",
    kind: "portfolio",
    title: "Notes RAG with citations",
    problem:
      "You cannot search your own notes by meaning. Build a RAG app that answers from them with citations.",
    whyUseful: "Proves you can ground answers and measure them.",
    beginnerBrief:
      "You'll build a chatbot that answers questions using your own documents and shows exactly where each answer came from. This 'retrieval-augmented generation' is how most real AI assistants stay accurate.",
    approach: [
      "Chunk your documents into small pieces and store them in a vector database.",
      "On a question, retrieve the most similar chunks and pass them to the LLM.",
      "Make every answer include citations back to the source chunks.",
      "Improve retrieval with hybrid search and a reranker.",
      "Write 30 test questions and measure quality before and after your improvements.",
    ],
    resourceLinks: [
      { label: "LangChain semantic search tutorial", url: "https://docs.langchain.com/oss/python/langchain/knowledge-base" },
      { label: "Chroma: getting started", url: "https://docs.trychroma.com/docs/overview/getting-started" },
      { label: "Chunking strategies (Pinecone)", url: "https://www.pinecone.io/learn/chunking-strategies/" },
      { label: "Evaluate a RAG system (Ragas)", url: "https://docs.ragas.io/en/stable/getstarted/rag_eval/" },
    ],
    ideas: ["College notes", "Company docs", "A book or PDF library"],
    requiredKnowledge: ["embeddings", "vector store", "hybrid search", "reranking", "RAG evals"],
    features: [
      "Chat over your documents",
      "Hybrid search and reranking",
      "Citations in every answer",
      "A 30-question eval with before/after scores",
    ],
    proves: "You can ground answers and measure them.",
    shipping: [
      "Deploy the chat UI to Streamlit Community Cloud or Hugging Face Spaces.",
      "Put the code and your 30-question eval results in the README.",
      "Link the live app and the repo below.",
    ],
    startResourceKey: "langchain-semantic-search-tutorial",
    milestones: [
      { title: "Ingest and index", description: "Chunk documents and index them in a vector store." },
      { title: "Answer with citations", description: "Retrieve, generate and cite sources for every answer." },
      { title: "Improve retrieval", description: "Add hybrid search and reranking." },
      { title: "Evaluate", description: "Score 30 questions before and after your improvements." },
    ],
  },
  {
    number: 8,
    phaseSlug: "agents-and-mcp",
    originalWeek: 19,
    origin: "pdf",
    kind: "portfolio",
    title: "Research agent",
    problem:
      "Manual research is slow. Build an agent that searches and computes to answer research questions, safely.",
    whyUseful: "Proves you can build agents that do not loop forever.",
    beginnerBrief:
      "You'll build an 'agent': an LLM that can decide to use tools (like web search and a calculator) in a loop to answer a research question. The key skill is keeping it on a leash so it stops instead of looping forever.",
    approach: [
      "Set up a reason-act-observe loop with LangGraph.",
      "Give it two tools, a search tool and a calculator, with clear input schemas.",
      "Add a hard limit on the number of steps so it can't loop endlessly.",
      "Log a trace of every step so you can see what it did.",
      "Test it on a real research question and handle failures gracefully.",
    ],
    resourceLinks: [
      { label: "Introduction to LangGraph", url: "https://academy.langchain.com/courses/intro-to-langgraph" },
      { label: "Building effective agents (Anthropic)", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "The ReAct paper", url: "https://arxiv.org/abs/2210.03629" },
      { label: "Hugging Face AI Agents Course", url: "https://huggingface.co/learn/agents-course/unit0/introduction" },
    ],
    ideas: ["Market research helper", "Literature summariser", "Fact-checker"],
    requiredKnowledge: ["agent loop", "tool design", "LangGraph", "step limits", "tracing"],
    features: [
      "Search and calculator tools",
      "Hard step limits",
      "A full trace of every step",
      "Graceful failure",
    ],
    proves: "You can build agents that do not loop forever.",
    shipping: [
      "Agents are interactive: deploy a small Gradio chat, or ship a repo plus a demo video and screenshots of the step traces.",
      "Document the tools and step limits in the README.",
      "Link the repo and demo/video below.",
    ],
    startResourceKey: "introduction-to-langgraph",
    milestones: [
      { title: "Build the loop", description: "Implement a reason-act-observe loop with LangGraph." },
      { title: "Add tools", description: "Add search and calculator tools with clear schemas." },
      { title: "Add limits and traces", description: "Cap steps and capture a trace of every step." },
      { title: "Demo", description: "Show it answering a real research question end to end." },
    ],
  },
  {
    number: 9,
    phaseSlug: "agents-and-mcp",
    originalWeek: 20,
    origin: "pdf",
    kind: "portfolio",
    title: "MCP server for a real API",
    problem:
      "Agents need safe, real capabilities. Expose a real API through your own MCP server.",
    whyUseful: "Proves you can give models safe, real tools.",
    beginnerBrief:
      "You'll build an MCP server, a standard way to safely hand real abilities (like reading your GitHub or calendar) to an AI agent. You control exactly what it can do and require approval before anything risky.",
    approach: [
      "Pick a real API (GitHub, Notion, a todo app) and list the safe actions to expose.",
      "Build an MCP server that maps those actions to tools with clear schemas.",
      "Test it with the MCP Inspector before connecting any agent.",
      "Connect an agent and have it complete a task using your tools.",
      "Require human approval before any action that changes data.",
    ],
    resourceLinks: [
      { label: "Build an MCP server", url: "https://modelcontextprotocol.io/docs/develop/build-server" },
      { label: "MCP Inspector", url: "https://modelcontextprotocol.io/docs/tools/inspector" },
      { label: "Hugging Face MCP Course", url: "https://huggingface.co/learn/mcp-course/unit0/introduction" },
      { label: "What is MCP?", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
    ],
    ideas: ["GitHub", "Notion", "Google Calendar", "A todo/issue tracker"],
    requiredKnowledge: ["MCP", "tool schemas", "human-in-the-loop", "least privilege"],
    features: [
      "An MCP server for a real API",
      "Used by an agent",
      "Ask-first approval on risky actions",
      "Least-privilege tool access",
    ],
    proves: "You can give models safe, real tools.",
    shipping: [
      "An MCP server has no web URL to visit: ship it as a GitHub repo (optionally a published package) plus a demo video/GIF of an agent or the MCP Inspector using it.",
      "Document the tools and how to run it in the README.",
      "Link the repo (and the video) below.",
    ],
    startResourceKey: "build-an-mcp-server",
    milestones: [
      { title: "Design the server", description: "Map the API to MCP tools, resources and prompts." },
      { title: "Implement and test", description: "Build the server and test it with the MCP Inspector." },
      { title: "Connect an agent", description: "Have an agent use the server to complete a task." },
      { title: "Add approval", description: "Require human approval before any state-changing action." },
    ],
  },
  {
    number: 10,
    phaseSlug: "fine-tuning",
    originalWeek: 21,
    origin: "pdf",
    kind: "portfolio",
    title: "LoRA fine-tune",
    problem:
      "For a narrow, repeated task a small tuned model can beat a big one. Fine-tune and prove it.",
    whyUseful: "Proves you know when fine-tuning pays off.",
    beginnerBrief:
      "You'll take a small open model and lightly retrain it (with LoRA) to be great at one narrow task, then prove with numbers that your tuned model beats the untuned one. The lesson is judgment: knowing when tuning is worth it.",
    approach: [
      "Choose one narrow, repetitive task (e.g. classify support tickets).",
      "Build a small, clean instruction dataset of examples for that task.",
      "Fine-tune a small open model with LoRA/QLoRA on a free GPU (Colab/Kaggle).",
      "Compare the base model vs your tuned model on a fixed eval set.",
      "Publish the adapter with a model card describing data, method and results.",
    ],
    resourceLinks: [
      { label: "Unsloth fine-tuning guide", url: "https://unsloth.ai/docs/get-started/fine-tuning-llms-guide" },
      { label: "PEFT quicktour (LoRA)", url: "https://huggingface.co/docs/peft/quicktour" },
      { label: "HF LLM Course: fine-tuning", url: "https://huggingface.co/learn/llm-course/chapter11/1" },
      { label: "Is fine-tuning still valuable?", url: "https://hamel.dev/blog/posts/fine_tuning_valuable.html" },
    ],
    ideas: ["Classify support tickets", "Format a specific output style", "Domain-specific rewriting"],
    requiredKnowledge: ["LoRA/QLoRA", "Unsloth/TRL", "instruction data", "evals", "model cards"],
    features: [
      "A LoRA fine-tune of a small open model",
      "A narrow, well-defined task",
      "A before/after eval on a fixed set",
      "A model card with data, method and results",
    ],
    proves: "You know when fine-tuning pays off.",
    shipping: [
      "The deliverable is the model itself: publish the LoRA adapter to the Hugging Face Hub with a model card (data, method, before/after eval).",
      "Keep the training code on GitHub.",
      "Link the Hugging Face model page as the demo below.",
    ],
    startResourceKey: "unsloth-ne-tuning-guide",
    milestones: [
      { title: "Prepare data", description: "Build a clean instruction dataset for one task." },
      { title: "Train the adapter", description: "Fine-tune with LoRA/QLoRA on a free GPU." },
      { title: "Evaluate", description: "Compare base vs tuned on a fixed eval set." },
      { title: "Publish", description: "Push the adapter and write a model card." },
    ],
  },
  {
    number: 11,
    phaseSlug: "evals-and-production",
    originalWeek: 23,
    origin: "pdf",
    kind: "portfolio",
    title: "Production RAG service",
    problem:
      "A RAG demo is not a product. Make yours observable, safe and deployed for real users.",
    whyUseful: "Proves you can run AI in production.",
    beginnerBrief:
      "You'll take a working RAG demo and make it production-ready: it runs in Docker, every change is checked by automated evals, it has safety guardrails, and you can see its cost and speed on a dashboard. This is what 'shipping' really means.",
    approach: [
      "Take your notes RAG and add an eval harness that runs on every change.",
      "Add tracing so each request records its cost and latency.",
      "Add input/output guardrails to defend against prompt injection.",
      "Containerise the app with Docker for reproducible deploys.",
      "Deploy to a public URL and watch a cost/latency dashboard.",
    ],
    resourceLinks: [
      { label: "Langfuse tracing docs", url: "https://langfuse.com/docs" },
      { label: "Ragas (RAG evals)", url: "https://docs.ragas.io/en/stable/" },
      { label: "Docker: get started", url: "https://docs.docker.com/get-started/" },
      { label: "OWASP Top 10 for LLM Apps", url: "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/" },
    ],
    ideas: ["Upgrade your notes RAG", "A support-doc assistant", "An internal knowledge bot"],
    requiredKnowledge: ["tracing", "evals", "guardrails", "Docker", "cost/latency logging"],
    features: [
      "Your RAG app in Docker",
      "Tracing and evals on every change",
      "Input/output guardrails",
      "A cost and latency dashboard",
    ],
    proves: "You can run AI in production.",
    shipping: [
      "Containerise with Docker and deploy to Cloud Run or Render; share the live URL and a screenshot of the tracing/cost dashboard.",
      "The README documents evals, guardrails and deploy steps.",
      "Link the live URL and repo below.",
    ],
    startResourceKey: "langfuse-tracing-docs",
    milestones: [
      { title: "Add evals + tracing", description: "Run an eval harness and trace every request." },
      { title: "Add guardrails", description: "Add input/output guardrails against injection." },
      { title: "Dockerise", description: "Containerise the app for reproducible deploys." },
      { title: "Deploy + monitor", description: "Deploy to a public URL and log cost and latency." },
    ],
  },
  {
    number: 12,
    phaseSlug: "get-hired",
    originalWeek: 24,
    origin: "pdf",
    kind: "portfolio",
    title: "Capstone product",
    problem:
      "Hiring managers want to see one thing you own end to end and that real people use.",
    whyUseful: "Proves you can own a product, not a notebook.",
    beginnerBrief:
      "You'll build one real AI product end to end that actual people use, not a notebook demo. Pick a small problem you understand, ship an MVP, get a handful of users, and tell the story with a demo video.",
    approach: [
      "Pick a real problem you or a community you know actually has.",
      "Scope the smallest version (MVP) that solves it, and build it end to end.",
      "Add evals and basic monitoring so you know it works.",
      "Get real users, even twenty, and gather their feedback.",
      "Record a short demo video and write a case study.",
    ],
    resourceLinks: [
      { label: "A Field Guide to Improving AI Products", url: "https://hamel.dev/blog/posts/field-guide/" },
      { label: "Made With ML", url: "https://madewithml.com/" },
      { label: "Streamlit Community Cloud", url: "https://streamlit.io/cloud" },
      { label: "Hugging Face Spaces", url: "https://huggingface.co/docs/hub/spaces-overview" },
    ],
    ideas: ["An assistant for a niche you know", "A tool your community needs", "An automation that saves someone hours"],
    requiredKnowledge: ["everything so far", "deployment", "evals", "product sense"],
    features: [
      "One end-to-end AI product",
      "Used by real people",
      "A demo video",
      "Usage numbers",
    ],
    proves: "You can own a product, not a notebook.",
    shipping: [
      "Deploy the product live (Vercel, Render or HF Spaces depending on your stack) and record a 1-2 minute demo video.",
      "Add usage numbers and a short case study to the README.",
      "Link the live product, repo and video below.",
    ],
    startResourceKey: "a-field-guide-to-improving-ai-products",
    milestones: [
      { title: "Scope a real problem", description: "Pick a problem real people have and scope an MVP." },
      { title: "Build and deploy", description: "Ship it end to end with evals and monitoring." },
      { title: "Get users", description: "Get real users, even twenty, and gather feedback." },
      { title: "Tell the story", description: "Record a demo video and write the case study." },
    ],
  },

  /* ============ CUMULATIVE INTUITION PROJECTS (one per phase, 11) ==========
   * These replace the old "real-world" capstones. Each builds intuition for the
   * current phase while revisiting earlier phases (~60% new / ~40% prior).
   * ------------------------------------------------------------------------ */
  {
    number: 101,
    phaseSlug: "programming-foundations",
    originalWeek: 4,
    origin: "curated",
    kind: "phase-capstone",
    title: "Data in, insight out: a mini pipeline",
    problem:
      "You have raw CSV/JSON lying around but no clean way to load, store and query it. Build one small tool that ingests a file, saves rows to SQLite, and serves simple stats over HTTP, so you feel every layer a program touches.",
    whyUseful:
      "Every ML system is the same spine: input, transform, store, serve. Feeling that spine now makes every later phase click.",
    intuitionFocus:
      "How data flows through a program: input, transform, store, serve, and why each layer exists.",
    newConcepts: [
      "Python functions and OOP",
      "Parsing CSV/JSON files",
      "SQLite persistence with parameterized SQL",
      "A FastAPI endpoint with validation",
      "Tests with pytest and Git/PR workflow",
    ],
    revisitConcepts: [],
    mixNote:
      "First phase, so 100% new, but this data spine is the ~40% you will deliberately revisit in every project after this.",
    beginnerBrief:
      "You'll build one small program that reads a data file, saves the rows into a mini database (SQLite), and answers questions about them over the web. It's tiny, but it makes you touch every part of how software handles data, which everything later builds on.",
    approach: [
      "Write a small class that reads a CSV/JSON file into Python objects.",
      "Create a SQLite table and insert the rows using parameterized SQL (safe from injection).",
      "Add a FastAPI GET /stats endpoint that runs a GROUP BY and returns clean JSON.",
      "Write a couple of pytest tests for the parser and the endpoint; check /docs.",
      "Commit in small steps and open a pull request with a README explaining the flow.",
    ],
    resourceLinks: [
      { label: "FastAPI tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
      { label: "Python sqlite3 module + tutorial", url: "https://docs.python.org/3/library/sqlite3.html" },
      { label: "An overview of HTTP (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview" },
      { label: "Learn Git Branching (interactive)", url: "https://learngitbranching.js.org/" },
    ],
    learningGoal:
      "Wire Python, files, OOP, SQL, FastAPI, tests and Git into one working spine you understand end to end.",
    ideas: [
      "Ingest a CSV into SQLite with a small OOP loader",
      "GET /stats that aggregates with GROUP BY",
      "A CLI command plus the same logic behind an endpoint",
    ],
    requiredKnowledge: ["Python", "SQLite", "FastAPI", "Pydantic", "pytest", "Git/PRs"],
    features: [
      "A loader that parses a file into SQLite",
      "GET /stats aggregations over the stored data",
      "Validation and clear errors",
      "Tests and auto /docs",
    ],
    proves: "You can move data through a real program from input to served output.",
    shipping: [
      "The CLI part cannot be deployed as a URL: ship a GitHub repo with a README and record a short terminal demo (asciinema or a GIF).",
      "Optionally deploy the FastAPI part to Render for a live /stats URL.",
      "Paste the repo (and any live URL) into the fields below.",
    ],
    startResourceKey: "fastapi-tutorial-user-guide",
    milestones: [
      { title: "Model + persist", description: "Design a table and an OOP loader that inserts parsed rows with parameterized SQL." },
      { title: "Serve stats", description: "Expose GET /stats that aggregates the stored data with validation." },
      { title: "Test", description: "Add tests for parsing and the endpoint; confirm /docs." },
      { title: "Ship", description: "Write a README explaining the input to served-output spine and open a PR." },
    ],
  },
  {
    number: 102,
    phaseSlug: "data-and-math",
    originalWeek: 6,
    origin: "curated",
    kind: "phase-capstone",
    title: "Gradient descent you can watch",
    problem:
      "Fit a line or curve to a real dataset by implementing gradient descent yourself in NumPy, and watch the loss fall step by step, so 'training' stops being magic.",
    whyUseful:
      "Seeing loss drop as parameters walk downhill gives you the core intuition behind every model you will train later.",
    intuitionFocus:
      "A model as geometry plus calculus: data are vectors, learning is walking downhill on a loss surface.",
    newConcepts: [
      "NumPy vectorization",
      "Vectors, matrices and dot products",
      "pandas cleaning and EDA",
      "Derivatives and gradient descent",
      "Loss curves and basic statistics",
    ],
    revisitConcepts: [
      "Load a CSV and persist results (Phase 1)",
      "Serve the fitted parameters via a FastAPI endpoint (Phase 1)",
    ],
    mixNote:
      "~60% new math (NumPy, gradients, stats) built on ~40% Phase 1 (load data, persist, serve).",
    beginnerBrief:
      "You'll teach a computer to draw the best line through some real data, not with a library, but by coding the learning step yourself and watching the error shrink each round. This 'gradient descent' is the engine inside almost every ML model.",
    approach: [
      "Load and clean a small real dataset with pandas and plot it.",
      "Write the model (a line/curve) and a loss function in NumPy.",
      "Code the gradient descent loop by hand and print the loss each step.",
      "Plot the loss curve so you can literally see it converge.",
      "Reuse Phase 1: serve the fitted parameters from a small FastAPI endpoint.",
    ],
    resourceLinks: [
      { label: "Kaggle Learn: Pandas", url: "https://www.kaggle.com/learn/pandas" },
      { label: "3Blue1Brown: Essence of Calculus", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { label: "NumPy: the absolute basics", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
      { label: "StatQuest: Statistics Fundamentals", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9" },
    ],
    learningGoal:
      "Feel the math of fitting a model by hand, on real data, and connect it back to your Phase 1 spine.",
    ideas: [
      "Fit a trend line to a real dataset by gradient descent",
      "Plot the loss curve as it converges",
      "Serve the fitted model behind your Phase 1 endpoint",
    ],
    requiredKnowledge: ["NumPy", "pandas", "gradient descent", "matplotlib", "FastAPI (revisit)"],
    features: [
      "A cleaned real dataset",
      "Gradient descent implemented in NumPy",
      "A loss curve that visibly converges",
      "The fitted model served over HTTP",
    ],
    proves: "You understand what 'training' actually does under the hood.",
    shipping: [
      "Publish the notebook (public Kaggle notebook or a GitHub repo with the .ipynb) showing the loss curve.",
      "Optionally deploy the tiny endpoint to Render.",
      "Link the notebook below.",
    ],
    startResourceKey: "kaggle-learn-pandas",
    milestones: [
      { title: "Clean + explore", description: "Load and clean a real dataset and produce a couple of EDA charts." },
      { title: "Descend", description: "Implement gradient descent in NumPy and plot the loss falling." },
      { title: "Interpret", description: "Explain the fit and its limits honestly." },
      { title: "Revisit serving", description: "Serve the fitted parameters via your Phase 1 FastAPI endpoint." },
    ],
  },
  {
    number: 103,
    phaseSlug: "classical-ml",
    originalWeek: 9,
    origin: "curated",
    kind: "phase-capstone",
    title: "From gradient descent to a real classifier",
    problem:
      "Take the dataset feel from Phase 2 and build a proper scikit-learn pipeline: split honestly, handle imbalance, pick the right metric, ship a demo, then compare it to your hand-rolled model.",
    whyUseful:
      "Contrasting your from-scratch fit with a real pipeline builds intuition for generalization, overfitting and why the metric you choose changes the model you ship.",
    intuitionFocus:
      "Why a model generalizes or overfits, and why the metric you pick decides which model you ship.",
    newConcepts: [
      "Train/val/test splits and leakage",
      "scikit-learn pipelines",
      "Trees and ensembles",
      "Precision/recall/ROC for imbalance",
      "Clustering and PCA",
    ],
    revisitConcepts: [
      "Gradient descent as the engine under the hood (Phase 2)",
      "EDA and feature intuition (Phase 2)",
      "Serve/deploy the model (Phase 1)",
    ],
    mixNote:
      "~60% classical-ML workflow, ~40% revisiting Phase 2 EDA/optimization and Phase 1 serving.",
    beginnerBrief:
      "You'll build a real classifier the professional way with scikit-learn, then compare it to the model you hand-coded in Phase 2. Seeing both side by side teaches you what libraries do for you and why honest evaluation matters.",
    approach: [
      "Reuse a Phase 2 dataset and frame a classification task; split into train/test honestly.",
      "Build one scikit-learn Pipeline (preprocess + model) and handle class imbalance.",
      "Choose the right metric (precision/recall/ROC), not just accuracy.",
      "Compare results against your hand-rolled Phase 2 model.",
      "Ship a small demo and write up what changed and why.",
    ],
    resourceLinks: [
      { label: "Kaggle Learn: Intermediate ML", url: "https://www.kaggle.com/learn/intermediate-machine-learning" },
      { label: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
      { label: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
      { label: "StatQuest: Machine Learning", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF" },
    ],
    learningGoal:
      "Run the full classical-ML workflow and connect it to the gradient descent you already implemented.",
    ideas: [
      "Reuse a Phase 2 dataset for a classification task",
      "Compare your NumPy model vs a scikit-learn pipeline",
      "Tune the threshold for recall on the rare class",
    ],
    requiredKnowledge: ["scikit-learn pipelines", "imbalanced data", "metrics", "Streamlit/Gradio", "gradient descent (revisit)"],
    features: [
      "A clean pipeline with an honest split",
      "The right metric for imbalance",
      "A comparison against your hand-rolled model",
      "A live demo",
    ],
    proves: "You can train, evaluate honestly, and ship a model, and explain why it beats the naive fit.",
    shipping: [
      "Deploy the demo to Streamlit Community Cloud or Hugging Face Spaces.",
      "The repo holds the pipeline and your comparison write-up.",
      "Link both the live demo and repo below.",
    ],
    startResourceKey: "kaggle-learn-intermediate-ml",
    milestones: [
      { title: "Frame + split", description: "Define the task, split cleanly and note leakage risks." },
      { title: "Pipeline", description: "Build a scikit-learn pipeline handling imbalance." },
      { title: "Compare", description: "Contrast metrics against your Phase 2 gradient-descent model." },
      { title: "Ship", description: "Deploy a demo and write up what changed and why." },
    ],
  },
  {
    number: 104,
    phaseSlug: "deep-learning",
    originalWeek: 12,
    origin: "curated",
    kind: "phase-capstone",
    title: "Backprop makes sense: an image classifier",
    problem:
      "Fine-tune a CNN on your own image classes, but first implement a tiny two-layer net's forward and backward pass by hand, so backprop connects to the gradient descent you already know.",
    whyUseful:
      "Hand-deriving one backward pass turns deep learning from magic into 'the chain rule applied at scale', then transfer learning feels obvious.",
    intuitionFocus:
      "A neural net is stacked linear-plus-nonlinear layers trained by the same gradient descent; backprop is the chain rule at scale.",
    newConcepts: [
      "Tensors and PyTorch",
      "Neurons, layers and activations",
      "Backpropagation (chain rule)",
      "CNNs and transfer learning",
      "Augmentation and training curves",
    ],
    revisitConcepts: [
      "Gradient descent, now multi-layer (Phase 2)",
      "Honest metrics and confusion matrices (Phase 3)",
      "Deploy a demo (Phase 3 and Phase 1)",
    ],
    mixNote:
      "~60% deep learning, ~40% revisiting Phase 2 gradients and Phase 3 evaluation/deployment.",
    beginnerBrief:
      "You'll first hand-code a tiny 2-layer neural network so you truly see how it learns (backprop is just the chain rule from calculus). Then you'll use that intuition to fine-tune a real image model on your own photos.",
    approach: [
      "Follow Karpathy's micrograd video and implement a 2-layer net's forward and backward pass.",
      "Check your gradients make the loss go down, just like Phase 2 gradient descent.",
      "Switch to PyTorch and fine-tune a pretrained CNN on your own images.",
      "Reuse Phase 3 evaluation: report metrics and study a confusion matrix.",
      "Deploy a demo and note how backprop links back to gradient descent.",
    ],
    resourceLinks: [
      { label: "Building micrograd (Karpathy)", url: "https://www.youtube.com/watch?v=VMj-3S1tku0" },
      { label: "But what is a neural network? (3B1B)", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
      { label: "PyTorch: Learn the Basics", url: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html" },
      { label: "Practical Deep Learning (fast.ai)", url: "https://course.fast.ai/" },
    ],
    learningGoal:
      "Understand deep nets from gradients up, then adapt a pretrained model and ship it.",
    ideas: [
      "Hand-code a 2-layer net's forward/backward pass",
      "Fine-tune a pretrained CNN on your own photos",
      "Reuse Phase 3 evaluation habits on the results",
    ],
    requiredKnowledge: ["PyTorch", "backpropagation", "transfer learning", "augmentation", "metrics (revisit)"],
    features: [
      "A from-scratch tiny net with manual backprop",
      "A fine-tuned CNN on your own classes",
      "Training curves and honest test metrics",
      "A public demo",
    ],
    proves: "You understand deep nets from gradients up and can ship one.",
    shipping: [
      "Deploy the image demo to Hugging Face Spaces; keep the micrograd notebook and fine-tune code in a GitHub repo.",
      "Link the Space and the repo below.",
    ],
    startResourceKey: "practical-deep-learning-for-coders",
    milestones: [
      { title: "Backprop by hand", description: "Implement forward and backward for a 2-layer net and check the gradients." },
      { title: "Transfer learn", description: "Fine-tune a pretrained CNN on your own images." },
      { title: "Evaluate", description: "Reuse Phase 3 metrics and study confusions." },
      { title: "Ship", description: "Deploy a demo and note how backprop links to Phase 2." },
    ],
  },
  {
    number: 105,
    phaseSlug: "transformers-and-llms",
    originalWeek: 14,
    origin: "curated",
    kind: "phase-capstone",
    title: "Attention, from vectors to a tiny transformer",
    problem:
      "Build a small character-level transformer in PyTorch and probe its embeddings and attention weights, so tokenization, embeddings and self-attention connect to the vectors and training you already know.",
    whyUseful:
      "Inspecting learned embeddings and attention makes 'the model looks things up by meaning' concrete, not hand-wavy.",
    intuitionFocus:
      "Attention is learned, content-based lookup over token embeddings; an LLM is a next-token predictor trained like your CNN.",
    newConcepts: [
      "Tokenization",
      "Embeddings as learned vectors",
      "Self-attention and the transformer block",
      "The next-token training loop",
      "Sampling: temperature and top-k",
    ],
    revisitConcepts: [
      "PyTorch training loop and backprop (Phase 4)",
      "Vectors, dot products and similarity (Phase 2)",
      "Loss curves (Phase 2 and Phase 4)",
    ],
    mixNote:
      "~60% transformer internals, ~40% revisiting Phase 4 training and Phase 2 vector intuition.",
    beginnerBrief:
      "You'll build a tiny GPT and then peek inside it: see that words become vectors, and 'attention' is just the model looking up which earlier words matter. Connecting this to the vectors and training you already know removes the mystery.",
    approach: [
      "Code a small character-level transformer in PyTorch (embeddings + one attention block).",
      "Train it with the same loop-and-loss idea from Phase 4 and watch the loss fall.",
      "Visualize the attention weights on a sample sentence.",
      "Show nearest-neighbour tokens in embedding space (dot-product similarity from Phase 2).",
      "Add temperature/top-k sampling and document what you saw.",
    ],
    resourceLinks: [
      { label: "Let's build GPT from scratch (Karpathy)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" },
      { label: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
      { label: "Transformer Explainer (interactive)", url: "https://poloclub.github.io/transformer-explainer/" },
      { label: "Hugging Face LLM Course", url: "https://huggingface.co/learn/llm-course/chapter1/1" },
    ],
    learningGoal:
      "Understand LLMs from the inside by building one and connecting it to earlier vectors and training.",
    ideas: [
      "Train a char-level transformer on text you like",
      "Visualize attention weights on a sample",
      "Show nearest-neighbour tokens in embedding space",
    ],
    requiredKnowledge: ["tokenization", "self-attention", "PyTorch", "embeddings", "vectors (revisit)"],
    features: [
      "A small transformer you wrote and trained",
      "An attention-weight visualization",
      "Embedding similarity you can inspect",
      "Sampling controls with generated text",
    ],
    proves: "You understand LLMs from the inside.",
    shipping: [
      "Not deployable as a site: ship a GitHub repo with the code, attention-visualization images and generated samples in the README.",
      "Add an Add-in-Colab button so others can run it.",
      "Link the repo below.",
    ],
    startResourceKey: "hugging-face-llm-course",
    milestones: [
      { title: "Blocks", description: "Implement embeddings and a self-attention block in PyTorch." },
      { title: "Train", description: "Run the next-token loop and watch the loss fall." },
      { title: "Probe", description: "Visualize attention and nearest-neighbour embeddings." },
      { title: "Generate", description: "Add sampling controls and document what you saw." },
    ],
  },
  {
    number: 106,
    phaseSlug: "building-llm-apps",
    originalWeek: 16,
    origin: "curated",
    kind: "phase-capstone",
    title: "Make an LLM reliable: doc to structured JSON",
    problem:
      "Turn messy documents into validated JSON with retries and a small test set, served behind your own API, so you feel how to tame a probabilistic model into a dependable service.",
    whyUseful:
      "Wrapping a stochastic model with schemas, validation and retries builds the core intuition of LLM engineering: reliability, not cleverness.",
    intuitionFocus:
      "An LLM app is a reliability problem: schemas, validation, tools and retries make a stochastic predictor dependable.",
    newConcepts: [
      "Calling model APIs",
      "Structured output with Pydantic",
      "Prompting that holds up",
      "Tool / function calling",
      "Retries, cost and context engineering",
    ],
    revisitConcepts: [
      "FastAPI endpoint, validation and tests (Phase 1)",
      "Why sampling and temperature make output vary (Phase 5)",
    ],
    mixNote:
      "~60% LLM-app reliability, ~40% revisiting Phase 1 service/validation and Phase 5 model behavior.",
    beginnerBrief:
      "You'll make a chatty LLM behave like a dependable service: it reads a document and always returns clean, validated JSON, retrying when it slips. Because you know from Phase 5 why models vary, you'll understand why guardrails are needed.",
    approach: [
      "Define the exact output fields as a Pydantic model.",
      "Prompt an LLM to fill the schema; validate every response.",
      "Retry automatically when the JSON is invalid, feeding back the error.",
      "Serve it behind your Phase 1 FastAPI endpoint.",
      "Measure success on a fixed 20-document set.",
    ],
    resourceLinks: [
      { label: "OpenAI: Structured outputs", url: "https://developers.openai.com/api/docs/guides/structured-outputs" },
      { label: "Instructor (structured output)", url: "https://python.useinstructor.com/" },
      { label: "OpenAI: Function calling guide", url: "https://developers.openai.com/api/docs/guides/function-calling" },
      { label: "Gemini API: getting started", url: "https://ai.google.dev/gemini-api/docs/get-started" },
    ],
    learningGoal:
      "Make model output reliable and callable behind a clean API you already know how to build.",
    ideas: [
      "Resumes/invoices to a validated schema",
      "Retry loop on invalid JSON",
      "Serve it behind your Phase 1 FastAPI service",
    ],
    requiredKnowledge: ["structured output", "Pydantic", "prompting", "FastAPI (revisit)", "sampling (revisit)"],
    features: [
      "Documents parsed into a validated schema",
      "Retries on invalid output",
      "A 20-document test set",
      "Served behind your own API",
    ],
    proves: "You can make model output reliable and callable.",
    shipping: [
      "Deploy the API to Render, or record a demo video if you keep it local.",
      "The README shows sample outputs and the 20-document score.",
      "Link the repo and demo below.",
    ],
    startResourceKey: "structured-model-outputs",
    milestones: [
      { title: "Schema", description: "Model the target output with Pydantic." },
      { title: "Extract", description: "Prompt, validate, and retry on invalid JSON." },
      { title: "Serve", description: "Expose it behind your Phase 1 FastAPI endpoint." },
      { title: "Measure", description: "Report accuracy on a fixed 20-document set." },
    ],
  },
  {
    number: 107,
    phaseSlug: "rag",
    originalWeek: 18,
    origin: "curated",
    kind: "phase-capstone",
    title: "RAG that cites and is measured",
    problem:
      "Build a RAG app over your own notes that cites its sources, then add a 30-question eval, so retrieval, embeddings and honest measurement all click together.",
    whyUseful:
      "Seeing recall improve on an eval you built makes retrieval quality measurable instead of a vibe.",
    intuitionFocus:
      "RAG is nearest-neighbour search in embedding space feeding a prompt; citations and evals turn recall into trust.",
    newConcepts: [
      "Embeddings and similarity search",
      "Chunking and a vector store",
      "Hybrid search and reranking",
      "Answers with citations",
      "RAG evaluation (faithfulness)",
    ],
    revisitConcepts: [
      "Embeddings as vectors (Phase 5) and dot-product similarity (Phase 2)",
      "Structured prompting and reliability (Phase 6)",
      "Serve behind an API (Phase 1 and Phase 6)",
    ],
    mixNote:
      "~60% retrieval and eval, ~40% revisiting Phase 5/2 embeddings and Phase 6 reliable prompting.",
    beginnerBrief:
      "You'll build an assistant that answers from your own notes and cites where it got each answer, then prove it's good with a 30-question test. This connects embeddings (vectors again) with the reliable prompting you learned in Phase 6.",
    approach: [
      "Chunk your documents and store their embeddings in a vector database.",
      "Retrieve the closest chunks for a question and generate an answer with citations.",
      "Reuse Phase 6 structured prompting to keep answers well-formed.",
      "Add hybrid search and a reranker to improve retrieval.",
      "Write 30 questions and score answers before and after your changes.",
    ],
    resourceLinks: [
      { label: "LangChain semantic search tutorial", url: "https://docs.langchain.com/oss/python/langchain/knowledge-base" },
      { label: "Chroma: getting started", url: "https://docs.trychroma.com/docs/overview/getting-started" },
      { label: "Rerankers and two-stage retrieval", url: "https://www.pinecone.io/learn/series/rag/rerankers/" },
      { label: "Evaluate a RAG system (Ragas)", url: "https://docs.ragas.io/en/stable/getstarted/rag_eval/" },
    ],
    learningGoal:
      "Ground answers in your documents and measure retrieval quality with an eval you build.",
    ideas: [
      "RAG over your own notes or a PDF library",
      "Citations for every answer",
      "A 30-question before/after eval",
    ],
    requiredKnowledge: ["embeddings", "vector store", "reranking", "RAG evals", "prompting (revisit)"],
    features: [
      "Chat over your documents with citations",
      "Hybrid search and reranking",
      "A 30-question eval with before/after scores",
      "Served behind your reliable API",
    ],
    proves: "You can ground answers and measure them.",
    shipping: [
      "Deploy to Streamlit Community Cloud or Hugging Face Spaces and include your eval numbers in the README.",
      "Link the live app and the repo below.",
    ],
    startResourceKey: "langchain-semantic-search-tutorial",
    milestones: [
      { title: "Index", description: "Chunk and embed your documents into a vector store." },
      { title: "Cite", description: "Answer with citations, reusing Phase 6 structured prompting." },
      { title: "Improve", description: "Add hybrid search and reranking." },
      { title: "Evaluate", description: "Score 30 questions before and after and explain the lift." },
    ],
  },
  {
    number: 108,
    phaseSlug: "agents-and-mcp",
    originalWeek: 20,
    origin: "curated",
    kind: "phase-capstone",
    title: "A research agent that won't run away",
    problem:
      "Build a bounded agent that uses web search plus your RAG retriever, exposed through an MCP server, with hard step limits and full traces, so the agent loop and safe tool use become concrete.",
    whyUseful:
      "Giving an agent your own Phase 7 retriever as an MCP tool shows how capabilities compose and why limits and traces are non-negotiable.",
    intuitionFocus:
      "An agent is a controlled loop of model plus tools plus memory with hard limits; MCP is a safe, typed way to hand it real capabilities.",
    newConcepts: [
      "The reason-act-observe loop",
      "LangGraph state and memory",
      "MCP servers and typed tools",
      "Step/cost limits and tracing",
      "Human-in-the-loop safety",
    ],
    revisitConcepts: [
      "Tool / function calling (Phase 6)",
      "Your RAG retriever as an agent tool (Phase 7)",
      "Wrapping a real API safely (Phase 1)",
    ],
    mixNote:
      "~60% agents and MCP, ~40% revisiting Phase 6 tools and Phase 7 retrieval.",
    beginnerBrief:
      "You'll build an AI agent that answers research questions by using tools, one of them being the RAG retriever you built in Phase 7, wrapped as an MCP tool. The focus is control: strict step limits, full traces, and approval before risky actions.",
    approach: [
      "Wrap your Phase 7 retriever and a web-search tool as an MCP server.",
      "Build a LangGraph reason-act-observe loop with simple memory.",
      "Add hard step and cost limits so it can't run away.",
      "Log a full trace of every step and require approval on risky actions.",
      "Demo it answering a real question end to end.",
    ],
    resourceLinks: [
      { label: "Introduction to LangGraph", url: "https://academy.langchain.com/courses/intro-to-langgraph" },
      { label: "Build an MCP server", url: "https://modelcontextprotocol.io/docs/develop/build-server" },
      { label: "Building effective agents (Anthropic)", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "The ReAct paper", url: "https://arxiv.org/abs/2210.03629" },
    ],
    learningGoal:
      "Build an agent that uses real tools safely and reuses your earlier retrieval work.",
    ideas: [
      "Expose your Phase 7 RAG as an MCP tool",
      "Add a search tool and step limits",
      "Trace every reason-act-observe step",
    ],
    requiredKnowledge: ["agent loop", "LangGraph", "MCP", "human-in-the-loop", "RAG (revisit)"],
    features: [
      "An MCP server wrapping your retriever plus search",
      "A bounded LangGraph agent",
      "Hard step/cost limits and full traces",
      "Ask-first approval on risky actions",
    ],
    proves: "You can build agents that use real tools safely and do not loop forever.",
    shipping: [
      "Ship a GitHub repo plus a demo video showing the step traces; optionally deploy a Gradio chat.",
      "Publish the MCP server code and document how to run it.",
      "Link the repo and video below.",
    ],
    startResourceKey: "build-an-mcp-server",
    milestones: [
      { title: "MCP tools", description: "Expose your Phase 7 retriever and a search tool via MCP." },
      { title: "Loop", description: "Build a LangGraph reason-act-observe loop with memory." },
      { title: "Bound", description: "Add step/cost limits, tracing and approval on risky actions." },
      { title: "Demo", description: "Answer a research question end to end with a full trace." },
    ],
  },
  {
    number: 109,
    phaseSlug: "fine-tuning",
    originalWeek: 21,
    origin: "curated",
    kind: "phase-capstone",
    title: "When to fine-tune (and proving it)",
    problem:
      "Fine-tune a small open model with LoRA on one narrow task, then run a before/after eval against a strong prompt baseline, so you build judgment for when tuning actually beats prompting.",
    whyUseful:
      "The real skill is deciding fine-tuning is worth it and proving the gain, not just running the training script.",
    intuitionFocus:
      "Fine-tuning moves behavior into the weights; the skill is deciding when it beats prompting and proving it with an eval.",
    newConcepts: [
      "Instruction dataset design",
      "LoRA / QLoRA training",
      "Before/after evaluation",
      "Model cards",
    ],
    revisitConcepts: [
      "Evaluation discipline and honest metrics (Phase 3)",
      "How training and backprop work (Phase 4 and Phase 5)",
      "The prompting baseline to beat (Phase 6)",
    ],
    mixNote:
      "~60% fine-tuning, ~40% revisiting Phase 3 evaluation and Phase 6 prompting baselines.",
    beginnerBrief:
      "You'll answer a real engineering question: is fine-tuning worth it here? You'll build a strong prompt first, then lightly retrain a small model on one task, and prove with an eval whether the tuned model actually wins.",
    approach: [
      "Pick one narrow task and build a strong prompt baseline plus an eval set (Phase 3/6 habits).",
      "Create a small, clean instruction dataset for the task.",
      "Fine-tune a small model with LoRA/QLoRA on a free GPU.",
      "Run before/after on the eval set and decide if tuning was worth it.",
      "Publish the adapter with a model card and your verdict.",
    ],
    resourceLinks: [
      { label: "Unsloth fine-tuning guide", url: "https://unsloth.ai/docs/get-started/fine-tuning-llms-guide" },
      { label: "PEFT quicktour (LoRA)", url: "https://huggingface.co/docs/peft/quicktour" },
      { label: "Is fine-tuning still valuable?", url: "https://hamel.dev/blog/posts/fine_tuning_valuable.html" },
      { label: "HF LLM Course: fine-tuning", url: "https://huggingface.co/learn/llm-course/chapter11/1" },
    ],
    learningGoal:
      "Decide, execute and measure a fine-tune, and prove it beats a strong prompt.",
    ideas: [
      "Pick one narrow, high-volume task",
      "Compare a strong prompt vs a LoRA adapter",
      "Report a before/after eval on a fixed set",
    ],
    requiredKnowledge: ["instruction data", "LoRA/QLoRA", "evals (revisit)", "prompting (revisit)"],
    features: [
      "A clean instruction dataset",
      "A LoRA adapter for a small model",
      "A before/after eval vs a prompt baseline",
      "A model card with data and results",
    ],
    proves: "You know when fine-tuning pays off and can prove it.",
    shipping: [
      "Publish the adapter and model card to the Hugging Face Hub (that page is your demo).",
      "Keep the code on GitHub; include the before/after eval table.",
      "Link the Hugging Face model page below.",
    ],
    startResourceKey: "unsloth-ne-tuning-guide",
    milestones: [
      { title: "Baseline", description: "Build a strong prompt baseline and an eval set (Phase 3/6 habits)." },
      { title: "Train", description: "Fine-tune a LoRA adapter on your narrow task." },
      { title: "Compare", description: "Run before/after and decide if tuning was worth it." },
      { title: "Publish", description: "Ship the adapter with a model card and the verdict." },
    ],
  },
  {
    number: 110,
    phaseSlug: "evals-and-production",
    originalWeek: 23,
    origin: "curated",
    kind: "phase-capstone",
    title: "Ship one AI system for real",
    problem:
      "Take your RAG or agent app and make it production-grade: an eval harness on every change, tracing with cost and latency, guardrails, Dockerised and deployed, so 'works on my machine' becomes 'observable and safe in production'.",
    whyUseful:
      "Wiring evals, tracing and guardrails around an app you already built shows why production is a feedback loop, not a deploy button.",
    intuitionFocus:
      "Production is a feedback loop: evals, tracing and guardrails let you change a system without breaking it silently.",
    newConcepts: [
      "Eval harness and LLM-as-judge",
      "Tracing with cost and latency",
      "Input/output guardrails",
      "Docker and deployment",
      "MLOps basics",
    ],
    revisitConcepts: [
      "Your RAG (Phase 7) or agent (Phase 8) as the system under test",
      "Reliability and structured output (Phase 6)",
      "Serving fundamentals (Phase 1)",
    ],
    mixNote:
      "~60% evals and production, ~40% revisiting your Phase 7/8 app and Phase 6 reliability.",
    beginnerBrief:
      "You'll take an app you already built (your RAG or agent) and make it real: automated tests on every change, tracing of cost and speed, safety guardrails, and a Docker deployment. This is the difference between a demo and a product.",
    approach: [
      "Wrap your Phase 7/8 app in an eval harness with an LLM judge you sanity-check.",
      "Add tracing so every request records cost and latency.",
      "Add input/output guardrails and safe refusals.",
      "Containerise with Docker for reproducible deploys.",
      "Deploy to a public URL and monitor it.",
    ],
    resourceLinks: [
      { label: "Langfuse tracing docs", url: "https://langfuse.com/docs" },
      { label: "Using LLM-as-a-Judge (Hamel)", url: "https://hamel.dev/blog/posts/llm-judge/" },
      { label: "Docker: get started", url: "https://docs.docker.com/get-started/" },
      { label: "OWASP Top 10 for LLM Apps", url: "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/" },
    ],
    learningGoal:
      "Run one AI system in production with measurement and safety.",
    ideas: [
      "Promote your Phase 7 RAG or Phase 8 agent",
      "Add an eval harness run on every change",
      "Trace cost/latency and add guardrails",
    ],
    requiredKnowledge: ["evals", "tracing", "guardrails", "Docker", "your prior app (revisit)"],
    features: [
      "An eval harness on every change",
      "Tracing with cost and latency",
      "Input/output guardrails",
      "A Dockerised public deployment",
    ],
    proves: "You can run AI in production with measurement.",
    shipping: [
      "Deploy the Dockerised app to Cloud Run or Render; share the URL and a dashboard screenshot.",
      "The README documents evals, tracing and guardrails.",
      "Link the live URL and repo below.",
    ],
    startResourceKey: "llm-evals-everything-you-need-to-know",
    milestones: [
      { title: "Evals", description: "Wrap your prior app in an eval harness with an LLM judge you validate." },
      { title: "Observe", description: "Trace every request with cost and latency." },
      { title: "Guard", description: "Add input/output guardrails and safe refusals." },
      { title: "Deploy", description: "Dockerise and deploy to a public URL." },
    ],
  },
  {
    number: 111,
    phaseSlug: "get-hired",
    originalWeek: 24,
    origin: "curated",
    kind: "phase-capstone",
    title: "Your cumulative portfolio story",
    problem:
      "Turn every cumulative project into a portfolio site with case studies that show the intuition each one built and how they stack, then prep to tell that same 60/40 story in interviews.",
    whyUseful:
      "Because your projects were built to layer, they already tell a connected arc, the strongest thing you can show a hiring manager.",
    intuitionFocus:
      "Your portfolio is a proof surface: each project should show the intuition it built and how it stacks on the last.",
    newConcepts: [
      "Case-study writing",
      "Portfolio site and deployment",
      "Personal brand",
      "Interview prep: ML and system design",
    ],
    revisitConcepts: [
      "Every prior project, presented as one connected arc",
      "Deployment and demos (Phase 10)",
      "Clear problem framing (all phases)",
    ],
    mixNote:
      "~60% presentation and interview prep, ~40% revisiting and packaging all prior work.",
    beginnerBrief:
      "You'll turn all your projects into a portfolio site with short case studies, each showing what intuition it built and how it connects to the next. Then you'll prep to tell that same connected story in interviews.",
    approach: [
      "Design a simple site and a case-study template (problem, approach, result, intuition built).",
      "Write one case study per cumulative project, connecting each to the last.",
      "Turn the arc into an interview narrative and a cheat sheet (ML + system design).",
      "Deploy the site and add links to repos and demos.",
      "Use it in real applications and iterate on feedback.",
    ],
    resourceLinks: [
      { label: "Your GitHub profile README", url: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme" },
      { label: "Machine Learning Interviews Book", url: "https://huyenchip.com/ml-interviews-book/" },
      { label: "Writing a resume that gets interviews", url: "https://www.techinterviewhandbook.org/resume/" },
      { label: "A Field Guide to Improving AI Products", url: "https://hamel.dev/blog/posts/field-guide/" },
    ],
    learningGoal:
      "Present your work as a coherent, hireable arc and prepare to defend it in interviews.",
    ideas: [
      "One case study per cumulative project",
      "Show the intuition each project built",
      "A deployed site plus an interview cheat sheet",
    ],
    requiredKnowledge: ["writing", "deployment", "the whole roadmap", "interview prep"],
    features: [
      "A deployed portfolio site",
      "Case studies for your strongest projects",
      "A narrative that shows how skills stack",
      "An ML + system-design interview cheat sheet",
    ],
    proves: "You can present your work as a coherent, hireable arc.",
    shipping: [
      "Deploy the site itself to Vercel or GitHub Pages, that IS the deliverable.",
      "Link it everywhere: resume, GitHub profile and applications.",
      "Paste the live site URL below.",
    ],
    startResourceKey: "your-github-pro-le-readme",
    milestones: [
      { title: "Structure", description: "Design the site and a case-study template that shows intuition built." },
      { title: "Write", description: "Write case studies that connect each project to the last." },
      { title: "Prep", description: "Turn the arc into an interview narrative and cheat sheet." },
      { title: "Deploy + share", description: "Deploy the site and use it in applications." },
    ],
  },
];
