import type { TopicSeed, SubtopicSeed, ResourceRef } from "./types";

/**
 * Additional / deep-dive concepts, kept SEPARATE from the core path.
 * Every entry is tier: "additional". These enumerate the important concepts
 * an AI engineer should eventually know, phase by phase, so nothing is hidden.
 * They are shown under a "Go deeper" section on each phase, not mixed into
 * the weekly core path.
 */

function a(
  slug: string,
  title: string,
  explanation: string,
  resources?: ResourceRef[],
): SubtopicSeed {
  return {
    slug,
    title,
    explanation,
    tier: "additional",
    source: "curated",
    estMinutes: 30,
    resources,
  };
}

function extraTopic(
  slug: string,
  title: string,
  summary: string,
  subtopics: SubtopicSeed[],
  resources?: ResourceRef[],
): TopicSeed {
  return {
    slug,
    title,
    summary,
    whyItMatters:
      "These are not on the weekly critical path, but they come up in real work and interviews. Learn them as you hit them.",
    lane: "learn",
    subtopics,
    resources,
  };
}

export const ADDITIONAL_TOPICS: Record<string, TopicSeed[]> = {
  /* ---------------------------------------------------------------- */
  "programming-foundations": [
    extraTopic(
      "py-deep-dive",
      "Python, deeper",
      "Language features you will meet in real codebases.",
      [
        a("iterators-generators", "Iterators and generators", "Lazily produce values with yield; iterate huge streams without loading everything into memory."),
        a("decorators", "Decorators", "Wrap functions to add behaviour (logging, caching, timing) without changing their body."),
        a("context-managers", "Context managers (with / __enter__ / __exit__)", "Guarantee setup/teardown such as closing files or DB connections, even on error."),
        a("args-kwargs", "*args, **kwargs and unpacking", "Write flexible function signatures and unpack iterables/dicts into calls."),
        a("higher-order", "Lambdas, map, filter, reduce", "Treat functions as values and compose small transforms."),
        a("itertools-collections", "itertools and collections", "Counter, defaultdict, namedtuple, deque and combinatoric helpers that replace hand-rolled loops."),
        a("comprehensions-adv", "Advanced comprehensions and generator expressions", "Nested and conditional comprehensions, and when a generator is better than a list."),
        a("dunder-methods", "Dunder methods and operator overloading", "__repr__, __eq__, __hash__, __len__ and friends that make your objects behave like built-ins."),
        a("typing-advanced", "Advanced type hints", "Optional, Union, Generics, Protocol, Literal, TypedDict and why they power Pydantic and editors.", [{ key: "python-types-intro", role: "learn" }]),
        a("regex", "Regular expressions (re)", "Match and extract patterns from text; essential for parsing and cleaning."),
        a("datetime-pathlib", "datetime, pathlib and os", "Handle dates/timezones and filesystem paths portably."),
        a("logging", "The logging module", "Structured, leveled logs instead of print; the basis of observability later."),
        a("argparse-cli", "argparse and building CLIs", "Turn scripts into real command-line tools with flags and help."),
        a("match-walrus", "match statement and the walrus operator", "Modern control-flow syntax (structural pattern matching, assignment expressions)."),
        a("packaging", "pyproject, dependencies and packaging", "requirements vs pyproject, lockfiles, and how uv/pip resolve versions."),
        a("gil-concurrency", "The GIL, threads, processes and asyncio", "When to use threads vs multiprocessing vs async for I/O- vs CPU-bound work."),
      ],
    ),
    extraTopic(
      "testing-quality",
      "Testing and code quality",
      "Habits that make code trustworthy.",
      [
        a("pytest-fixtures", "pytest fixtures and parametrize", "Share setup and run one test across many inputs."),
        a("mocking", "Mocking and patching", "Isolate code from network/DB in tests with unittest.mock."),
        a("coverage", "Coverage and what to test", "Measure tested lines and focus on behaviour, not vanity metrics."),
        a("linting-formatting", "Linting and formatting (ruff, black)", "Automated style and error checks that keep a codebase consistent."),
        a("debugging", "Debugging with pdb and breakpoints", "Step through code and inspect state instead of guessing."),
        a("pre-commit", "pre-commit hooks", "Run lint/format/tests automatically before every commit."),
      ],
    ),
    extraTopic(
      "dsa",
      "Data structures and algorithms",
      "The CS core that interviews assume and that makes you a faster engineer.",
      [
        // subtopics below
        a("bigo", "Big-O: time and space complexity", "Reason about how cost grows with input size; compare approaches before coding."),
        a("arrays-strings", "Arrays and strings", "Indexing, slicing, in-place edits, and common string algorithms."),
        a("hashmaps-sets", "Hash maps and sets", "O(1) average lookup; the tool behind most 'make it fast' fixes."),
        a("stacks-queues", "Stacks, queues and deques", "LIFO/FIFO structures for parsing, BFS and sliding windows."),
        a("linked-lists", "Linked lists", "Pointer-based sequences and their trade-offs vs arrays."),
        a("trees-bst", "Trees and binary search trees", "Hierarchical data, traversals (in/pre/post-order), and ordered lookups."),
        a("heaps", "Heaps and priority queues", "Always-get-the-min/max structure for scheduling and top-k."),
        a("graphs", "Graphs: BFS and DFS", "Model networks and search them; the basis of many real algorithms."),
        a("recursion", "Recursion and backtracking", "Solve problems by self-reference; the mental model behind divide-and-conquer."),
        a("sorting-searching", "Sorting and binary search", "Quicksort/mergesort ideas and searching sorted data in log time."),
        a("two-pointers-sliding", "Two pointers and sliding window", "Linear-time patterns for subarray/substring problems."),
        a("dp-intro", "Dynamic programming (intro)", "Cache overlapping subproblems; recognise when brute force repeats work."),
      ],
      [
        { key: "neetcode-dsa", role: "practice", rank: 0 },
        { key: "visualgo", role: "practice" },
        { key: "python-dsa-freecodecamp", role: "video" },
      ],
    ),
    extraTopic(
      "git-terminal-deep",
      "Git, terminal and SQL, deeper",
      "The everyday tooling around your code.",
      [
        a("rebase-cherrypick", "Rebase, cherry-pick, stash, tags", "Rewrite/replay history, grab single commits, shelve work, and mark releases."),
        a("git-bisect-reflog", "git bisect and reflog", "Find the commit that broke things and recover 'lost' commits."),
        a("commit-hygiene", "Commit hygiene and PR review", "Small, meaningful commits and reviewing others' code well."),
        a("shell-tools", "ssh, curl, jq, chmod, cron", "Connect to servers, call APIs, parse JSON, set permissions, schedule jobs."),
        a("sql-indexes-tx", "Indexes, transactions and ACID", "Make queries fast and keep multi-step writes safe."),
        a("sql-windows-cte", "Window functions and CTEs", "Running totals, rankings and readable multi-step queries."),
        a("sql-normalization", "Keys, normalization and query plans", "Design sane schemas and read EXPLAIN to fix slow queries."),
      ],
    ),
    extraTopic(
      "http-api-deep",
      "HTTP, APIs and backend, deeper",
      "What production web services need beyond the basics.",
      [
        a("rest-design", "REST design and status code families", "Resource modelling, verbs, and 2xx/4xx/5xx conventions."),
        a("api-auth", "API auth: keys, Bearer tokens, OAuth basics", "How clients prove identity to APIs safely."),
        a("pagination-ratelimit", "Pagination, rate limiting, idempotency", "Handle large lists, throttling and safe retries."),
        a("webhooks-cors", "Webhooks and CORS", "Receive server-to-server events and understand browser cross-origin rules."),
        a("openapi", "OpenAPI / Swagger", "Machine-readable API specs; FastAPI generates these for free."),
        a("fastapi-di", "FastAPI dependency injection, middleware, background tasks", "Structure larger services cleanly and offload slow work."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "data-and-math": [
    extraTopic(
      "linear-algebra-deep",
      "Linear algebra, deeper",
      "The matrix ideas under every model.",
      [
        a("norms", "Norms (L1, L2) and distance", "Measure vector size and distance; the basis of regularization and similarity."),
        a("matrix-inverse-rank", "Inverse, determinant, rank", "When systems are solvable and what a transform does to space."),
        a("eigen", "Eigenvalues and eigenvectors", "Directions a transform only stretches; behind PCA and stability analysis."),
        a("svd", "Singular value decomposition (SVD)", "Factorise any matrix; foundation of PCA, compression and embeddings intuition."),
        a("projections", "Projections and orthogonality", "Project data onto subspaces; the geometry behind least squares."),
        a("linear-systems", "Solving linear systems", "Gaussian elimination and least-squares solutions."),
      ],
    ),
    extraTopic(
      "calculus-optimization",
      "Calculus and optimization, deeper",
      "How models are actually minimised.",
      [
        a("partial-grad", "Partial derivatives, gradient, Jacobian, Hessian", "Multivariable slopes and curvature used in training and second-order methods."),
        a("chain-rule-multi", "Multivariate chain rule", "The exact rule backprop implements across layers."),
        a("convexity", "Convexity, local vs global minima, saddle points", "Why some losses are easy and neural nets are hard to optimise."),
        a("optimizers-intuition", "Learning rate, momentum, schedules", "How step size and history shape convergence."),
        a("lagrange", "Constrained optimization and Lagrange multipliers", "Optimise subject to constraints; appears in SVMs and beyond."),
        a("taylor", "Taylor approximation", "Local polynomial approximation behind many optimisation ideas."),
      ],
    ),
    extraTopic(
      "prob-stats-deep",
      "Probability and statistics, deeper",
      "The uncertainty toolkit for ML and evaluation.",
      [
        a("random-vars", "Random variables, PMF/PDF/CDF", "Formal language for uncertain quantities."),
        a("expectation-var", "Expectation, variance, covariance, correlation", "Summarise and relate random quantities."),
        a("joint-conditional", "Joint, marginal, conditional, independence", "Reason about multiple variables together."),
        a("distributions-common", "Common distributions", "Bernoulli, Binomial, Poisson, Normal, Uniform, Exponential and when each applies."),
        a("clt-lln", "CLT and Law of Large Numbers", "Why averages stabilise and normals appear everywhere."),
        a("mle-map", "MLE and MAP estimation", "Fit parameters from data with and without priors."),
        a("entropy-kl", "Entropy, cross-entropy, KL divergence", "Information measures behind classification loss and model comparison."),
        a("hypothesis-testing", "Hypothesis testing, p-values, CIs", "Decide whether an effect is real and quantify uncertainty."),
        a("ab-testing", "A/B testing and bootstrapping", "Compare variants and estimate uncertainty by resampling."),
        a("correlation-causation", "Correlation vs causation", "Why observed association is not proof of cause."),
      ],
    ),
    extraTopic(
      "pandas-viz-deep",
      "pandas and visualization, deeper",
      "Fluency that saves hours on every dataset.",
      [
        a("indexing-views", "Fancy indexing, views vs copies", "Avoid the SettingWithCopy trap and select data precisely."),
        a("groupby-adv", "groupby transform/agg/apply, pivot_table, multi-index", "Powerful reshaping and per-group computation."),
        a("timeseries", "Time series and resampling", "Work with dates, rolling windows and frequency conversion."),
        a("categorical-perf", "Categorical dtype and performance", "Faster, smaller frames and vectorised operations."),
        a("method-chaining", "Method chaining and readable pipelines", "Compose transforms without messy intermediates."),
        a("viz-tools", "matplotlib, seaborn, plotly and chart choice", "Pick and build the right chart for the question.", [{ key: "kaggle-learn-data-visualization", role: "practice" }]),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "classical-ml": [
    extraTopic(
      "core-concepts-ml",
      "Core ML concepts, deeper",
      "The ideas every ML interview probes.",
      [
        a("bias-variance", "Bias-variance tradeoff", "Balance underfitting and overfitting; the lens for most model decisions."),
        a("regularization", "Regularization: L1, L2, elastic net", "Penalise complexity to generalise better and do feature selection."),
        a("curse-dimensionality", "Curse of dimensionality", "Why data gets sparse and distances break down in high dimensions."),
        a("feature-scaling", "Feature scaling and normalization", "Standardise inputs so distance- and gradient-based models behave."),
        a("encoding", "Encoding: one-hot, label, ordinal, target", "Turn categories into numbers without leaking or misleading the model."),
        a("feature-selection", "Feature engineering and selection", "Create and keep the signals that matter."),
        a("leakage-types", "Types of data leakage", "Target, temporal and preprocessing leakage that inflate offline scores."),
      ],
    ),
    extraTopic(
      "algorithms-ml",
      "ML algorithms, broader",
      "Beyond trees and linear models.",
      [
        a("knn", "k-Nearest Neighbours", "Predict from the closest examples; a simple strong baseline."),
        a("svm", "Support Vector Machines and kernels", "Max-margin classifiers and the kernel trick for nonlinearity."),
        a("naive-bayes", "Naive Bayes", "Fast probabilistic classifier, strong for text."),
        a("boosting-family", "AdaBoost, XGBoost, LightGBM, CatBoost", "The gradient-boosting family that wins tabular problems.", [{ key: "kaggle-learn-intermediate-ml", role: "practice" }]),
        a("stacking", "Stacking and blending", "Combine diverse models for extra accuracy."),
        a("clustering-more", "Hierarchical, DBSCAN, GMM", "Clustering beyond k-means for different data shapes."),
        a("dimred-more", "t-SNE, UMAP, LDA", "Visualise and reduce high-dimensional data, including embeddings."),
      ],
    ),
    extraTopic(
      "metrics-selection-deep",
      "Metrics and model selection, deeper",
      "Measure and choose models honestly.",
      [
        a("roc-pr", "ROC vs precision-recall curves and AUC", "Threshold-independent views; PR is better for rare positives."),
        a("regression-metrics", "R2, MAE, RMSE, log loss", "Pick the right error measure for the task."),
        a("multiclass-metrics", "Macro/micro/weighted metrics, calibration", "Aggregate metrics across classes and trust predicted probabilities."),
        a("cv-strategies", "CV strategies: stratified, group, time-series", "Validate correctly for the data's structure."),
        a("search-methods", "Grid, random and Bayesian search", "Tune hyperparameters efficiently."),
        a("imbalance-techniques", "SMOTE, class weights, resampling", "Handle rare classes deliberately."),
        a("interpretability", "SHAP, permutation importance, partial dependence", "Explain what a model learned and why it predicts.", [{ key: "mlu-explain", role: "learn" }]),
        a("reproducibility", "Seeds and reproducibility", "Make runs repeatable for trust and debugging."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "deep-learning": [
    extraTopic(
      "training-internals",
      "Training internals, deeper",
      "What actually makes a network train well.",
      [
        a("optimizers", "SGD, momentum, RMSprop, Adam/AdamW", "How different optimisers update weights and when to use each."),
        a("lr-schedules", "Learning-rate schedules and warmup", "Step, cosine and warmup schedules that stabilise and speed training."),
        a("init-grad", "Initialization, vanishing/exploding gradients, clipping", "Why starting weights and gradient scale decide if training works."),
        a("norm-layers", "Batch norm and layer norm", "Normalisation that smooths optimisation; layer norm powers transformers."),
        a("activations", "Activations: sigmoid, tanh, ReLU, GELU, SiLU, softmax", "Nonlinearities and their trade-offs."),
        a("losses-dl", "Losses: cross-entropy, BCE, focal, label smoothing", "Match the loss to the task and class balance."),
        a("mixed-precision", "Mixed precision and gradient accumulation", "Train bigger/faster on limited GPUs."),
        a("experiment-tracking", "TensorBoard / Weights & Biases", "Track runs, curves and hyperparameters."),
      ],
    ),
    extraTopic(
      "architectures",
      "Architectures, broader",
      "The model families worth recognising.",
      [
        a("cnn-details", "CNN details: stride, padding, receptive field", "How convolutions see space and build hierarchy."),
        a("rnn-lstm", "RNNs, LSTMs, GRUs", "Sequence models and why attention replaced them."),
        a("residual", "Residual and skip connections", "Let gradients flow through very deep networks."),
        a("autoencoders", "Autoencoders and encoder-decoder", "Compress and reconstruct; the shape behind many models."),
        a("gans-diffusion", "GANs and diffusion (awareness)", "How modern image generation works at a high level."),
        a("seq2seq-attention", "Why sequence models led to attention", "The motivation that produced the transformer.", [{ key: "neural-networks-zero-to-hero", role: "video" }]),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "transformers-and-llms": [
    extraTopic(
      "transformer-internals",
      "Transformer internals, deeper",
      "The details behind modern LLM architectures.",
      [
        a("positional-encodings", "Positional encodings: sinusoidal, learned, RoPE, ALiBi", "Different ways to inject order into attention."),
        a("attention-variants", "Attention variants: MHA, MQA, GQA, FlashAttention", "Memory/speed trade-offs used in real LLMs."),
        a("norm-placement-ffn", "Pre/post-LN, feed-forward, SwiGLU", "Block design choices that affect training stability."),
        a("tokenizers-compare", "BPE vs WordPiece vs Unigram/SentencePiece", "How different tokenizers are built.", [{ key: "let-s-build-the-gpt-tokenizer", role: "video" }]),
        a("scaling-laws", "Scaling laws and context extension", "How performance scales with data/params and how context is stretched."),
        a("moe", "Mixture-of-experts", "Sparse models that grow capacity without proportional compute."),
      ],
    ),
    extraTopic(
      "training-inference-deep",
      "Training and inference, deeper",
      "How LLMs are aligned and served.",
      [
        a("objectives", "Causal vs masked LM objectives", "The pretraining targets behind GPT vs BERT."),
        a("alignment", "SFT, RLHF/PPO, DPO, ORPO, KTO, RLAIF", "The family of post-training/alignment methods.", [{ key: "the-rlhf-book", role: "learn" }]),
        a("distill-quant", "Distillation, quantization, pruning", "Shrink models for cheaper, faster inference (GGUF, GPTQ, AWQ, bitsandbytes)."),
        a("decoding", "Decoding: greedy, beam, top-k/p, min-p, penalties", "How text is actually sampled and controlled."),
        a("speculative", "Speculative decoding and batching", "Techniques that raise throughput and cut latency."),
        a("logprobs", "Logits, logprobs and calibration", "Read model confidence and use it downstream."),
        a("benchmarks", "Perplexity and benchmarks (MMLU, etc.)", "How models are compared, and the limits of benchmarks."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "building-llm-apps": [
    extraTopic(
      "prompting-deep",
      "Prompting techniques, broader",
      "The prompting toolkit for reliable apps.",
      [
        a("prompt-patterns", "Zero/few-shot, CoT, self-consistency, ReAct", "Named patterns that reliably raise quality."),
        a("prompt-chaining", "Prompt chaining and templates/versioning", "Break tasks into steps and manage prompts like code."),
        a("role-delimiters", "Role prompting, delimiters, output priming", "Shape behaviour and separate instructions from data."),
        a("constrained-decoding", "Grammars and constrained decoding", "Force outputs to match a format at the token level."),
      ],
    ),
    extraTopic(
      "reliability-deep",
      "Reliability, cost and frameworks",
      "What turns a demo into a dependable feature.",
      [
        a("backoff", "Retries, exponential backoff, timeouts, fallbacks", "Survive flaky APIs and bad outputs gracefully."),
        a("token-budget", "Token budgeting and cost tracking", "Stay within context and control spend per request."),
        a("caching", "Prompt and semantic caching", "Avoid paying twice for the same or similar work.", [{ key: "prompt-caching", role: "learn" }]),
        a("frameworks", "LangChain, LlamaIndex vs raw SDKs", "When a framework helps and when it gets in the way.", [{ key: "langchain-v1-overview", role: "learn" }]),
        a("provider-abstraction", "OpenAI-compatible endpoints and provider abstraction", "Swap providers behind one client to cut cost and lock-in."),
        a("moderation-pii", "Content moderation and PII handling", "Filter unsafe content and protect personal data."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  rag: [
    extraTopic(
      "retrieval-deep",
      "Retrieval techniques, broader",
      "The methods that fix real RAG failures.",
      [
        a("chunking-strategies", "Chunking: fixed, recursive, semantic, markdown-aware, late", "Different splitters and when each wins.", [{ key: "chunking-strategies-for-llm-apps", role: "learn" }]),
        a("vectordb-indexes", "Vector DBs and indexes: HNSW, IVF, PQ", "How approximate nearest-neighbour search scales."),
        a("distance-metrics", "Distance metrics: cosine, dot, euclidean", "Choosing the right similarity for your embeddings."),
        a("fusion", "Hybrid fusion (RRF) and MMR", "Combine rankers and diversify results."),
        a("advanced-rag", "HyDE, multi-query, RAG-fusion, parent-document, sentence-window", "Query- and index-side techniques for better recall.", [{ key: "rag-techniques", role: "practice" }]),
        a("self-corrective-rag", "Self-RAG, corrective RAG, GraphRAG, ColBERT", "Adaptive and structured retrieval approaches.", [{ key: "graphrag", role: "learn" }]),
        a("context-compression", "Context ordering and compression", "Fight 'lost in the middle' and fit more signal in the prompt.", [{ key: "lost-in-the-middle", role: "learn" }]),
      ],
    ),
    extraTopic(
      "rag-eval-deep",
      "RAG evaluation, deeper",
      "Measure retrieval and answers rigorously.",
      [
        a("retrieval-metrics", "recall@k, MRR, nDCG, hit rate", "Quantify whether the right passages are retrieved."),
        a("answer-metrics", "Faithfulness, relevance, correctness", "Score whether answers are grounded and right.", [{ key: "ragas", role: "learn" }]),
        a("golden-sets", "Golden datasets and LLM-as-judge for RAG", "Build reusable eval sets and automate scoring."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "agents-and-mcp": [
    extraTopic(
      "agent-patterns-deep",
      "Agent patterns, broader",
      "The design patterns behind reliable agents.",
      [
        a("patterns", "ReAct, plan-execute, reflection, router", "Named control flows for single agents.", [{ key: "building-e-ective-agents", role: "learn" }]),
        a("multi-agent", "Multi-agent: supervisor, orchestrator-worker, swarm", "Coordinate several agents on a task.", [{ key: "how-we-built-our-multi-agent-research-system", role: "learn" }]),
        a("agentic-rag", "Agentic RAG and evaluator-optimizer", "Let agents decide when and what to retrieve, and self-improve."),
        a("tool-design-deep", "Tool design: schemas, errors, sandboxing, parallel tools", "Give models safe, well-described capabilities.", [{ key: "writing-e-ective-tools-for-agents", role: "learn" }]),
        a("memory-deep", "Memory: short/long-term, episodic, semantic, summarization", "How agents remember across steps and sessions.", [{ key: "memory-overview", role: "learn" }]),
      ],
    ),
    extraTopic(
      "frameworks-mcp-deep",
      "Frameworks and MCP, deeper",
      "The ecosystem for building and connecting agents.",
      [
        a("frameworks-agents", "LangGraph, OpenAI Agents SDK, CrewAI, smolagents, PydanticAI", "Pick a framework on purpose for the job.", [{ key: "introduction-to-langgraph", role: "course" }]),
        a("langgraph-internals", "LangGraph: state, nodes, edges, checkpoints, interrupts", "Explicit, resumable agent graphs with human approval.", [{ key: "interrupts-human-in-the-loop", role: "learn" }]),
        a("mcp-architecture", "MCP architecture: host, client, server, transports", "How the Model Context Protocol connects tools to models.", [{ key: "what-is-mcp", role: "learn" }]),
        a("mcp-primitives", "MCP tools, resources, prompts and the Inspector", "The building blocks of an MCP server and how to debug them.", [{ key: "build-an-mcp-server", role: "learn" }]),
      ],
    ),
    extraTopic(
      "agent-safety-deep",
      "Agent safety and control, deeper",
      "Keeping autonomous systems on a leash.",
      [
        a("limits", "Step, token and cost limits", "Hard stops so an agent cannot loop or overspend."),
        a("hitl", "Human-in-the-loop approval", "Require a person to approve risky actions.", [{ key: "agents-sdk-human-in-the-loop", role: "learn" }]),
        a("trifecta", "The lethal trifecta and injection in agents", "Never combine private data, untrusted content and outbound actions.", [{ key: "the-lethal-trifecta-for-ai-agents", role: "learn" }]),
        a("agent-evals", "Agent evaluation on real tasks", "Test agents many times before trusting them.", [{ key: "demystifying-evals-for-ai-agents", role: "learn" }]),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "fine-tuning": [
    extraTopic(
      "finetuning-deep",
      "Fine-tuning, deeper",
      "Methods and decisions beyond a first LoRA.",
      [
        a("decide-ft", "Prompt vs RAG vs fine-tune", "Choose the cheapest approach that solves the problem."),
        a("data-prep", "Instruction data, chat templates, quality/dedup, synthetic data", "Dataset quality decides fine-tune quality."),
        a("peft-methods", "PEFT: LoRA, QLoRA, DoRA, adapters, prefix tuning", "Parameter-efficient methods and their trade-offs.", [{ key: "peft-quicktour", role: "learn" }]),
        a("lora-hparams", "LoRA rank, alpha, target modules", "The knobs that decide adapter capacity and cost."),
        a("preference-methods", "DPO, ORPO, KTO, SimPO, reward models", "Align a model to preferred outputs.", [{ key: "trl-dpo-trainer", role: "learn" }]),
        a("ft-tools", "Unsloth, TRL, Axolotl, bitsandbytes", "The tooling that makes free-GPU fine-tuning practical.", [{ key: "unsloth-notebooks", role: "practice" }]),
        a("forgetting-eval", "Catastrophic forgetting and before/after eval", "Prove the fine-tune helped without breaking other skills."),
        a("export-cards", "Merging, exporting (GGUF), model cards, licenses", "Ship the adapter responsibly and runnably."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "evals-and-production": [
    extraTopic(
      "evals-deep",
      "Evaluation, deeper",
      "How to measure LLM systems you can trust.",
      [
        a("eval-types", "Assertion, reference-based, rubric, pairwise, human", "The spectrum of eval methods and when to use each.", [{ key: "llm-evals-everything-you-need-to-know", role: "learn" }]),
        a("llm-judge", "LLM-as-judge: bias, position bias, calibration", "Build a judge you can actually trust.", [{ key: "using-llm-as-a-judge-a-complete-guide", role: "learn" }]),
        a("error-analysis", "Error analysis and taxonomies", "Read real failures and group them to prioritise fixes."),
        a("ci-evals", "Regression tests and CI evals", "Run evals on every change to prevent silent regressions."),
        a("online-eval", "Online vs offline eval and A/B testing", "Measure quality in production, not just offline."),
      ],
    ),
    extraTopic(
      "observability-security-deep",
      "Observability and security, deeper",
      "Run AI safely with visibility.",
      [
        a("tracing", "Tracing, spans, metrics, dashboards", "See latency, tokens, cost and errors per request.", [{ key: "langfuse-tracing-docs", role: "learn" }]),
        a("owasp", "OWASP LLM Top 10", "The canonical risk list for LLM apps.", [{ key: "owasp-top-10-for-llm-apps-2026", role: "learn" }]),
        a("injection-jailbreak", "Prompt injection, jailbreaks, data exfiltration", "Attacks you must defend against.", [{ key: "prompt-injection-series", role: "learn" }]),
        a("guardrails", "Input/output guardrails and red teaming", "Filter unsafe I/O and probe your own system.", [{ key: "nemo-guardrails", role: "learn" }]),
        a("secrets-limits", "Secrets management and rate limiting", "Keep keys safe and cap abuse and spend."),
      ],
    ),
    extraTopic(
      "serving-deploy-deep",
      "Serving, deployment and MLOps, deeper",
      "Get it running for real users, affordably.",
      [
        a("serving", "FastAPI, streaming, vLLM, TGI, Ollama", "Serve models and apps with good latency.", [{ key: "vllm-quickstart", role: "learn" }]),
        a("docker-cicd", "Docker, docker-compose, CI/CD", "Package and ship reproducibly.", [{ key: "docker-get-started", role: "learn" }]),
        a("cloud-hosting", "Render, Cloud Run, Modal, Spaces, serverless", "Free and cheap ways to deploy to a public URL.", [{ key: "made-with-ml", role: "course" }]),
        a("caching-queues", "Caching (Redis), queues, autoscaling", "Handle load and cut repeat cost."),
        a("mlops", "Experiment tracking, model registry, versioning", "The MLOps backbone for teams.", [{ key: "mlops-zoomcamp", role: "course" }]),
        a("cost-monitoring", "Cost optimization and monitoring", "Track and reduce spend; alert on regressions."),
      ],
    ),
  ],

  /* ---------------------------------------------------------------- */
  "get-hired": [
    extraTopic(
      "portfolio-deep",
      "Portfolio and personal brand, deeper",
      "Make your work legible to hiring managers.",
      [
        a("project-selection", "Choosing and framing projects", "Pick projects that prove range: one RAG, one agent, one deployed."),
        a("readmes", "READMEs, architecture diagrams, case studies", "Explain problem, design, evals and results clearly.", [{ key: "a-field-guide-to-improving-ai-products", role: "learn" }]),
        a("demos", "Demo videos and building in public", "Show, don't tell, and grow an audience while you learn.", [{ key: "obs-studio", role: "practice" }]),
        a("hf-profile", "Hugging Face profile and blogging", "A public model/Space and write-ups that compound."),
      ],
    ),
    extraTopic(
      "interview-deep",
      "Interview preparation, deeper",
      "What AI-engineer interviews actually test.",
      [
        a("ml-fundamentals-qa", "ML/DL fundamentals Q&A", "Explain overfitting, metrics, attention, RAG vs fine-tuning out loud.", [{ key: "machine-learning-interviews-book", role: "learn" }]),
        a("system-design", "AI system design (RAG/agent/LLM systems)", "Design retrieval, agents and serving under constraints."),
        a("live-coding", "Live-coding LLM API calls and parsing JSON", "Call a model, parse output, handle failure under time pressure."),
        a("dsa-refresh", "DSA and Python coding refresh", "Comfortable with arrays, maps, strings and complexity."),
        a("behavioral-mock", "Behavioral, take-homes and mock interviews", "Practise stories and do timed mocks, including system design."),
      ],
    ),
    extraTopic(
      "jobsearch-deep",
      "Job search and staying current",
      "Turn skills into offers, then keep growing.",
      [
        a("where-apply", "Where to apply and networking", "LinkedIn, Wellfound, Internshala, YC, Unstop, plus referrals.", [{ key: "wellfound-ml-jobs-in-india", role: "learn" }]),
        a("outreach-tracking", "Cold outreach and application tracking", "Reach out well and manage a pipeline of applications."),
        a("negotiation", "Negotiation basics", "Understand offers, equity and how to ask."),
        a("staying-current", "Newsletters, papers and communities", "Keep learning after week 24.", [{ key: "the-batch", role: "learn" }]),
      ],
    ),
  ],
};
