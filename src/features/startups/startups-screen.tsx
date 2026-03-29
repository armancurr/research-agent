"use client";

import { api } from "@convex/_generated/api";
import { ArrowUpRight, Stack } from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import Link from "next/link";
import { AppHeader } from "@/components/shared/app-header";
import { AppShell } from "@/components/shared/app-shell";

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_DOT: Record<string, string> = {
  completed: "bg-chart-2",
  running: "bg-primary",
  failed: "bg-destructive",
  pending: "bg-muted-foreground/60",
};

const STARTUP_CARD_SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
] as const;

export function StartupsScreen() {
  const startups = useQuery(api.startups.listMine);

  return (
    <>
      <AppHeader />
      <AppShell className="pb-20 pt-8">
        <header className="mb-10">
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            Your Startups
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Briefs and research runs, all in one place.
          </p>
        </header>

        {startups === undefined ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STARTUP_CARD_SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="h-40 animate-pulse rounded-lg border border-border/40 bg-card/60"
              />
            ))}
          </div>
        ) : startups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-card">
              <Stack
                size={22}
                weight="duotone"
                className="text-muted-foreground/70"
              />
            </div>
            <p className="text-sm font-medium text-foreground">
              No startups yet
            </p>
            <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
              Hit &ldquo;New startup&rdquo; in the header to define your first
              brief and kick off a research run.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => {
              const cardClasses =
                "relative flex flex-col justify-between rounded-lg border border-border/50 bg-card p-5";

              const inner = (
                <>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-medium text-foreground">
                          {startup.brief.companyName ||
                            startup.brief.productName}
                        </h2>
                        {startup.brief.companyName &&
                          startup.brief.productName &&
                          startup.brief.companyName !==
                            startup.brief.productName && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {startup.brief.productName}
                            </p>
                          )}
                      </div>

                      {startup.latestRun && (
                        <ArrowUpRight
                          size={14}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-muted-foreground/40"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
                    <span className="tabular-nums">
                      {startup.runCount}{" "}
                      {startup.runCount === 1 ? "run" : "runs"}
                    </span>
                    {startup.latestRun && (
                      <>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`inline-block h-[5px] w-[5px] rounded-full ${STATUS_DOT[startup.latestRun.status] ?? "bg-muted-foreground/60"}`}
                          />
                          {startup.latestRun.status}
                        </span>
                        <span className="ml-auto tabular-nums text-muted-foreground/60">
                          {formatRelativeTime(startup.latestRun.createdAt)}
                        </span>
                      </>
                    )}
                  </div>
                </>
              );

              return startup.latestRun ? (
                <Link
                  key={startup._id}
                  href={`/chat/${startup.latestRun._id}`}
                  className={cardClasses}
                >
                  {inner}
                </Link>
              ) : (
                <div key={startup._id} className={cardClasses}>
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </AppShell>
    </>
  );
}
