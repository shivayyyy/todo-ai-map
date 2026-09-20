import type { PhaseSeed } from "../types";

export const phase07: PhaseSeed = {
  order: 7,
  slug: "rag",
  title: "Retrieval-augmented generation",
  subtitle: "Ground answers in your own documents",
  description:
    "Models do not know your documents. RAG finds the right passages and hands them to the model, so answers are grounded, current and citable.",
  colorVar: 7,
  weekStart: 17,
  weekEnd: 18,
  doneWhen: [
    "You can tell if a wrong answer came from retrieval or generation.",
    'Your app cites sources and says "I don\'t know" when it should.',
    "You have a 30-question eval set with scores.",
  ],
  antiPatternTitle: "Blaming the model",
  antiPatternBody:
    "Most bad RAG answers are search failures. Look at what was retrieved before you touch the prompt.",
  weeks: [
    {
      weekNumber: 17,
      title: "Embeddings and vector search",
      summary: "Embeddings, chunking, vector DBs, a first RAG app.",
      shipTitle: "Chat with your notes (with citations)",
      shipDescription:
        'A "chat with your notes" app that answers with citations.',
      topics: [
        {
          slug: "embeddings-search",
          title: "Embeddings and similarity",
          summary: "What embeddings capture, cosine similarity, chunking.",
          whyItMatters:
            "Retrieval quality is set here; everything downstream depends on it.",
          lane: "learn",
          resources: [
            { key: "rag-from-scratch", role: "video", rank: 0 },
            { key: "sentence-transformers", role: "learn" },
            { key: "chunking-strategies-for-llm-apps", role: "learn" },
            { key: "mteb-embedding-leaderboard", role: "practice" },
            { key: "rag", role: "video" },
          ],
          subtopics: [
            {
              slug: "what-embeddings-capture",
              title: "What embeddings capture and cosine similarity",
              explanation:
                "Embeddings place semantically similar text near each other; cosine similarity measures that closeness.",
              whyItMatters:
                "Retrieval is nearest-neighbour search in embedding space.",
              prerequisites: ["Embeddings: things as vectors"],
              learningOutcomes: ["Embed text and rank by cosine similarity"],
              practicalTask: "Embed 10 sentences and find the closest pair.",
              doneWhen: ["Closest pair is semantically related"],
              estMinutes: 60,
            },
            {
              slug: "chunking",
              title: "Chunking: size, overlap, structure",
              explanation:
                "Split documents into passages sized for retrieval, with overlap and respect for structure like headings.",
              whyItMatters:
                "Bad chunking is the most common cause of poor retrieval.",
              prerequisites: ["What embeddings capture and cosine similarity"],
              learningOutcomes: ["Choose chunk size and overlap for a corpus"],
              practicalTask: "Chunk your notes and inspect a few chunks for coherence.",
              doneWhen: ["Chunks are self-contained and sensibly sized"],
              estMinutes: 45,
            },
          ],
        },
        {
          slug: "first-rag",
          title: "Build a first RAG app",
          summary: "Vector stores, retrieve-augment-generate, citations.",
          whyItMatters:
            "This is the canonical AI-engineering application pattern.",
          lane: "build",
          resources: [
            { key: "langchain-semantic-search-tutorial", role: "learn", rank: 0 },
            { key: "chroma-getting-started", role: "learn" },
            { key: "learn-rag-from-scratch", role: "video" },
            { key: "pgvector", role: "practice" },
          ],
          subtopics: [
            {
              slug: "vector-stores",
              title: "Vector stores: Chroma, pgvector, Qdrant",
              explanation:
                "Store embeddings in a vector database that supports fast nearest-neighbour queries with metadata filters.",
              whyItMatters:
                "The vector store is the retrieval engine of your app.",
              prerequisites: ["Chunking: size, overlap, structure"],
              learningOutcomes: ["Index chunks and query top-k"],
              practicalTask: "Index your notes in Chroma and retrieve top-k.",
              doneWhen: ["Relevant chunks come back for a query"],
              estMinutes: 60,
            },
            {
              slug: "retrieve-cite",
              title: "Retrieve, augment, generate and cite sources",
              explanation:
                "Retrieve passages, put them in the prompt, generate an answer, and cite which passages supported it.",
              whyItMatters:
                "Citations and honest 'I don't know' are what make RAG trustworthy.",
              prerequisites: ["Vector stores: Chroma, pgvector, Qdrant"],
              learningOutcomes: [
                "Cite a source in every answer",
                "Return 'I don't know' when retrieval is weak",
              ],
              practicalTask: "Build a chat-with-your-notes app that cites sources.",
              doneWhen: ["Every answer cites its passages"],
              estMinutes: 90,
            },
          ],
        },
      ],
    },
    {
      weekNumber: 18,
      title: "Better retrieval and RAG evals",
      summary: "Hybrid search, reranking, query rewriting, evaluation.",
      shipTitle: "Hybrid search + reranking with before/after",
      shipDescription:
        "Hybrid search and reranking added, with before / after scores on 30 questions.",
      topics: [
        {
          slug: "better-retrieval",
          title: "Better retrieval",
          summary: "Hybrid search, reranking, query rewriting, filters.",
          whyItMatters:
            "These techniques fix the majority of real retrieval failures.",
          lane: "build",
          resources: [
            { key: "hybrid-search-explained", role: "learn", rank: 0 },
            { key: "rerankers-and-two-stage-retrieval", role: "learn" },
            { key: "introducing-contextual-retrieval", role: "learn" },
            { key: "rag-techniques", role: "practice" },
            { key: "lost-in-the-middle", role: "learn" },
          ],
          subtopics: [
            {
              slug: "hybrid-search",
              title: "Hybrid search: BM25 plus vectors",
              explanation:
                "Combine keyword (BM25) and vector search so both exact terms and meaning are matched, then fuse the results.",
              whyItMatters:
                "Pure vector search misses exact terms like IDs and names.",
              prerequisites: ["Retrieve, augment, generate and cite sources"],
              learningOutcomes: ["Fuse keyword and vector results"],
              practicalTask: "Add BM25 to your retriever and fuse with vectors.",
              doneWhen: ["Exact-term queries improve"],
              estMinutes: 60,
            },
            {
              slug: "reranking-rewriting",
              title: "Rerankers, top-k tuning and query rewriting",
              explanation:
                "A reranker reorders candidates for relevance; query rewriting reshapes the question to retrieve better passages.",
              whyItMatters:
                "A second ranking pass and better queries sharply raise answer quality.",
              prerequisites: ["Hybrid search: BM25 plus vectors"],
              learningOutcomes: ["Add a reranking stage", "Rewrite a query for retrieval"],
              practicalTask: "Add reranking and tune top-k.",
              doneWhen: ["Top results are more relevant after reranking"],
              estMinutes: 60,
            },
          ],
        },
        {
          slug: "rag-evals",
          title: "RAG evaluation",
          summary: "Retrieval hit-rate, faithfulness, before/after scores.",
          whyItMatters:
            "You cannot improve retrieval you cannot measure.",
          lane: "practice",
          resources: [
            { key: "evaluate-a-simple-rag-system", role: "learn", rank: 0 },
            { key: "ragas", role: "learn" },
            { key: "advanced-rag-cookbook", role: "learn" },
          ],
          subtopics: [
            {
              slug: "retrieval-answer-evals",
              title: "Retrieval hit-rate and faithfulness scores",
              explanation:
                "Measure whether the right passages were retrieved and whether the answer is faithful to them, on a fixed question set.",
              whyItMatters:
                "Separating retrieval from generation failures is the core RAG debugging skill.",
              prerequisites: ["Rerankers, top-k tuning and query rewriting"],
              learningOutcomes: [
                "Build a 30-question eval set",
                "Report retrieval and faithfulness scores",
              ],
              practicalTask: "Score before/after on 30 questions.",
              doneWhen: [
                "You can attribute a wrong answer to retrieval or generation",
                "Before/after scores are documented",
              ],
              estMinutes: 90,
            },
          ],
        },
      ],
    },
  ],
};
