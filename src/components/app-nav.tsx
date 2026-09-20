"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileActivity } from "@/components/profile-activity";
import type { ActivityTracker } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function AppNav({
  name,
  email,
  overall,
  activity,
}: {
  name: string;
  email: string;
  overall: { coreDone: number; coreTotal: number };
  activity: ActivityTracker;
}) {
  const pathname = usePathname();
  const progress = overall.coreTotal
    ? Math.round((overall.coreDone / overall.coreTotal) * 100)
    : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[rgba(10,13,26,.92)] shadow-[0_1px_0_rgba(107,142,255,.08)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center px-3 sm:px-7">
        <Link
          href="/plan"
          className="mr-auto flex items-center gap-2 border-b-0 font-display text-xl uppercase tracking-wide text-foreground hover:text-primary sm:text-2xl"
        >
          <span className="h-3 w-3 bg-primary" aria-hidden />
          <span className="hidden min-[400px]:inline">AI Roadmap</span>
          <span className="min-[400px]:hidden">AI</span>
        </Link>

        <nav className="flex h-full items-center gap-3 sm:gap-8" aria-label="Primary navigation">
          {[
            { href: "/plan", label: "Plan" },
            { href: "/todo", label: "Todo" },
          ].map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full items-center border-b-2 border-transparent font-mono text-[0.66rem] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-primary sm:text-[0.72rem] sm:tracking-[0.12em]",
                  active && "border-primary text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-4 hidden items-center gap-2 border-l border-border pl-4 md:flex">
          <div className="h-[3px] w-16 bg-surface-3 lg:w-20">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-[0.62rem] text-muted-2">{progress}%</span>
        </div>

        <ProfileActivity
          name={name}
          email={email}
          overall={overall}
          tracker={activity}
        />
      </div>
    </header>
  );
}
