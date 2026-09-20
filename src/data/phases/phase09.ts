import type { PhaseSeed } from "../types";

export const phase09: PhaseSeed = {
  order: 9,
  slug: "fine-tuning",
  title: "Fine-tuning",
  subtitle: "When it pays, and how to prove it helped",
  description:
    "Sometimes prompting and RAG are not enough. Learn when fine-tuning pays, how LoRA trains a small adapter on a free GPU, and how to prove it helped.",
  colorVar: 9,
  weekStart: 21,
  weekEnd: 21,
  doneWhen: [
    "You can argue when NOT to fine-tune.",
    "You trained a LoRA adapter and measured the gain.",
    "Your model card says what data, method and results.",
  ],
  antiPatternTitle: "Tuning in facts",
  antiPatternBody:
    "Fine-tuning to add knowledge. Tuning shapes behaviour and format; for facts that change, use RAG.",
  weeks: [
    {
      weekNumber: 21,
      title: "Fine-tuning, when it pays",
      summary: "When to fine-tune, LoRA / QLoRA, Unsloth, DPO, evals.",
      shipTitle: "LoRA fine-tune with before/after eval",
      shipDescription:
        "A LoRA fine-tune of a small open model for one narrow task, with a before / after eval.",
      topics: [
        {
          slug: "decide-and-data",
          title: "Decide and prepare data",
          summary: "Choose by problem; build a clean instruction dataset.",
          whyItMatters:
            "Most fine-tuning failures are really data or decision failures.",
          lane: "learn",
          resources: [
            { key: "unsloth-ne-tuning-guide", role: "learn", rank: 0 },
            { key: "is-fine-tuning-still-valuable", role: "learn" },
            { key: "mastering-llms-free-talks", role: "learn" },
          ],
          subtopics: [
            {
              slug: "when-to-finetune",
              title: "Prompting vs RAG vs fine-tuning: choose by problem",
              explanation:
                "Use RAG for changing facts, prompting/structured output for format, and fine-tuning for a narrow, high-volume behaviour.",
              whyItMatters:
                "Choosing wrong wastes GPUs and time on a solved problem.",
              prerequisites: ["Retrieve, augment, generate and cite sources"],
              learningOutcomes: ["Justify fine-tuning vs the alternatives"],
              practicalTask: "Write a one-paragraph justification for your task.",
              doneWhen: ["You can argue when NOT to fine-tune"],
              estMinutes: 45,
            },
            {
              slug: "instruction-dataset",
              title: "Build a clean instruction dataset",
              explanation:
                "Assemble high-quality, deduplicated input/output examples in the model's chat template.",
              whyItMatters:
                "Data quality caps the quality of any fine-tune.",
              prerequisites: ["Prompting vs RAG vs fine-tuning: choose by problem"],
              learningOutcomes: ["Format data into a chat/instruction template"],
              practicalTask: "Prepare a small, clean dataset for one narrow task.",
              doneWhen: ["Dataset is deduplicated and correctly formatted"],
              estMinutes: 60,
            },
          ],
        },
        {
          slug: "train-eval",
          title: "Train, evaluate and publish",
          summary: "LoRA/QLoRA on a free GPU, DPO overview, before/after eval.",
          whyItMatters:
            "A measured before/after is what turns a fine-tune into evidence.",
          lane: "build",
          resources: [
            { key: "unsloth-notebooks", role: "practice", rank: 0 },
            { key: "peft-quicktour", role: "learn" },
            { key: "hugging-face-smol-course", role: "course" },
            { key: "trl-dpo-trainer", role: "learn" },
            { key: "lora-and-qlora-explained", role: "video" },
            { key: "qwen3-0-6b-model-card", role: "learn" },
          ],
          subtopics: [
            {
              slug: "lora-qlora",
              title: "LoRA and QLoRA: train a small adapter",
              explanation:
                "LoRA trains small low-rank adapters instead of all weights; QLoRA quantizes the base model to fit a free GPU.",
              whyItMatters:
                "This is how fine-tuning is done affordably in practice.",
              prerequisites: ["Build a clean instruction dataset"],
              learningOutcomes: [
                "Configure and train a LoRA adapter",
                "Use QLoRA to fit a small GPU",
              ],
              practicalTask: "Fine-tune a small open model with LoRA on Colab.",
              doneWhen: ["Training completes and the adapter saves"],
              estMinutes: 120,
            },
            {
              slug: "eval-publish",
              title: "Evaluate before and after, then publish to the Hub",
              explanation:
                "Score the base and fine-tuned model on the same eval set, then publish the adapter and a model card.",
              whyItMatters:
                "Without a before/after eval you cannot claim the fine-tune helped.",
              prerequisites: ["LoRA and QLoRA: train a small adapter"],
              learningOutcomes: [
                "Run a before/after eval",
                "Write a model card",
              ],
              practicalTask: "Publish your adapter with a before/after eval and card.",
              doneWhen: [
                "You measured the gain on a fixed eval",
                "The model card states data, method and results",
              ],
              estMinutes: 75,
            },
            {
              slug: "dpo-glance",
              title: "Preference tuning (DPO) at a glance",
              explanation:
                "DPO nudges a model toward preferred over rejected responses using preference pairs, without a reward model.",
              whyItMatters:
                "Preference tuning is how you get 'the answer people like', not just correct ones.",
              prerequisites: ["Evaluate before and after, then publish to the Hub"],
              learningOutcomes: ["Explain when DPO is worth it"],
              practicalTask: "Describe a task where DPO would beat plain SFT.",
              doneWhen: ["Your example is sound"],
              estMinutes: 30,
            },
          ],
        },
      ],
    },
  ],
};
