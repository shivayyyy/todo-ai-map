export type Quote = {
  text: string;
  author?: string;
};

/**
 * A small pool of motivational lines shown at the end of the plan timeline.
 * Kept short so they fit inside the journey banner on mobile.
 */
export const MOTIVATIONAL_QUOTES: readonly Quote[] = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Small steps, taken daily, become giant leaps." },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Ship it. Iterate. Repeat." },
  { text: "Do the work today. Future you is watching." },
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "Progress, not perfection." },
  { text: "Discipline compounds. So does confidence." },
  { text: "One project at a time. One commit at a time." },
  { text: "Learn in public. Build in the open." },
  { text: "Consistency beats intensity." },
  { text: "You are exactly where you need to be." },
  { text: "Fall in love with the process, and the results will follow.", author: "Eric Thomas" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Show up. Especially on the days you don't want to." },
];

/** Deterministic quote for a given day so it doesn't flicker between renders. */
export function pickDailyQuote(date: Date = new Date()): Quote {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  const idx = ((dayOfYear % MOTIVATIONAL_QUOTES.length) + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[idx];
}

/** Quote to celebrate reaching the end date. Rotates similarly. */
export function pickFinishQuote(date: Date = new Date()): Quote {
  const finishPool: Quote[] = [
    { text: "You built the thing. Now go build the next one." },
    { text: "The finish line is just the start of the next race." },
    { text: "You showed up every week. That is the whole game." },
    { text: "Look how far past the beginning you are." },
    { text: "Ship, celebrate, then set a bolder target." },
  ];
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return finishPool[((dayOfYear % finishPool.length) + finishPool.length) % finishPool.length];
}
