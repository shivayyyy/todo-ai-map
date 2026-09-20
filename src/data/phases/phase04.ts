import type { PhaseSeed } from "../types";

export const phase04: PhaseSeed = {
  order: 4,
  slug: "deep-learning",
  title: "Deep learning",
  subtitle: "Neural nets from scratch, then PyTorch",
  description:
    "Neural networks, built from scratch and then in PyTorch. This is where you stop treating models as magic and start reading training curves like a doctor reads a scan.",
  colorVar: 4,
  weekStart: 10,
  weekEnd: 12,
  doneWhen: [
    "You write a PyTorch training loop without a template.",
    "You explain backprop on a small computation graph.",
    "You have fine-tuned a pretrained model and shared it.",
  ],
  antiPatternTitle: "Copy-paste learning",
  antiPatternBody:
    "Running notebooks you could not rewrite. Once a week, close the tutorial and rebuild the training loop from memory.",
  weeks: [
    {
      weekNumber: 10,
      title: "Neural nets from scratch",
      summary: "Neurons, activations, loss, backprop, micrograd.",
      shipTitle: "Your own micrograd-style engine",
      shipDescription: "Your own micrograd-style engine training a small MLP.",
      topics: [
        {
          slug: "nn-fundamentals",
          title: "Neural network fundamentals",
          summary: "Neurons, activations, loss and the forward pass.",
          whyItMatters:
            "Understanding the forward pass is the prerequisite for understanding backprop.",
          lane: "learn",
          resources: [
            { key: "neural-networks-zero-to-hero", role: "video", rank: 0 },
            { key: "neural-networks", role: "video" },
            { key: "understanding-deep-learning", role: "learn" },
            { key: "statquest-neural-networks", role: "video" },
          ],
          subtopics: [
            {
              slug: "neurons-activations",
              title: "Neurons, layers, activation functions",
              explanation:
                "A neuron is a weighted sum plus a nonlinearity; stacking them in layers builds expressive functions.",
              whyItMatters:
                "Without nonlinear activations a deep network collapses to a linear one.",
              prerequisites: ["Vectors, dot products, matrix multiplication"],
              learningOutcomes: [
                "Explain why activations must be nonlinear",
                "Compute a neuron's output by hand",
              ],
              practicalTask: "Implement a single neuron and a ReLU in NumPy.",
              doneWhen: ["Your neuron produces correct outputs"],
              estMinutes: 60,
            },
            {
              slug: "loss-forward",
              title: "Forward pass and the loss",
              explanation:
                "The forward pass computes predictions; the loss scores how wrong they are.",
              whyItMatters:
                "Training is minimising this loss, so you must compute it correctly.",
              prerequisites: ["Neurons, layers, activation functions"],
              learningOutcomes: ["Compute MSE and cross-entropy loss"],
              practicalTask: "Compute loss for a tiny forward pass by hand.",
              doneWhen: ["Your loss matches a reference calculation"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "backprop",
          title: "Backpropagation",
          summary: "Chain rule, autograd engine, and training a tiny MLP.",
          whyItMatters:
            "Backprop is the algorithm that makes deep learning possible.",
          lane: "build",
          resources: [
            { key: "building-micrograd", role: "video", rank: 0 },
            { key: "neural-networks-zero-to-hero", role: "video" },
          ],
          subtopics: [
            {
              slug: "backprop-chain",
              title: "Backpropagation is the chain rule",
              explanation:
                "Gradients flow backward through the computation graph by repeated application of the chain rule.",
              whyItMatters:
                "Once you see it as the chain rule, backprop stops being magic.",
              prerequisites: ["Derivatives, the chain rule, gradients", "Forward pass and the loss"],
              learningOutcomes: ["Trace gradients through a small graph"],
              practicalTask: "Hand-compute gradients for a 3-node graph.",
              doneWhen: ["Your gradients match numeric differences"],
              estMinutes: 60,
            },
            {
              slug: "build-autograd",
              title: "Build a tiny autograd engine and train an MLP",
              explanation:
                "Implement a Value type that records operations and backpropagates gradients, then train a small MLP with it.",
              whyItMatters:
                "Rebuilding autograd from memory is the surest sign you truly understand training.",
              prerequisites: ["Backpropagation is the chain rule"],
              learningOutcomes: [
                "Build an autograd engine",
                "Train an MLP on toy data",
              ],
              practicalTask: "Write your own micrograd-style engine and train an MLP.",
              doneWhen: ["The MLP learns and loss decreases"],
              estMinutes: 120,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 11,
      title: "PyTorch fundamentals",
      summary: "Tensors, autograd, nn.Module, training loops, GPUs.",
      shipTitle: "Fashion-MNIST classifier",
      shipDescription:
        "A Fashion-MNIST classifier with training curves and 90%+ test accuracy.",
      topics: [
        {
          slug: "pytorch-core",
          title: "PyTorch core",
          summary: "Tensors, autograd, nn.Module and training loops.",
          whyItMatters:
            "PyTorch is the framework you will use for all deep-learning and LLM work.",
          lane: "build",
          resources: [
            { key: "pytorch-learn-the-basics", role: "learn", rank: 0 },
            { key: "learn-pytorch-for-deep-learning", role: "learn" },
            { key: "pytorch-full-course", role: "video" },
            { key: "practical-deep-learning-using-pytorch", role: "video" },
          ],
          subtopics: [
            {
              slug: "tensors-autograd",
              title: "Tensors, autograd and optimisers",
              explanation:
                "Tensors are arrays on CPU/GPU; autograd tracks gradients; optimisers apply them to parameters.",
              whyItMatters:
                "These three pieces are every PyTorch training loop.",
              prerequisites: ["Build a tiny autograd engine and train an MLP"],
              learningOutcomes: [
                "Move tensors between devices",
                "Use an optimiser step",
              ],
              practicalTask: "Recreate gradient descent on a line with PyTorch autograd.",
              doneWhen: ["Autograd-based fit matches your NumPy version"],
              estMinutes: 75,
            },
            {
              slug: "module-dataloader",
              title: "nn.Module, Dataset, DataLoader and training loops",
              explanation:
                "Define models as nn.Module, batch data with Dataset/DataLoader, and write the train/validation loop with checkpoints.",
              whyItMatters:
                "This is the reusable skeleton for every model you train.",
              prerequisites: ["Tensors, autograd and optimisers"],
              learningOutcomes: [
                "Write a training and validation loop",
                "Save and load a checkpoint",
              ],
              practicalTask:
                "Train a Fashion-MNIST classifier to 90%+ with training curves.",
              doneWhen: [
                "You wrote the loop without a template",
                "Test accuracy is 90%+ with curves plotted",
              ],
              estMinutes: 120,
            },
            {
              slug: "regularization",
              title: "Dropout, weight decay, early stopping",
              explanation:
                "Regularisation techniques reduce overfitting so validation accuracy tracks training.",
              whyItMatters:
                "Reading and fixing the train/val gap is the daily job of a DL practitioner.",
              prerequisites: ["nn.Module, Dataset, DataLoader and training loops"],
              learningOutcomes: ["Apply dropout and weight decay", "Use early stopping"],
              practicalTask: "Reduce your model's overfitting with regularisation.",
              doneWhen: ["The train/val gap shrinks"],
              estMinutes: 45,
              resources: [{ key: "a-recipe-for-training-neural-networks", role: "learn", rank: 0 }],
            },
          ],
        },
      ],
    },
    {
      weekNumber: 12,
      title: "CNNs, transfer learning, embeddings",
      summary: "Convolutions, pretrained models, fine-tuning, embeddings.",
      shipTitle: "Photo classifier on Spaces",
      shipDescription:
        "A classifier for your own photos, published as a free public Gradio demo.",
      topics: [
        {
          slug: "cnn-transfer",
          title: "CNNs and transfer learning",
          summary: "Convolutions, pretrained models, fine-tuning, embeddings.",
          whyItMatters:
            "Transfer learning lets you build strong image models with little data.",
          lane: "build",
          resources: [
            { key: "practical-deep-learning-for-coders", role: "course", rank: 0 },
            { key: "stanford-cs231n-2025", role: "video" },
            { key: "cs231n-course-notes", role: "learn" },
            { key: "dive-into-deep-learning", role: "learn" },
          ],
          subtopics: [
            {
              slug: "convolutions",
              title: "Convolutions and pooling",
              explanation:
                "Convolutions detect local patterns with shared weights; pooling downsamples for translation tolerance.",
              whyItMatters:
                "CNNs are the standard for images and the intuition behind many architectures.",
              prerequisites: ["nn.Module, Dataset, DataLoader and training loops"],
              learningOutcomes: ["Explain what a conv filter learns"],
              practicalTask: "Train a small CNN on an image dataset.",
              doneWhen: ["Your CNN beats an MLP baseline on images"],
              estMinutes: 75,
            },
            {
              slug: "transfer-learning",
              title: "Transfer learning and data augmentation",
              explanation:
                "Start from a pretrained backbone and fine-tune it on your data, using augmentation to stretch small datasets.",
              whyItMatters:
                "This is how real image projects are built without giant datasets.",
              prerequisites: ["Convolutions and pooling"],
              learningOutcomes: [
                "Fine-tune a pretrained model",
                "Apply augmentation",
              ],
              practicalTask:
                "Fine-tune a pretrained CNN on your own photos and publish a Gradio demo.",
              doneWhen: ["A public demo classifies your photos"],
              estMinutes: 120,
            },
            {
              slug: "embeddings-intro",
              title: "Embeddings: things as vectors",
              explanation:
                "Networks map inputs to dense vectors where similar things are close, the foundation of search and RAG.",
              whyItMatters:
                "Embeddings connect deep learning to the LLM and RAG phases ahead.",
              prerequisites: ["Transfer learning and data augmentation"],
              learningOutcomes: ["Explain what an embedding captures"],
              practicalTask: "Extract embeddings from your model and find nearest neighbours.",
              doneWhen: ["Nearest neighbours are semantically similar"],
              estMinutes: 45,
            },
          ],
        },
      ],
    },
  ],
};
