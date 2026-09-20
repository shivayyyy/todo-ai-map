import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getPhases } from "@/lib/dal";
import { Button, Card } from "@/components/ui";
import { phaseVar } from "@/lib/utils";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/plan");

  const phases = await getPhases();

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10">
      <nav className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          AI Engineer <span className="text-[var(--phase-6)]">Roadmap</span>
        </span>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </nav>

      <section className="mt-16 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          Beginner to job-ready
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight sm:text-6xl">
          Zero to AI Engineer,
          <span className="block text-[var(--phase-6)]">tracked week by week.</span>
        </h1>
        <p className="mt-5 text-lg text-muted">
          A complete plan from your first line of Python to deployed LLM apps,
          RAG systems and agents. Every topic is broken into clear subtopics with
          hand-picked free resources, a real project each phase, and progress you
          actually track. Finish in the original 24 weeks or the accelerated 16.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup">
            <Button size="md">Start your plan</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="md">I have an account</Button>
          </Link>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat n="11" label="phases" />
        <Stat n="300+" label="detailed subtopics" />
        <Stat n="314" label="free resources" />
        <Stat n="23" label="projects" />
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          The route — 11 phases, in order
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: phaseVar(p.colorVar) }}
                >
                  {String(p.order).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium leading-tight">{p.title}</p>
                  <p className="text-xs text-muted">
                    Weeks {p.weekStart}
                    {p.weekEnd !== p.weekStart ? `–${p.weekEnd}` : ""}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">{p.subtitle}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-sm text-muted">
        Curriculum adapted from Aditya Dewaskar&apos;s{" "}
        <a
          className="underline underline-offset-4"
          href="https://www.youtube.com/@dewaskaraditya"
          target="_blank"
          rel="noreferrer"
        >
          AI Engineer Roadmap 2026
        </a>
        , expanded with deeper subtopics and extra real-world projects.
      </footer>
    </main>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <Card className="p-5">
      <p className="text-3xl font-bold text-[var(--phase-1)]">{n}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Card>
  );
}
