import type { PhaseSeed } from "../types";

export const phase01: PhaseSeed = {
  order: 1,
  slug: "programming-foundations",
  title: "Programming foundations",
  subtitle: "Python, Git, SQL and APIs",
  description:
    "Every AI system you will build is software first. Four weeks of Python, Git, SQL and APIs is the floor everything else stands on. Skip it and every later phase gets harder.",
  colorVar: 1,
  weekStart: 1,
  weekEnd: 4,
  doneWhen: [
    "You can write a 150-line Python program without copying a tutorial.",
    "You branch, commit and open pull requests without thinking.",
    "You can write a JOIN and a GROUP BY from memory.",
    "Your FastAPI app runs locally and its /docs page works.",
  ],
  antiPatternTitle: "Tutorial hell",
  antiPatternBody:
    "Finishing a 12-hour video and building nothing. Cap tutorials at half your week; the other half is your own code, with the video closed.",
  weeks: [
    {
      weekNumber: 1,
      title: "Python basics",
      summary: "Variables, strings, lists, dicts, loops and functions.",
      shipTitle: "Command-line quiz or unit converter",
      shipDescription:
        "A command-line quiz or unit converter, pushed to GitHub with a README.",
      topics: [
        {
          slug: "setup",
          title: "Set up your environment",
          summary: "Install Python and an editor, or open Colab.",
          whyItMatters:
            "A working, repeatable environment removes the friction that makes beginners quit in week one.",
          lane: "build",
          resources: [
            { key: "vs-code-the-python-extension", role: "learn", rank: 0 },
            { key: "download-python", role: "practice" },
            { key: "google-colab", role: "practice" },
            { key: "uv-python-and-packages", role: "learn" },
          ],
          subtopics: [
            {
              slug: "install-python-editor",
              title: "Install Python and VS Code (or open Colab)",
              explanation:
                "Install a current Python from python.org and VS Code with the Python extension, or open Google Colab if you cannot install locally. Confirm `python --version` runs in a terminal.",
              whyItMatters:
                "You cannot practise what you cannot run. A clean install avoids version and PATH problems later.",
              prerequisites: [],
              learningOutcomes: [
                "Run Python from a terminal and from an editor",
                "Open and run a notebook in Colab as a fallback",
              ],
              practicalTask:
                "Print 'hello, <your name>' from a .py file and from a Colab cell.",
              doneWhen: [
                "`python --version` prints a 3.x version",
                "You can run a script in VS Code and a cell in Colab",
              ],
              estMinutes: 45,
              resources: [
                { key: "vs-code-the-python-extension", role: "learn", rank: 0 },
                { key: "google-colab", role: "practice" },
              ],
            },
            {
              slug: "variables-io",
              title: "Variables, numbers, strings, input and output",
              explanation:
                "Store values in variables, do arithmetic, build strings with f-strings, and read/print from the console. These are the atoms of every program.",
              whyItMatters:
                "Every feature you will ever write moves and reshapes values like these.",
              prerequisites: ["Set up your environment"],
              learningOutcomes: [
                "Use int, float and str and convert between them",
                "Format output with f-strings",
                "Read input() and validate it",
              ],
              practicalTask:
                "Write a tip calculator that reads a bill and tip percent and prints the total.",
              doneWhen: [
                "Your program handles a non-numeric input without crashing",
              ],
              estMinutes: 60,
            },
            {
              slug: "control-flow",
              title: "if / else, for and while loops",
              explanation:
                "Branch with if/elif/else and repeat with for and while. Learn break, continue and how to avoid infinite loops.",
              whyItMatters:
                "Control flow is how programs make decisions and process many items.",
              prerequisites: ["Variables, numbers, strings, input and output"],
              learningOutcomes: [
                "Choose between for and while correctly",
                "Iterate over a range and over a collection",
              ],
              practicalTask:
                "Print the FizzBuzz sequence from 1 to 100.",
              doneWhen: ["FizzBuzz output is correct for the edge cases 15, 30, 45"],
              estMinutes: 60,
            },
            {
              slug: "collections",
              title: "Lists, tuples, dictionaries and sets",
              explanation:
                "Store many values with lists (ordered, mutable), tuples (fixed), dicts (key-value) and sets (unique). Know when to reach for each.",
              whyItMatters:
                "Dicts and lists are the workhorses of data handling, config and JSON.",
              prerequisites: ["if / else, for and while loops"],
              learningOutcomes: [
                "Add, remove and look up items in each collection",
                "Pick the right structure for a task",
              ],
              practicalTask:
                "Count word frequencies in a paragraph using a dict.",
              doneWhen: ["Your counter returns the correct top-3 words"],
              estMinutes: 75,
            },
            {
              slug: "functions",
              title: "Functions, arguments and return values",
              explanation:
                "Package reusable logic in functions with parameters, defaults and return values. Understand scope and why global state is risky.",
              whyItMatters:
                "Functions are how you keep code readable and testable as it grows.",
              prerequisites: ["Lists, tuples, dictionaries and sets"],
              learningOutcomes: [
                "Write functions with positional and keyword arguments",
                "Return values instead of printing inside functions",
              ],
              practicalTask:
                "Refactor your tip calculator so the math lives in a pure function.",
              doneWhen: ["The function returns a value and has no input()/print()"],
              estMinutes: 60,
            },
            {
              slug: "read-errors",
              title: "Read error messages instead of fearing them",
              explanation:
                "Python tracebacks point at the file, line and error type. Read them bottom-up and fix the root cause instead of guessing.",
              whyItMatters:
                "Debugging speed is the single biggest difference between slow and fast beginners.",
              prerequisites: ["Functions, arguments and return values"],
              learningOutcomes: [
                "Identify the failing line from a traceback",
                "Recognise common errors: NameError, TypeError, IndexError, KeyError",
              ],
              practicalTask:
                "Deliberately trigger three different errors and explain each in a comment.",
              doneWhen: ["You can state what each error meant and how you fixed it"],
              estMinutes: 45,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 2,
      title: "Python for real work",
      summary: "Files, errors, modules, classes, type hints, virtual envs.",
      shipTitle: "Expense tracker CLI",
      shipDescription: "An expense tracker CLI that saves to JSON, with tests.",
      topics: [
        {
          slug: "files-and-data",
          title: "Files, JSON and CSV",
          summary: "Read and write files and structured data formats.",
          whyItMatters:
            "Almost every program loads input and saves output. JSON and CSV are everywhere in AI work.",
          lane: "learn",
          resources: [
            { key: "the-python-tutorial", role: "learn", rank: 0 },
            { key: "automate-the-boring-stu-with-python-3rd-ed", role: "learn" },
          ],
          subtopics: [
            {
              slug: "read-write-files",
              title: "Reading and writing files safely",
              explanation:
                "Use `with open(...)` context managers to read and write text files so handles always close, even on error.",
              whyItMatters:
                "Leaked file handles and half-written files cause data loss and flaky bugs.",
              prerequisites: ["Functions, arguments and return values"],
              learningOutcomes: [
                "Read a file line by line",
                "Write output atomically with a context manager",
              ],
              practicalTask: "Append a timestamped line to a log file on each run.",
              doneWhen: ["The file is never left open and content persists across runs"],
              estMinutes: 45,
            },
            {
              slug: "json-csv",
              title: "JSON and CSV",
              explanation:
                "Serialize Python objects to JSON with the json module and read tabular data with the csv module. Understand the mapping between dicts/lists and JSON.",
              whyItMatters:
                "JSON is how APIs and configs talk; CSV is how datasets arrive.",
              prerequisites: ["Reading and writing files safely"],
              learningOutcomes: [
                "Round-trip a dict to a JSON file and back",
                "Read a CSV into a list of dicts",
              ],
              practicalTask:
                "Save your expense records to a JSON file and reload them on startup.",
              doneWhen: ["Data survives a restart of your CLI"],
              estMinutes: 60,
            },
          ],
        },
        {
          slug: "errors-and-structure",
          title: "Errors, modules and OOP",
          summary: "Exceptions, packages, classes and dataclasses.",
          whyItMatters:
            "Structure and error handling turn scripts into maintainable programs.",
          lane: "learn",
          resources: [
            { key: "python-oop-tutorials", role: "video", rank: 0 },
            { key: "the-python-tutorial", role: "learn" },
          ],
          subtopics: [
            {
              slug: "exceptions",
              title: "try / except and your own error types",
              explanation:
                "Catch specific exceptions, raise meaningful errors, and define custom exception classes for your domain.",
              whyItMatters:
                "Good error handling makes failures explainable instead of mysterious.",
              prerequisites: ["Read error messages instead of fearing them"],
              learningOutcomes: [
                "Catch narrow exception types, not bare except",
                "Raise a custom exception with a helpful message",
              ],
              practicalTask:
                "Reject a negative expense with a custom InvalidAmountError.",
              doneWhen: ["Invalid input raises your error and is handled at the top level"],
              estMinutes: 45,
            },
            {
              slug: "modules-envs",
              title: "Modules, packages, pip and uv environments",
              explanation:
                "Split code into modules, import across files, and isolate dependencies in a virtual environment managed by uv.",
              whyItMatters:
                "Per-project environments prevent 'works on my machine' dependency chaos.",
              prerequisites: ["Set up your environment"],
              learningOutcomes: [
                "Create a uv project and add a dependency",
                "Import your own modules across files",
              ],
              practicalTask: "Split your CLI into main.py plus a storage module.",
              doneWhen: ["`uv run` executes the app inside its own environment"],
              estMinutes: 60,
              resources: [
                { key: "uv-python-and-packages", role: "learn", rank: 0 },
                { key: "uv-the-all-in-one-package-manager", role: "video" },
                { key: "uv-the-modern-way-to-manage-python", role: "video" },
              ],
            },
            {
              slug: "classes-dataclasses",
              title: "Classes, objects and dataclasses",
              explanation:
                "Model things with classes and use @dataclass to remove boilerplate for data-holding objects.",
              whyItMatters:
                "Clean data models make larger programs and later ML/LLM code easier to reason about.",
              prerequisites: ["Functions, arguments and return values"],
              learningOutcomes: [
                "Define a dataclass with typed fields",
                "Add methods that operate on instance state",
              ],
              practicalTask: "Model an Expense as a dataclass with amount, category, date.",
              doneWhen: ["Expenses are dataclass instances, not raw dicts"],
              estMinutes: 60,
            },
            {
              slug: "comprehensions-types",
              title: "Comprehensions, f-strings and type hints",
              explanation:
                "Write list/dict comprehensions for concise transforms and annotate functions with type hints for clarity and tooling.",
              whyItMatters:
                "Type hints power editor autocomplete and catch bugs before you run code; they are essential for Pydantic and FastAPI later.",
              prerequisites: ["Classes, objects and dataclasses"],
              learningOutcomes: [
                "Rewrite a loop as a comprehension",
                "Annotate parameters and return types",
              ],
              practicalTask: "Add type hints to every function in your CLI.",
              doneWhen: ["All public functions are annotated"],
              estMinutes: 45,
              resources: [{ key: "python-types-intro", role: "learn", rank: 0 }],
            },
            {
              slug: "pytest",
              title: "Small tests with pytest",
              explanation:
                "Write functions that assert expected behaviour and run them with pytest. Start with the pure functions you already wrote.",
              whyItMatters:
                "Tests let you change code without fear and are expected in every ship from here on.",
              prerequisites: ["Comprehensions, f-strings and type hints"],
              learningOutcomes: [
                "Write a test file pytest discovers",
                "Assert on return values and raised exceptions",
              ],
              practicalTask: "Write 3 tests for your expense math and validation.",
              doneWhen: ["`pytest` passes and covers the happy path plus one error"],
              estMinutes: 60,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 3,
      title: "Git, terminal and SQL",
      summary: "Shell basics, branches and pull requests, SQL joins.",
      shipTitle: "SQL analysis via a pull request",
      shipDescription:
        "A SQL analysis of a real dataset, merged through a pull request.",
      topics: [
        {
          slug: "terminal",
          title: "The terminal and shell",
          summary: "Navigate, search, pipe, and set environment variables.",
          whyItMatters:
            "Every server, container and CI system is driven from a shell. Fluency here saves hours.",
          lane: "learn",
          resources: [
            { key: "the-missing-semester-of-your-cs-education", role: "learn", rank: 0 },
            { key: "command-line-basics", role: "video" },
            { key: "the-linux-command-line", role: "learn" },
            { key: "linux-for-beginners-100-commands", role: "video" },
          ],
          subtopics: [
            {
              slug: "navigate-shell",
              title: "Navigate, pipes and environment variables",
              explanation:
                "Move around with cd/ls/pwd, chain commands with pipes, search with grep, and set environment variables for configuration and secrets.",
              whyItMatters:
                "Reading logs, moving files and configuring apps all happen here.",
              prerequisites: [],
              learningOutcomes: [
                "Find files and text with find and grep",
                "Set and read an environment variable",
              ],
              practicalTask:
                "Use grep to count how many lines in a log contain 'ERROR'.",
              doneWhen: ["You can navigate and search without a file explorer"],
              estMinutes: 60,
            },
          ],
        },
        {
          slug: "git",
          title: "Git and GitHub",
          summary: "Commit, branch, merge, resolve conflicts, open PRs.",
          whyItMatters:
            "Git history is your resume in this plan, and every team assumes you know it.",
          lane: "build",
          resources: [
            { key: "learn-git-branching", role: "practice", rank: 0 },
            { key: "pro-git", role: "learn" },
            { key: "github-skills-introduction-to-github", role: "practice" },
            { key: "git-and-github-crash-course-2026", role: "video" },
            { key: "git-and-github-complete-course", role: "video" },
          ],
          subtopics: [
            {
              slug: "commit-branch-merge",
              title: "Commit, branch, merge, fix conflicts",
              explanation:
                "Stage and commit snapshots, work on branches, merge them, and resolve conflicts when two changes touch the same lines.",
              whyItMatters:
                "Branching lets you experiment safely; conflict resolution is unavoidable on teams.",
              prerequisites: ["Navigate, pipes and environment variables"],
              learningOutcomes: [
                "Create a branch, commit, and merge it",
                "Resolve a merge conflict by hand",
              ],
              practicalTask:
                "Create a conflict on purpose in a test repo and resolve it.",
              doneWhen: ["You resolved a conflict and the history is clean"],
              estMinutes: 75,
            },
            {
              slug: "pull-requests",
              title: "GitHub: pull requests, issues, .gitignore",
              explanation:
                "Push a branch, open a pull request, describe the change, and keep secrets and junk out with .gitignore.",
              whyItMatters:
                "Pull requests are how professional code review and shipping happen.",
              prerequisites: ["Commit, branch, merge, fix conflicts"],
              learningOutcomes: [
                "Open a PR with a clear description",
                "Add a .gitignore that excludes venvs and secrets",
              ],
              practicalTask: "Merge this week's ship through a pull request.",
              doneWhen: ["Your analysis is merged via a PR, not a direct push"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "sql",
          title: "SQL",
          summary: "SELECT, WHERE, GROUP BY, JOIN, and SQL from Python.",
          whyItMatters:
            "Data lives in databases. SQL is the most durable data skill you will learn.",
          lane: "learn",
          resources: [
            { key: "sqlbolt", role: "practice", rank: 0 },
            { key: "cs50-s-introduction-to-databases-with-sql", role: "learn" },
            { key: "kaggle-learn-intro-to-sql", role: "practice" },
            { key: "sqlite3-module-with-tutorial", role: "learn" },
            { key: "sql-course-for-beginners-mysql", role: "video" },
            { key: "sql-one-shot-mysql", role: "video" },
          ],
          subtopics: [
            {
              slug: "select-where-group",
              title: "SELECT, WHERE, GROUP BY",
              explanation:
                "Query rows, filter with WHERE, and aggregate with GROUP BY plus COUNT/SUM/AVG.",
              whyItMatters:
                "Most real questions are 'how many / how much per group', which is GROUP BY.",
              prerequisites: [],
              learningOutcomes: [
                "Filter and sort rows",
                "Aggregate per group with a HAVING filter",
              ],
              practicalTask: "Compute counts per category on a real dataset.",
              doneWhen: ["You can write a GROUP BY from memory"],
              estMinutes: 75,
            },
            {
              slug: "joins",
              title: "JOINs",
              explanation:
                "Combine rows across tables with INNER and LEFT JOIN on matching keys.",
              whyItMatters:
                "Real schemas are split across tables; joins reassemble them.",
              prerequisites: ["SELECT, WHERE, GROUP BY"],
              learningOutcomes: [
                "Write an INNER JOIN and a LEFT JOIN",
                "Explain the difference with an example",
              ],
              practicalTask: "Join two tables and aggregate the result.",
              doneWhen: ["You can write a JOIN from memory"],
              estMinutes: 60,
            },
            {
              slug: "sql-from-python",
              title: "SQLite from Python, Postgres basics",
              explanation:
                "Run SQL from Python with the sqlite3 module and understand how the same SQL scales to Postgres.",
              whyItMatters:
                "Apps query databases from code, not just a SQL console.",
              prerequisites: ["JOINs"],
              learningOutcomes: [
                "Execute a parameterized query from Python",
                "Avoid SQL injection with placeholders",
              ],
              practicalTask: "Load a CSV into SQLite and query it from Python.",
              doneWhen: ["Queries use parameters, never string formatting"],
              estMinutes: 60,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 4,
      title: "APIs and a tiny backend",
      summary: "HTTP, JSON, requests / httpx, async, FastAPI.",
      shipTitle: "FastAPI service wrapping a public API",
      shipDescription:
        "A FastAPI service that wraps a public API, with two endpoints and tests.",
      topics: [
        {
          slug: "http",
          title: "HTTP and calling APIs",
          summary: "Methods, status codes, headers, and HTTP clients.",
          whyItMatters:
            "AI engineering is mostly calling APIs. You must understand the protocol underneath.",
          lane: "learn",
          resources: [
            { key: "an-overview-of-http", role: "learn", rank: 0 },
            { key: "requests-quickstart", role: "learn" },
            { key: "httpx-sync-async-client", role: "learn" },
            { key: "http-crash-course", role: "video" },
            { key: "public-apis-free-apis-to-practise-on", role: "practice" },
          ],
          subtopics: [
            {
              slug: "http-methods-status",
              title: "HTTP methods, status codes and headers",
              explanation:
                "GET reads, POST creates; 2xx is success, 4xx is your fault, 5xx is the server's. Headers carry auth and content type.",
              whyItMatters:
                "You will read status codes and headers every day when debugging API calls.",
              prerequisites: [],
              learningOutcomes: [
                "Explain 200, 201, 401, 404, 429, 500",
                "Send a header and read the response status",
              ],
              practicalTask: "Call a public API and print its status and JSON body.",
              doneWhen: ["You can explain what each status code means"],
              estMinutes: 45,
            },
            {
              slug: "clients-keys",
              title: "Call REST APIs and keep keys in .env",
              explanation:
                "Use requests or httpx to call APIs and load secrets from a .env file so keys never enter source control.",
              whyItMatters:
                "Leaked API keys are one of the most common and costly beginner mistakes.",
              prerequisites: ["HTTP methods, status codes and headers"],
              learningOutcomes: [
                "Make GET/POST calls with httpx",
                "Read a key from an environment variable",
              ],
              practicalTask: "Read an API key from .env and use it in a request.",
              doneWhen: [".env is gitignored and no key is in the code"],
              estMinutes: 45,
            },
            {
              slug: "async-basics",
              title: "async / await basics",
              explanation:
                "Concurrency lets your service handle many requests while waiting on I/O. Learn async/await and when it helps.",
              whyItMatters:
                "Streaming LLM responses and calling multiple APIs benefit hugely from async.",
              prerequisites: ["Call REST APIs and keep keys in .env"],
              learningOutcomes: [
                "Write an async function and await it",
                "Explain when async helps vs hurts",
              ],
              practicalTask: "Fetch three URLs concurrently and compare timing to serial.",
              doneWhen: ["Concurrent version is measurably faster"],
              estMinutes: 60,
              resources: [
                { key: "asyncio-the-complete-guide", role: "video", rank: 0 },
                { key: "concurrency-and-async-await", role: "learn" },
              ],
            },
          ],
        },
        {
          slug: "fastapi",
          title: "FastAPI",
          summary: "Routes, Pydantic models, and the auto /docs page.",
          whyItMatters:
            "FastAPI is how you will serve models and tools for the rest of this plan.",
          lane: "build",
          resources: [
            { key: "fastapi-tutorial-user-guide", role: "learn", rank: 0 },
            { key: "fastapi-tutorials", role: "video" },
            { key: "fastapi-for-machine-learning", role: "video" },
          ],
          subtopics: [
            {
              slug: "routes-pydantic",
              title: "FastAPI routes, Pydantic models, /docs",
              explanation:
                "Define endpoints as functions, validate request/response bodies with Pydantic models, and use the auto-generated /docs to test them.",
              whyItMatters:
                "Typed request/response models are the same idea you will use for structured LLM output.",
              prerequisites: ["Comprehensions, f-strings and type hints", "async / await basics"],
              learningOutcomes: [
                "Create GET and POST endpoints",
                "Validate input with a Pydantic model",
                "Use /docs to exercise the API",
              ],
              practicalTask:
                "Wrap a public API behind two FastAPI endpoints with a Pydantic response.",
              doneWhen: [
                "The app runs locally and /docs works",
                "Invalid input returns a clear 422",
              ],
              estMinutes: 90,
            },
          ],
        },
      ],
    },
  ],
};
