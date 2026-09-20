import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border border-border bg-surface", className)} {...props} />;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger" | "subtle";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  const variants: Record<string, string> = {
    primary: "border-primary bg-primary text-primary-fg hover:border-[var(--primary-hover)] hover:bg-[var(--primary-hover)]",
    ghost: "border-transparent bg-transparent text-muted hover:text-primary",
    outline: "border-foreground bg-background text-foreground hover:bg-foreground hover:text-background",
    danger: "border-transparent bg-transparent text-danger hover:border-danger",
    subtle: "border-border bg-surface-2 text-foreground hover:border-primary hover:text-primary",
  };
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 border font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] transition-all active:translate-x-px active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        size === "sm" ? "h-9 px-3" : "h-11 px-5",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ className, color, ...props }: React.HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 border border-border bg-surface-2 px-2 py-0.5 font-mono text-[0.58rem] font-medium uppercase tracking-[0.08em] text-muted", className)}
      style={color ? { color, borderColor: color } : undefined}
      {...props}
    />
  );
}

export function ProgressBar({ value, color, className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn("h-[3px] w-full overflow-hidden bg-surface-3", className)}>
      <div className="h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color ?? "var(--primary)" }} />
    </div>
  );
}

export function Ring({ value, size = 56, stroke = 4, color, label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center font-mono" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-surface-3" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c - (Math.min(100, Math.max(0, value)) / 100) * c} strokeLinecap="square" className="fill-none transition-all" style={{ stroke: color ?? "var(--primary)" }} />
      </svg>
      <span className="absolute text-[0.65rem] font-bold">{label ?? `${Math.round(value)}%`}</span>
    </div>
  );
}

const typeLabels: Record<string, string> = {
  course: "Course", playlist: "Playlist", video: "Video", docs: "Docs",
  article: "Article", book: "Book", paper: "Paper", tool: "Tool",
  practice: "Practice", github: "GitHub", job: "Jobs", newsletter: "Newsletter",
  podcast: "Podcast", website: "Website",
};
export function TypeBadge({ type }: { type: string }) { return <Badge>{typeLabels[type] ?? type}</Badge>; }
