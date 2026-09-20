import type { PhaseSeed } from "../types";

export const phase02: PhaseSeed = {
  order: 2,
  slug: "data-and-math",
  title: "Data and math for ML",
  subtitle: "NumPy, pandas and the math you actually need",
  description:
    "Models eat data and speak in vectors. Two weeks to get fluent with NumPy and pandas, and to build intuition for the handful of math ideas machine learning actually uses.",
  colorVar: 2,
  weekStart: 5,
  weekEnd: 6,
  doneWhen: [
    "You clean and summarise a messy CSV in pandas in under an hour.",
    "You can explain a gradient and a dot product to a friend.",
    "You read a distribution plot and spot outliers.",
  ],
  antiPatternTitle: "Math paralysis",
  antiPatternBody:
    "Trying to finish a full linear-algebra course before touching ML. Learn the intuition now and go deeper only when a concept blocks you.",
  weeks: [
    {
      weekNumber: 5,
      title: "NumPy, pandas and plots",
      summary: "Arrays, DataFrames, cleaning, EDA and charts.",
      shipTitle: "EDA notebook on a real Indian dataset",
      shipDescription:
        "An EDA notebook on a real Indian dataset: 5 charts, 5 written findings.",
      topics: [
        {
          slug: "numpy",
          title: "NumPy arrays",
          summary: "Arrays, shapes, broadcasting and vectorized math.",
          whyItMatters:
            "NumPy is the numerical core under pandas, scikit-learn and PyTorch.",
          lane: "learn",
          resources: [
            { key: "numpy-the-absolute-basics", role: "learn", rank: 0 },
            { key: "chai-aur-numpy-complete-course", role: "video" },
          ],
          subtopics: [
            {
              slug: "arrays-shapes-broadcasting",
              title: "Arrays, shapes and broadcasting",
              explanation:
                "Create ndarrays, inspect .shape, index and slice, and use broadcasting to apply operations across dimensions without loops.",
              whyItMatters:
                "Shape errors are the #1 bug in ML code; broadcasting is how tensors combine.",
              prerequisites: ["Lists, tuples, dictionaries and sets"],
              learningOutcomes: [
                "Reshape and slice arrays",
                "Predict the result shape of a broadcast operation",
              ],
              practicalTask: "Normalize a 2D array column-wise using broadcasting.",
              doneWhen: ["You can explain why a broadcast succeeds or fails"],
              estMinutes: 75,
            },
            {
              slug: "vectorization",
              title: "Vectorized operations",
              explanation:
                "Replace Python loops with array operations that run in optimized C, dramatically faster.",
              whyItMatters:
                "Vectorized code is both faster and clearer, and mirrors how you will write tensor code later.",
              prerequisites: ["Arrays, shapes and broadcasting"],
              learningOutcomes: ["Rewrite a loop as a vectorized expression"],
              practicalTask: "Compute pairwise differences without an explicit loop.",
              doneWhen: ["No Python loop remains in the hot path"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "pandas",
          title: "pandas and EDA",
          summary: "Load, filter, group, merge, clean and visualize.",
          whyItMatters:
            "pandas is where you spend most of your time in any data or ML project.",
          lane: "build",
          resources: [
            { key: "kaggle-learn-pandas", role: "practice", rank: 0 },
            { key: "10-minutes-to-pandas", role: "learn" },
            { key: "kaggle-learn-data-cleaning", role: "practice" },
            { key: "kaggle-learn-data-visualization", role: "practice" },
            { key: "python-for-data-analysis-3rd-ed", role: "learn" },
            { key: "pandas", role: "video" },
            { key: "corey-schafer-pandas-tutorials", role: "video" },
          ],
          subtopics: [
            {
              slug: "load-filter-group-merge",
              title: "Load, filter, group, merge, pivot",
              explanation:
                "Read data into DataFrames, select and filter rows/columns, group and aggregate, merge frames and pivot for summaries.",
              whyItMatters:
                "These five verbs answer most questions you will ever ask of a dataset.",
              prerequisites: ["Arrays, shapes and broadcasting"],
              learningOutcomes: [
                "groupby-aggregate a DataFrame",
                "merge two frames on a key",
              ],
              practicalTask: "Produce a summary table of a real dataset with groupby.",
              doneWhen: ["Your summary answers a specific question"],
              estMinutes: 90,
            },
            {
              slug: "cleaning",
              title: "Missing values, dtypes, duplicates",
              explanation:
                "Detect and handle NaNs, fix column dtypes, and drop or reconcile duplicates before analysis.",
              whyItMatters:
                "Real data is messy; skipping cleaning silently corrupts every downstream result.",
              prerequisites: ["Load, filter, group, merge, pivot"],
              learningOutcomes: [
                "Choose drop vs impute for missing values",
                "Convert columns to correct dtypes",
              ],
              practicalTask: "Clean a messy CSV and document each fix.",
              doneWhen: ["No unexpected NaNs remain and dtypes are correct"],
              estMinutes: 60,
            },
            {
              slug: "charts-eda",
              title: "Charts that answer one question each",
              explanation:
                "Build focused charts (distributions, relationships, trends) where each visual answers exactly one question.",
              whyItMatters:
                "A chart without a question is decoration; hiring managers want insight.",
              prerequisites: ["Missing values, dtypes, duplicates"],
              learningOutcomes: [
                "Pick the right chart for a question",
                "Write a one-line finding under each chart",
              ],
              practicalTask: "Make 5 charts with 5 written findings for your ship.",
              doneWhen: ["Each chart has a stated question and finding"],
              estMinutes: 75,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 6,
      title: "The math you actually need",
      summary: "Vectors, matrices, gradients, probability, statistics.",
      shipTitle: "Gradient descent from scratch",
      shipDescription:
        "Gradient descent from scratch in NumPy fitting a line, with a loss plot.",
      topics: [
        {
          slug: "linear-algebra",
          title: "Vectors and matrices",
          summary: "Dot products and matrix multiplication.",
          whyItMatters:
            "Every model is matrix multiplications; attention itself is dot products.",
          lane: "learn",
          resources: [
            { key: "essence-of-linear-algebra", role: "video", rank: 0 },
            { key: "khan-academy-linear-algebra", role: "practice" },
            { key: "mathematics-for-machine-learning", role: "learn" },
            { key: "maths-for-machine-learning", role: "video" },
          ],
          subtopics: [
            {
              slug: "vectors-dot-matmul",
              title: "Vectors, dot products, matrix multiplication",
              explanation:
                "A vector is a list of numbers with direction and magnitude; a dot product measures alignment; matmul composes linear transforms.",
              whyItMatters:
                "Similarity search, embeddings and attention are all dot products at heart.",
              prerequisites: ["Arrays, shapes and broadcasting"],
              learningOutcomes: [
                "Compute a dot product by hand and in NumPy",
                "Explain what matrix multiplication does geometrically",
              ],
              practicalTask: "Implement cosine similarity between two vectors.",
              doneWhen: ["You can explain a dot product to a friend"],
              estMinutes: 75,
            },
          ],
        },
        {
          slug: "calculus-gd",
          title: "Derivatives and gradient descent",
          summary: "Chain rule, gradients, and fitting by descent.",
          whyItMatters:
            "Gradient descent is how essentially every model learns.",
          lane: "build",
          resources: [
            { key: "essence-of-calculus", role: "video", rank: 0 },
            { key: "khan-academy-multivariable-derivatives", role: "practice" },
          ],
          subtopics: [
            {
              slug: "derivatives-chain",
              title: "Derivatives, the chain rule, gradients",
              explanation:
                "A derivative is a slope; the gradient points uphill in many dimensions; the chain rule composes derivatives through functions.",
              whyItMatters:
                "Backpropagation is just the chain rule applied to a network.",
              prerequisites: ["Vectors, dot products, matrix multiplication"],
              learningOutcomes: [
                "Explain gradient direction and magnitude",
                "Apply the chain rule to a composed function",
              ],
              practicalTask: "Derive the gradient of mean squared error for a line.",
              doneWhen: ["You can explain why the gradient points the way it does"],
              estMinutes: 60,
            },
            {
              slug: "gradient-descent",
              title: "Gradient descent, by hand and in code",
              explanation:
                "Iteratively step parameters against the gradient to minimise a loss, controlled by a learning rate.",
              whyItMatters:
                "Understanding descent from scratch demystifies all later training.",
              prerequisites: ["Derivatives, the chain rule, gradients"],
              learningOutcomes: [
                "Implement descent to fit a line",
                "Show the loss decreasing over steps",
              ],
              practicalTask:
                "Fit a line to noisy data with NumPy gradient descent and plot the loss.",
              doneWhen: ["The loss curve trends down and the fit is reasonable"],
              estMinutes: 90,
            },
          ],
        },
        {
          slug: "probability-stats",
          title: "Probability and statistics",
          summary: "Distributions, mean, variance, Bayes, sampling.",
          whyItMatters:
            "Metrics, evaluation and uncertainty all rest on statistics.",
          lane: "learn",
          resources: [
            { key: "statquest-statistics-fundamentals", role: "video", rank: 0 },
            { key: "khan-academy-statistics-and-probability", role: "practice" },
            { key: "seeing-theory", role: "practice" },
            { key: "think-stats-3rd-ed", role: "learn" },
            { key: "stats-for-data-science", role: "video" },
          ],
          subtopics: [
            {
              slug: "prob-bayes",
              title: "Probability, conditional probability, Bayes",
              explanation:
                "Reason about likelihoods, how evidence updates beliefs, and Bayes' rule.",
              whyItMatters:
                "Classification thresholds and evaluation depend on probabilistic thinking.",
              prerequisites: [],
              learningOutcomes: ["Apply Bayes' rule to a simple example"],
              practicalTask: "Compute a posterior for a spam-filter style example.",
              doneWhen: ["Your Bayes calculation is correct"],
              estMinutes: 60,
            },
            {
              slug: "distributions",
              title: "Distributions, mean, variance, sampling",
              explanation:
                "Understand common distributions and summary statistics, and why sampling introduces variance.",
              whyItMatters:
                "Reading distributions is how you spot outliers and data issues.",
              prerequisites: ["Probability, conditional probability, Bayes"],
              learningOutcomes: [
                "Interpret mean, variance and std",
                "Spot outliers on a distribution plot",
              ],
              practicalTask: "Plot a distribution and flag outliers with a rule.",
              doneWhen: ["You can read a distribution plot confidently"],
              estMinutes: 45,
            },
          ],
        },
      ],
    },
  ],
};
