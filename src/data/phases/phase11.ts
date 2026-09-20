import type { PhaseSeed } from "../types";

export const phase11: PhaseSeed = {
  order: 11,
  slug: "get-hired",
  title: "Get hired",
  subtitle: "Turn 24 weeks of commits into offers",
  description:
    "Turn 24 weeks of commits into proof. Finish the capstone, show your work in public, prepare for the interview loop, and apply every single week.",
  colorVar: 11,
  weekStart: 24,
  weekEnd: 24,
  doneWhen: [
    "Six pinned repos, each with a README, demo and eval.",
    "A one-page resume where every line has a number.",
    "Three mock interviews done.",
  ],
  antiPatternTitle: "Applying invisibly",
  antiPatternBody:
    "Sending applications with no public proof. Ship the capstone and post what you built; your future team is watching.",
  weeks: [
    {
      weekNumber: 24,
      title: "Portfolio and job hunt",
      summary: "Capstone, README, demo video, resume, applications.",
      shipTitle: "Capstone live + 3 posts + 30 applications",
      shipDescription:
        "Capstone live, 3 posts published, 30 applications sent.",
      topics: [
        {
          slug: "portfolio",
          title: "Show your work",
          summary: "Capstone, READMEs, demo video, public posts.",
          whyItMatters:
            "Projects prove you can build; certificates only prove you watched.",
          lane: "portfolio",
          resources: [
            { key: "your-github-pro-le-readme", role: "learn", rank: 0 },
            { key: "ai-engineer-roadmap", role: "learn" },
            { key: "a-field-guide-to-improving-ai-products", role: "learn" },
            { key: "obs-studio", role: "practice" },
          ],
          subtopics: [
            {
              slug: "capstone",
              title: "Finish one capstone that solves a real problem",
              explanation:
                "Build one end-to-end AI product with real users, a demo video and usage numbers.",
              whyItMatters:
                "A used product beats ten unfinished demos.",
              prerequisites: ["Docker images, containers and deploy"],
              learningOutcomes: ["Ship a capstone with real users"],
              practicalTask: "Launch your capstone and get at least a few real users.",
              doneWhen: ["The capstone is live and used by real people"],
              estMinutes: 240,
            },
            {
              slug: "readme-demo",
              title: "README, architecture, evals, demo GIF",
              explanation:
                "Give each project a README covering the problem, architecture, eval results and a live link or GIF.",
              whyItMatters:
                "Hiring managers judge projects by their README first.",
              prerequisites: ["Finish one capstone that solves a real problem"],
              learningOutcomes: ["Write a hiring-ready README"],
              practicalTask: "Add strong READMEs to your six best projects.",
              doneWhen: ["Six pinned repos have README, demo and eval"],
              estMinutes: 120,
            },
            {
              slug: "posts",
              title: "Post what you built on LinkedIn and X",
              explanation:
                "Publish short posts explaining what you built and what broke, to build a public track record.",
              whyItMatters:
                "Building in public creates opportunities and referrals.",
              prerequisites: ["README, architecture, evals, demo GIF"],
              learningOutcomes: ["Write a clear project post"],
              practicalTask: "Publish 3 posts about your work.",
              doneWhen: ["3 posts are live"],
              estMinutes: 60,
            },
          ],
        },
        {
          slug: "interview-apply",
          title: "Prepare and apply",
          summary: "Resume, interview prep, mock interviews, applications.",
          whyItMatters:
            "Consistent applications and practice convert skills into offers.",
          lane: "portfolio",
          resources: [
            { key: "machine-learning-interviews-book", role: "learn", rank: 0 },
            { key: "writing-a-resume-that-gets-interviews", role: "learn" },
            { key: "ai-engineering-free-companion-repo", role: "learn" },
            { key: "wellfound-ml-jobs-in-india", role: "practice" },
            { key: "internshala-ml-internships", role: "practice" },
            { key: "ml-interview-questions", role: "video" },
          ],
          subtopics: [
            {
              slug: "resume",
              title: "Resume: projects first, numbers in every line",
              explanation:
                "Write a one-page, ATS-friendly resume that leads with projects and quantifies impact.",
              whyItMatters:
                "A resume with numbers gets interviews; vague ones get filtered.",
              prerequisites: ["README, architecture, evals, demo GIF"],
              learningOutcomes: ["Write impact bullets with numbers"],
              practicalTask: "Write a one-page resume where every line has a number.",
              doneWhen: ["Every bullet quantifies an outcome"],
              estMinutes: 90,
            },
            {
              slug: "mock-apply",
              title: "Mock interviews, then apply every week",
              explanation:
                "Do mock interviews (including a system design) and send applications every week.",
              whyItMatters:
                "Interviewing is a skill; practice and volume both matter.",
              prerequisites: ["Resume: projects first, numbers in every line"],
              learningOutcomes: ["Complete mock interviews", "Track applications"],
              practicalTask: "Do 3 mock interviews and send 30 applications.",
              doneWhen: [
                "Three mock interviews done",
                "30 applications sent",
              ],
              estMinutes: 180,
            },
          ],
        },
      ],
    },
  ],
};
