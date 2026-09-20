import type { PhaseSeed } from "../types";

export const phase05: PhaseSeed = {
  order: 5,
  slug: "transformers-and-llms",
  title: "Transformers and LLMs",
  subtitle: "Build attention and a tiny GPT, then how LLMs are built",
  description:
    "Open the black box. Build attention and a tiny GPT yourself, then learn how real LLMs are pretrained, tuned, made to reason and served.",
  colorVar: 5,
  weekStart: 13,
  weekEnd: 14,
  doneWhen: [
    "You can draw a transformer block and explain each part.",
    "You can explain why temperature changes an answer.",
    "You know what SFT and RLHF each add to a base model.",
  ],
  antiPatternTitle: "The wrong goal",
  antiPatternBody:
    "Believing AI engineers pretrain models. Understand the internals, then move on; your job is building with models.",
  weeks: [
    {
      weekNumber: 13,
      title: "Attention and transformers",
      summary: "Tokenizers, embeddings, self-attention, a GPT from scratch.",
      shipTitle: "Character-level GPT",
      shipDescription:
        "A small character-level GPT trained on text you choose, with samples.",
      topics: [
        {
          slug: "tokenization",
          title: "Tokenization and embeddings",
          summary: "Byte-pair encoding, token and position embeddings.",
          whyItMatters:
            "Tokens are the units LLMs actually see; many quirks trace back to tokenization.",
          lane: "learn",
          resources: [
            { key: "let-s-build-the-gpt-tokenizer", role: "video", rank: 0 },
            { key: "tiktokenizer-playground", role: "practice" },
            { key: "minbpe-tokenizer-code", role: "practice" },
          ],
          subtopics: [
            {
              slug: "bpe",
              title: "Tokenization and byte-pair encoding",
              explanation:
                "BPE merges frequent character pairs into subword tokens, balancing vocabulary size and sequence length.",
              whyItMatters:
                "Token counts drive cost and context limits, and explain odd model behaviour.",
              prerequisites: ["Embeddings: things as vectors"],
              learningOutcomes: ["Explain why tokens are subwords", "Count tokens for a string"],
              practicalTask: "Tokenize text in the Tiktokenizer playground and inspect merges.",
              doneWhen: ["You can explain a surprising token split"],
              estMinutes: 60,
            },
            {
              slug: "token-position-embeddings",
              title: "Token and position embeddings",
              explanation:
                "Each token maps to a vector; position embeddings add order information the model would otherwise lack.",
              whyItMatters:
                "Attention is order-agnostic without position information.",
              prerequisites: ["Tokenization and byte-pair encoding"],
              learningOutcomes: ["Explain why position embeddings are needed"],
              practicalTask: "Add token+position embeddings in your GPT build.",
              doneWhen: ["Embeddings feed the first attention layer"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "attention",
          title: "Self-attention and the transformer block",
          summary: "QKV, self-attention, multi-head attention, masking.",
          whyItMatters:
            "Self-attention is the central mechanism of every modern LLM.",
          lane: "build",
          resources: [
            { key: "let-s-build-gpt-from-scratch-in-code", role: "video", rank: 0 },
            { key: "the-illustrated-transformer", role: "learn" },
            { key: "transformer-explainer", role: "practice" },
            { key: "the-annotated-transformer", role: "learn" },
            { key: "introduction-to-transformers", role: "video" },
          ],
          subtopics: [
            {
              slug: "qkv-self-attention",
              title: "Queries, keys, values and self-attention",
              explanation:
                "Each token forms a query, key and value; attention weights come from query-key dot products and mix the values.",
              whyItMatters:
                "This dot-product mixing is how tokens share context.",
              prerequisites: ["Vectors, dot products, matrix multiplication", "Token and position embeddings"],
              learningOutcomes: [
                "Explain Q, K, V without memorised definitions",
                "Compute attention weights with softmax",
              ],
              practicalTask: "Implement single-head self-attention in PyTorch.",
              doneWhen: ["Output shapes are correct and weights sum to 1"],
              estMinutes: 90,
            },
            {
              slug: "multihead-masking",
              title: "Multi-head attention and causal masking",
              explanation:
                "Multiple heads attend to different relationships; causal masks stop tokens from seeing the future.",
              whyItMatters:
                "Causal masking is what makes a model a left-to-right generator (GPT).",
              prerequisites: ["Queries, keys, values and self-attention"],
              learningOutcomes: [
                "Add multiple heads",
                "Explain why GPT needs a causal mask",
              ],
              practicalTask: "Add multi-head attention with a causal mask.",
              doneWhen: ["A token cannot attend to later tokens"],
              estMinutes: 75,
            },
            {
              slug: "transformer-block",
              title: "The transformer block: residuals, layer norm",
              explanation:
                "A block stacks attention and a feed-forward layer with residual connections and layer normalisation for stable training.",
              whyItMatters:
                "Stacking these blocks is literally the architecture of GPT.",
              prerequisites: ["Multi-head attention and causal masking"],
              learningOutcomes: ["Draw and label a transformer block"],
              practicalTask:
                "Assemble blocks into a character-level GPT and train on chosen text.",
              doneWhen: [
                "You can draw the block from memory",
                "Your GPT generates plausible samples",
              ],
              estMinutes: 120,
            },
            {
              slug: "decoder-encoder",
              title: "Decoder-only (GPT) vs encoder (BERT)",
              explanation:
                "Decoder-only models generate text; encoder models produce representations for understanding tasks.",
              whyItMatters:
                "Knowing the difference guides model choice for a task.",
              prerequisites: ["The transformer block: residuals, layer norm"],
              learningOutcomes: ["Choose decoder vs encoder for a task"],
              practicalTask: "List one task suited to each architecture.",
              doneWhen: ["Your choices are justified"],
              estMinutes: 30,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 14,
      title: "How LLMs are built and run",
      summary: "Pretraining, SFT, RLHF, reasoning, inference, open models.",
      shipTitle: "Compare 3 open models locally",
      shipDescription:
        "A comparison of 3 open models run locally on 20 of your own prompts.",
      topics: [
        {
          slug: "training-pipeline",
          title: "The LLM training pipeline",
          summary: "Pretraining, SFT, RLHF and reasoning models.",
          whyItMatters:
            "Understanding the pipeline explains model behaviour and when to fine-tune.",
          lane: "learn",
          resources: [
            { key: "deep-dive-into-llms-like-chatgpt", role: "video", rank: 0 },
            { key: "intro-to-large-language-models", role: "video" },
            { key: "hugging-face-llm-course", role: "course" },
            { key: "understanding-reasoning-llms", role: "learn" },
            { key: "the-rlhf-book", role: "learn" },
            { key: "the-epic-history-of-llms", role: "video" },
          ],
          subtopics: [
            {
              slug: "pretraining-sft-rlhf",
              title: "Pretraining, SFT and RLHF / preference tuning",
              explanation:
                "Pretraining learns language from web text; SFT teaches instruction following; RLHF/preference tuning aligns outputs to human preferences.",
              whyItMatters:
                "This explains why a base model and a chat model behave so differently.",
              prerequisites: ["The transformer block: residuals, layer norm"],
              learningOutcomes: [
                "State what SFT and RLHF each add",
                "Explain base vs instruct models",
              ],
              practicalTask: "Compare a base and instruct model on the same prompt.",
              doneWhen: ["You can explain what SFT and RLHF add"],
              estMinutes: 60,
            },
            {
              slug: "reasoning-models",
              title: "Reasoning models and test-time compute",
              explanation:
                "Reasoning models spend extra compute generating intermediate steps before answering.",
              whyItMatters:
                "Knowing when reasoning helps saves cost and improves hard tasks.",
              prerequisites: ["Pretraining, SFT and RLHF / preference tuning"],
              learningOutcomes: ["Explain test-time compute tradeoffs"],
              practicalTask: "Compare a reasoning vs standard model on a hard prompt.",
              doneWhen: ["You can say when reasoning is worth the cost"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "inference-open-models",
          title: "Inference and open models",
          summary: "Sampling, KV cache, context windows, running locally.",
          whyItMatters:
            "You will run and compare open models throughout the build phases.",
          lane: "build",
          resources: [
            { key: "llms-from-scratch-code", role: "practice", rank: 0 },
            { key: "llm-visualization-3d", role: "practice" },
          ],
          subtopics: [
            {
              slug: "sampling",
              title: "Sampling: temperature and top-p",
              explanation:
                "Temperature and top-p control randomness by reshaping the next-token distribution.",
              whyItMatters:
                "These knobs decide whether output is deterministic or creative.",
              prerequisites: ["Decoder-only (GPT) vs encoder (BERT)"],
              learningOutcomes: ["Explain why temperature changes an answer"],
              practicalTask: "Vary temperature and observe output changes.",
              doneWhen: ["You can explain temperature's effect"],
              estMinutes: 30,
            },
            {
              slug: "kv-context",
              title: "KV cache, context windows, latency",
              explanation:
                "The KV cache reuses past attention keys/values to speed generation; context windows cap how much the model can see.",
              whyItMatters:
                "Latency and context limits shape real application design.",
              prerequisites: ["Sampling: temperature and top-p"],
              learningOutcomes: ["Explain what the KV cache saves"],
              practicalTask: "Measure how prompt length affects latency locally.",
              doneWhen: ["You can explain the latency/context tradeoff"],
              estMinutes: 45,
            },
            {
              slug: "run-open-models",
              title: "Open-weight models with Hugging Face and Ollama",
              explanation:
                "Download and run open models locally with Ollama or Transformers to compare them yourself.",
              whyItMatters:
                "Zero-cost local models power the rest of this plan.",
              prerequisites: ["KV cache, context windows, latency"],
              learningOutcomes: ["Run 3 open models on your own prompts"],
              practicalTask: "Compare 3 open models on 20 of your own prompts.",
              doneWhen: ["You have a written comparison across 3 models"],
              estMinutes: 90,
            },
          ],
        },
      ],
    },
  ],
};
