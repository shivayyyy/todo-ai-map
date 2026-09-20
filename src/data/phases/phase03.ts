import type { PhaseSeed } from "../types";

export const phase03: PhaseSeed = {
  order: 3,
  slug: "classical-ml",
  title: "Classical machine learning",
  subtitle: "How models learn, overfit and get measured",
  description:
    "Before deep learning, learn how any model learns, overfits and gets measured. These three weeks give you the vocabulary every ML and AI interview assumes.",
  colorVar: 3,
  weekStart: 7,
  weekEnd: 9,
  doneWhen: [
    "You can pick a metric for a problem and defend it.",
    "You can show overfitting on a learning curve.",
    "One ML app of yours runs at a public URL.",
  ],
  antiPatternTitle: "The wrong metric",
  antiPatternBody:
    "Chasing 99% accuracy on imbalanced data. Accuracy lies there; read precision, recall and the confusion matrix instead.",
  weeks: [
    {
      weekNumber: 7,
      title: "How machines learn",
      summary: "Supervised learning, regression, classification, metrics.",
      shipTitle: "Price or marks predictor",
      shipDescription:
        "A price or marks predictor with a clean split and a metrics table.",
      topics: [
        {
          slug: "learning-setup",
          title: "The learning setup",
          summary: "Supervised vs unsupervised, splits, and leakage.",
          whyItMatters:
            "A wrong split or leaked feature invalidates every result that follows.",
          lane: "learn",
          resources: [
            { key: "google-machine-learning-crash-course", role: "learn", rank: 0 },
            { key: "kaggle-learn-intro-to-machine-learning", role: "practice" },
            { key: "statquest-machine-learning", role: "video" },
            { key: "machine-learning-specialization-andrew-ng", role: "course" },
            { key: "100-days-of-machine-learning", role: "video" },
          ],
          subtopics: [
            {
              slug: "supervised-unsupervised",
              title: "Supervised vs unsupervised learning",
              explanation:
                "Supervised learning maps inputs to known labels; unsupervised finds structure without labels.",
              whyItMatters:
                "Choosing the wrong framing wastes weeks; most job tasks are supervised.",
              prerequisites: ["Distributions, mean, variance, sampling"],
              learningOutcomes: ["Classify a problem as supervised or unsupervised"],
              practicalTask: "Frame your ship as a regression or classification task.",
              doneWhen: ["You can justify the framing"],
              estMinutes: 30,
            },
            {
              slug: "splits-leakage",
              title: "Train, validation and test splits, and leakage",
              explanation:
                "Split data so the model is evaluated on unseen rows, and prevent leakage where test information sneaks into training.",
              whyItMatters:
                "Leakage produces great offline numbers that collapse in production.",
              prerequisites: ["Supervised vs unsupervised learning"],
              learningOutcomes: [
                "Create a clean train/val/test split",
                "Spot a leakage source",
              ],
              practicalTask: "Split your dataset and note one leakage risk you avoided.",
              doneWhen: ["Splits are clean and leakage is addressed"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "models-metrics",
          title: "First models and metrics",
          summary: "Regression, logistic regression, and the right metrics.",
          whyItMatters:
            "Defending a metric choice is a standard interview question.",
          lane: "build",
          resources: [
            { key: "andrew-ng-ml-specialization-course-1", role: "video", rank: 0 },
            { key: "scikit-learn-user-guide", role: "learn" },
            { key: "mlu-explain", role: "learn" },
          ],
          subtopics: [
            {
              slug: "regression-logistic",
              title: "Linear and logistic regression",
              explanation:
                "Linear regression predicts a number; logistic regression predicts a probability for classification.",
              whyItMatters:
                "These are the baselines every serious project starts from.",
              prerequisites: ["Gradient descent, by hand and in code"],
              learningOutcomes: [
                "Fit both with scikit-learn",
                "Read the coefficients",
              ],
              practicalTask: "Fit a baseline model with scikit-learn fit/predict/score.",
              doneWhen: ["You have a working baseline with a score"],
              estMinutes: 75,
            },
            {
              slug: "metrics",
              title: "Accuracy, precision, recall, F1, ROC-AUC",
              explanation:
                "Different metrics answer different questions; on imbalanced data accuracy is misleading.",
              whyItMatters:
                "The wrong metric hides real failure; the right one guides the whole project.",
              prerequisites: ["Linear and logistic regression"],
              learningOutcomes: [
                "Read a confusion matrix",
                "Pick and defend a metric",
              ],
              practicalTask: "Report a metrics table, not just accuracy.",
              doneWhen: ["You can defend your metric choice"],
              estMinutes: 60,
            },
            {
              slug: "overfitting",
              title: "Loss functions and overfitting",
              explanation:
                "Loss measures error; overfitting is memorising training data and failing on new data, visible on a learning curve.",
              whyItMatters:
                "Recognising overfitting is a core skill you will use in every phase.",
              prerequisites: ["Accuracy, precision, recall, F1, ROC-AUC"],
              learningOutcomes: ["Show overfitting on a learning curve"],
              practicalTask: "Plot train vs validation error to reveal overfitting.",
              doneWhen: ["Your learning curve demonstrates the gap"],
              estMinutes: 45,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 8,
      title: "Trees, ensembles, clustering",
      summary: "Random forests, boosting, k-means, PCA, cross-validation.",
      shipTitle: "Explained Kaggle submission",
      shipDescription:
        "A Kaggle submission with a notebook that explains every step.",
      topics: [
        {
          slug: "trees-ensembles",
          title: "Trees and ensembles",
          summary: "Decision trees, random forests, gradient boosting.",
          whyItMatters:
            "Gradient boosting wins most tabular problems in industry.",
          lane: "build",
          resources: [
            { key: "kaggle-learn-intermediate-ml", role: "practice", rank: 0 },
            { key: "statquest-machine-learning", role: "video" },
            { key: "kaggle-titanic-competition", role: "practice" },
            { key: "kaggle-house-prices-competition", role: "practice" },
          ],
          subtopics: [
            {
              slug: "trees-forests",
              title: "Decision trees and random forests",
              explanation:
                "Trees split data on features; forests average many trees to reduce variance.",
              whyItMatters:
                "Strong, interpretable baselines that need little tuning.",
              prerequisites: ["Loss functions and overfitting"],
              learningOutcomes: ["Train a random forest and read feature importance"],
              practicalTask: "Beat your logistic baseline with a random forest.",
              doneWhen: ["Forest matches or beats the baseline"],
              estMinutes: 60,
            },
            {
              slug: "boosting",
              title: "Gradient boosting: XGBoost, LightGBM",
              explanation:
                "Boosting builds trees sequentially, each correcting the last, for state-of-the-art tabular accuracy.",
              whyItMatters:
                "This is the default winner for structured data competitions and jobs.",
              prerequisites: ["Decision trees and random forests"],
              learningOutcomes: ["Train a boosting model and tune key params"],
              practicalTask: "Submit a boosting model to a Kaggle competition.",
              doneWhen: ["You have a leaderboard submission"],
              estMinutes: 75,
            },
            {
              slug: "cross-validation",
              title: "Cross-validation and hyperparameter search",
              explanation:
                "Cross-validation estimates performance robustly; search tunes hyperparameters without overfitting the validation set.",
              whyItMatters:
                "Single splits are noisy; CV gives trustworthy comparisons.",
              prerequisites: ["Gradient boosting: XGBoost, LightGBM"],
              learningOutcomes: ["Run k-fold CV and a small search"],
              practicalTask: "Use CV to choose between two models.",
              doneWhen: ["Model choice is backed by CV scores"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "unsupervised",
          title: "Clustering and PCA",
          summary: "k-means, PCA and dimensionality reduction.",
          whyItMatters:
            "Unsupervised tools help you explore and compress data.",
          lane: "learn",
          resources: [
            { key: "kaggle-learn-feature-engineering", role: "practice", rank: 0 },
            { key: "statquest-machine-learning", role: "video" },
          ],
          subtopics: [
            {
              slug: "kmeans-pca",
              title: "k-means clustering and PCA",
              explanation:
                "k-means groups similar points; PCA reduces dimensions while keeping variance.",
              whyItMatters:
                "Useful for segmentation and for visualising high-dimensional data like embeddings.",
              prerequisites: ["Vectors, dot products, matrix multiplication"],
              learningOutcomes: ["Cluster data and reduce it to 2D with PCA"],
              practicalTask: "Cluster a dataset and visualise it in 2D via PCA.",
              doneWhen: ["Clusters are visible in the PCA plot"],
              estMinutes: 60,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 9,
      title: "An end-to-end ML project",
      summary: "Pipelines, imbalanced data, model choice, a live demo.",
      shipTitle: "Churn or fraud predictor with a demo",
      shipDescription: "A churn or fraud predictor with a public demo link.",
      topics: [
        {
          slug: "pipelines-imbalance",
          title: "Pipelines and imbalanced data",
          summary: "scikit-learn Pipeline, ColumnTransformer, imbalance.",
          whyItMatters:
            "Pipelines prevent leakage and make models reproducible and deployable.",
          lane: "build",
          resources: [
            { key: "kaggle-learn-intermediate-ml", role: "practice", rank: 0 },
            { key: "scikit-learn-mooc", role: "learn" },
            { key: "scikit-learn-user-guide", role: "learn" },
          ],
          subtopics: [
            {
              slug: "pipelines",
              title: "scikit-learn Pipeline and ColumnTransformer",
              explanation:
                "Bundle preprocessing and model into one Pipeline so the same steps apply at train and inference time.",
              whyItMatters:
                "Pipelines are the difference between a notebook and a deployable model.",
              prerequisites: ["Cross-validation and hyperparameter search"],
              learningOutcomes: [
                "Build a Pipeline with a ColumnTransformer",
                "Save and load the fitted pipeline with joblib",
              ],
              practicalTask: "Wrap preprocessing and model in one pipeline.",
              doneWhen: ["The pipeline serves predictions from raw input"],
              estMinutes: 75,
            },
            {
              slug: "imbalance",
              title: "Imbalanced classes and the right metric",
              explanation:
                "With rare positives, use class weights or resampling and evaluate with precision/recall, not accuracy.",
              whyItMatters:
                "Fraud and churn are imbalanced; naive accuracy is meaningless.",
              prerequisites: ["Accuracy, precision, recall, F1, ROC-AUC"],
              learningOutcomes: ["Handle imbalance and report the right metric"],
              practicalTask: "Report precision/recall for the rare class.",
              doneWhen: ["Rare-class performance is reported honestly"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "ship-demo",
          title: "Ship a live demo",
          summary: "Compare models, study errors, and deploy a front end.",
          whyItMatters:
            "A public demo turns a notebook into portfolio proof.",
          lane: "portfolio",
          resources: [
            { key: "gradio-quickstart", role: "learn", rank: 0 },
            { key: "streamlit-community", role: "practice" },
            { key: "build-a-basic-llm-chat-app", role: "learn" },
          ],
          subtopics: [
            {
              slug: "compare-errors",
              title: "Compare models, then study the errors",
              explanation:
                "Pick the best model on CV, then read the cases it gets wrong to find data or feature problems.",
              whyItMatters:
                "Error analysis, not more tuning, is what actually improves models.",
              prerequisites: ["Imbalanced classes and the right metric"],
              learningOutcomes: ["Produce an error analysis of misclassifications"],
              practicalTask: "List the top failure modes of your model.",
              doneWhen: ["You can name why your model fails"],
              estMinutes: 45,
            },
            {
              slug: "demo-frontend",
              title: "A small Streamlit or Gradio front end",
              explanation:
                "Wrap your model in a simple web UI and deploy it so anyone can try it.",
              whyItMatters:
                "The done-when for this phase is a public URL.",
              prerequisites: ["scikit-learn Pipeline and ColumnTransformer"],
              learningOutcomes: ["Deploy a model behind a public demo"],
              practicalTask: "Publish a Gradio or Streamlit demo of your predictor.",
              doneWhen: ["A stranger can use your model at a URL"],
              estMinutes: 75,
            },
          ],
        },
      ],
    },
  ],
};
