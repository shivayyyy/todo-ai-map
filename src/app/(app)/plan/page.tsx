import { requireUser, getProfile } from "@/lib/dal";
import { getPhaseDetail, getPhaseSummaries, getOverallProgress } from "@/lib/queries";
import { Badge, Card, Ring } from "@/components/ui";
import { ProjectItem, SubtopicItem } from "@/components/plan-client";
import { PhaseSelect } from "@/components/phase-select";
import { pct, phaseVar } from "@/lib/utils";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ phase?: string }>;
}) {
  const user = await requireUser();
  const [profile, summaries, overall] = await Promise.all([
    getProfile(user.id),
    getPhaseSummaries(user.id),
    getOverallProgress(user.id),
  ]);
  const params = await searchParams;
  const activeSlug =
    params.phase ??
    summaries.find((phase) => phase.coreDone < phase.coreTotal)?.slug ??
    summaries[0]?.slug;
  const detail = activeSlug ? await getPhaseDetail(user.id, activeSlug) : null;
  const overallPercent = pct(overall.coreDone, overall.coreTotal);

  return (
    <main className="mx-auto w-full max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
      <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="fig-label">FIG_001 · CURRICULUM CONTROL</p>
          <h1 className="hierarchy-page mt-3">Your learning plan</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            One connected path from Python foundations to production AI. Open a
            phase, understand the lesson, choose one resource, build the work,
            and leave evidence.
          </p>
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-2">
            {profile?.mode === "original" ? "24-week standard" : "16-week accelerated"}
            {profile?.weeklyHours ? ` / ${profile.weeklyHours} hours weekly` : ""}
            {profile?.targetDate ? ` / target ${profile.targetDate}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 border border-foreground bg-foreground">
          <div className="flex min-w-40 items-center gap-3 bg-background p-4">
            <Ring value={overallPercent} color="var(--primary)" size={52} />
            <div>
              <p className="font-mono text-sm font-bold">{overall.coreDone}/{overall.coreTotal}</p>
              <p className="meta-label">Core lessons</p>
            </div>
          </div>
          <div className="min-w-36 border-l border-foreground bg-surface-2 p-4">
            <p className="font-display text-3xl text-primary">{overall.projectsDone}/{overall.projectCount}</p>
            <p className="meta-label mt-1">Projects shipped</p>
          </div>
        </div>
      </header>

      <div className="blueprint-rule my-10" aria-hidden />

      <section aria-labelledby="route-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="fig-label">ROUTE_011 · SELECT PHASE</p>
            <h2 id="route-heading" className="mt-1 text-3xl text-foreground">Choose a phase</h2>
          </div>
          <p className="hidden font-mono text-[0.62rem] uppercase tracking-wider text-muted-2 sm:block">
            {summaries.length} phases · tap to open
          </p>
        </div>

        {activeSlug && <PhaseSelect phases={summaries} activeSlug={activeSlug} />}
      </section>

      {detail && <PhasePanel detail={detail} />}
    </main>
  );
}

function PhasePanel({ detail }: { detail: NonNullable<Awaited<ReturnType<typeof getPhaseDetail>>> }) {
  const color = phaseVar(detail.colorVar);
  const portfolio = detail.projects.filter((project) => project.kind === "portfolio");
  const capstones = detail.projects.filter((project) => project.kind === "phase-capstone");

  return (
    <section className="mt-16 border-t border-foreground pt-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <header className="mb-10 max-w-3xl">
            <p className="fig-label" style={{ color }}>
              PHASE_{String(detail.order).padStart(2, "0")} · WEEKS {detail.weekStart}
              {detail.weekEnd !== detail.weekStart ? `–${detail.weekEnd}` : ""}
            </p>
            <h2 className="hierarchy-phase mt-2" style={{ color }}>{detail.title}</h2>
            <p className="mt-4 text-lg text-muted">{detail.description}</p>
          </header>

          <div className="space-y-12">
            {detail.weeks.map((week) => (
              <section key={week.id} className="paper-panel">
                <header className="border-b border-foreground bg-surface-2 px-5 py-5 sm:px-7">
                  <p className="meta-label">WEEK_{String(week.weekNumber).padStart(2, "0")}</p>
                  <h3 className="hierarchy-week mt-1">{week.title}</h3>
                  <p className="mt-2 text-sm text-muted">{week.summary}</p>
                  {week.shipDescription && (
                    <div className="mt-4 border-l-4 px-4 py-2" style={{ borderColor: color, background: `color-mix(in srgb, ${color} 7%, transparent)` }}>
                      <p className="meta-label" style={{ color }}>Ship evidence</p>
                      <p className="mt-1 text-sm">{week.shipDescription}</p>
                    </div>
                  )}
                </header>

                <div className="divide-y divide-border px-5 sm:px-7">
                  {week.topics.map((topic, topicIndex) => (
                    <section key={topic.id} className="py-8">
                      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div className="max-w-2xl">
                          <p className="meta-label mb-1" style={{ color }}>
                            TOPIC_{String(topicIndex + 1).padStart(2, "0")}
                          </p>
                          <h4 className="hierarchy-topic">{topic.title}</h4>
                          <p className="mt-1 text-sm text-muted">{topic.summary}</p>
                        </div>
                        {topic.coreTotal > 0 && (
                          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-2">
                            {topic.coreDone}/{topic.coreTotal} complete
                          </span>
                        )}
                      </div>

                      {topic.core.length > 0 && (
                        <div className="space-y-2">
                          {topic.core.map((subtopic) => (
                            <SubtopicItem key={subtopic.id} sub={subtopic} color={color} />
                          ))}
                        </div>
                      )}

                      {topic.additional.length > 0 && (
                        <details className="mt-5 border border-dashed border-border bg-surface-2/50">
                          <summary className="cursor-pointer select-none px-4 py-3 font-mono text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted hover:text-primary">
                            Additional depth / {topic.additional.length} concept
                            {topic.additional.length > 1 ? "s" : ""}
                          </summary>
                          <div className="space-y-2 border-t border-border p-3">
                            {topic.additional.map((subtopic) => (
                              <SubtopicItem key={subtopic.id} sub={subtopic} color={color} />
                            ))}
                          </div>
                        </details>
                      )}
                    </section>
                  ))}
                </div>
              </section>
            ))}

            <section className="border-t border-foreground pt-7">
              <p className="fig-label">BUILD_023 · PROJECT EVIDENCE</p>
              <h3 className="mt-2 text-4xl text-primary">Projects that prove the phase</h3>
              <p className="mt-2 max-w-2xl text-muted">
                The cumulative project builds intuition for this phase while
                revisiting earlier ones (~60% new / ~40% prior). Portfolio
                projects give you extra proof worth publishing.
              </p>

              <details className="mt-4 max-w-2xl border border-dashed border-border bg-surface-2/50">
                <summary className="cursor-pointer select-none px-4 py-3 font-mono text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted hover:text-primary">
                  How to track, ship &amp; upload your work
                </summary>
                <div className="space-y-3 border-t border-border p-4 text-sm text-muted">
                  <p>
                    Open a project to see its own <span className="text-foreground">How to ship it</span> steps.
                    Not everything is a website: a CLI, script or notebook ships as a
                    <span className="text-foreground"> GitHub repo + a short recorded demo</span> (asciinema or a GIF),
                    a trained model ships as a <span className="text-foreground">Hugging Face model page</span>, and a
                    web app or API ships as a <span className="text-foreground">live URL</span>.
                  </p>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>Keep each project in its own <span className="text-foreground">GitHub repo</span> with a clear README.</li>
                    <li>Deploy web apps free to <span className="text-foreground">Streamlit Cloud / Hugging Face Spaces / Render</span>; deploy sites to <span className="text-foreground">Vercel or GitHub Pages</span>.</li>
                    <li>For non-deployable work, record a 60-90s demo and treat that link as your &quot;live demo&quot;.</li>
                    <li>Save your links right here: open a project and paste its <span className="text-foreground">Repo URL</span> and <span className="text-foreground">Live demo URL</span> at the bottom, they are stored in your tracker. Mark milestones as you go.</li>
                    <li>For lessons, use the <span className="text-foreground">evidence link</span> field to save proof (a notebook, commit or screenshot).</li>
                  </ul>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: "GitHub profile README", url: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme" },
                      { label: "Streamlit Community Cloud", url: "https://streamlit.io/cloud" },
                      { label: "Hugging Face Spaces", url: "https://huggingface.co/docs/hub/spaces-overview" },
                      { label: "Render", url: "https://render.com/docs/free" },
                      { label: "Vercel", url: "https://vercel.com/docs/deployments" },
                      { label: "asciinema (record a CLI)", url: "https://asciinema.org/" },
                    ].map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-border px-2 py-1 font-mono text-[0.58rem] uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </details>

              <div className="mt-7 space-y-8">
                {capstones.length > 0 && (
                  <div>
                    <p className="meta-label mb-3">Cumulative intuition project</p>
                    <div className="space-y-2">
                      {capstones.map((project) => <ProjectItem key={project.id} project={project} color={color} />)}
                    </div>
                  </div>
                )}
                {portfolio.length > 0 && (
                  <div>
                    <p className="meta-label mb-3">Portfolio project set</p>
                    <div className="space-y-2">
                      {portfolio.map((project) => <ProjectItem key={project.id} project={project} color={color} />)}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5 hard-shadow">
            <p className="fig-label">STATUS · PHASE {String(detail.order).padStart(2, "0")}</p>
            <div className="mt-4 flex items-center gap-4">
              <Ring value={pct(detail.coreDone, detail.coreTotal)} color={color} size={64} />
              <div>
                <p className="font-display text-3xl" style={{ color }}>{detail.coreDone}/{detail.coreTotal}</p>
                <p className="meta-label">Core complete</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="fig-label" style={{ color }}>Exit criteria</p>
            <ul className="mt-4 space-y-3">
              {detail.doneWhen.map((item, index) => (
                <li key={index} className="grid grid-cols-[16px_1fr] gap-2 text-sm text-muted">
                  <span className="font-mono" style={{ color }}>□</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {detail.antiPatternTitle && (
            <Card className="border-warning p-5">
              <Badge color="var(--warning)">Avoid</Badge>
              <h4 className="mt-3 text-2xl text-foreground">{detail.antiPatternTitle}</h4>
              <p className="mt-2 text-sm text-muted">{detail.antiPatternBody}</p>
            </Card>
          )}
        </aside>
      </div>
    </section>
  );
}
