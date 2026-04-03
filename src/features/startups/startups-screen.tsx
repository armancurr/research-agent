"use client";

import { api } from "@convex/_generated/api";
import {
  ArrowUpRight,
  Check,
  FolderSimple,
  Plus,
  TrashSimple,
  X,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "convex/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/shared/app-header";
import { AppShell } from "@/components/shared/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

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
  stopped: "bg-muted-foreground/70",
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
  const shouldReduceMotion = useReducedMotion();
  const startups = useQuery(api.startups.listMine);
  const deleteStartups = useMutation(api.startups.deleteMany);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedStartupIds, setSelectedStartupIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function enterSelectionMode() {
    setIsSelectionMode(true);
  }

  function exitSelectionMode() {
    setIsSelectionMode(false);
    setSelectedStartupIds([]);
    setIsDeleteDialogOpen(false);
  }

  function toggleStartupSelection(startupId: string) {
    setSelectedStartupIds((current) =>
      current.includes(startupId)
        ? current.filter((id) => id !== startupId)
        : [...current, startupId],
    );
  }

  async function handleDeleteSelected() {
    if (selectedStartupIds.length === 0 || isDeleting) {
      return;
    }

    const count = selectedStartupIds.length;
    setIsDeleting(true);

    try {
      await deleteStartups({ startupIds: selectedStartupIds as never });
      toast.success(
        `${count} ${count === 1 ? "startup" : "startups"} deleted.`,
      );
      exitSelectionMode();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete startups.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <AppHeader />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedStartupIds.length}{" "}
              {selectedStartupIds.length === 1 ? "startup" : "startups"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the selected startups and all
              associated runs, artifacts, comments, and chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={selectedStartupIds.length === 0 || isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : `Delete (${selectedStartupIds.length})`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AppShell className="pb-20 pt-8">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium tracking-tight text-foreground">
              Your Startups
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {isSelectionMode
                ? "Select startups to delete in bulk."
                : "Briefs and research runs, all in one place."}
            </p>
          </div>

          {startups && startups.length > 0 ? (
            <div className="flex shrink-0 items-center gap-2">
              {isSelectionMode ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    nativeButton={false}
                    className="gap-1.5"
                    render={<Link href="/new" />}
                  >
                    <Plus size={16} weight="bold" aria-hidden />
                    New startup
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={selectedStartupIds.length === 0 || isDeleting}
                  >
                    <TrashSimple size={14} weight="bold" />
                    {isDeleting
                      ? "Deleting..."
                      : `Delete (${selectedStartupIds.length})`}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exitSelectionMode}
                    disabled={isDeleting}
                  >
                    <X size={14} weight="bold" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    nativeButton={false}
                    className="gap-1.5"
                    render={<Link href="/new" />}
                  >
                    <Plus size={16} weight="bold" aria-hidden />
                    New startup
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={enterSelectionMode}
                  >
                    <TrashSimple size={14} weight="bold" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          ) : null}
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
          <Empty className="py-28">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderSimple size={16} weight="fill" />
              </EmptyMedia>
              <EmptyTitle>No startups yet</EmptyTitle>
              <EmptyDescription className="text-xs">
                Start your first brief to generate launch research.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-2 flex-row flex-wrap items-center justify-center gap-2">
              <Button
                variant="default"
                size="sm"
                nativeButton={false}
                className="gap-1.5"
                render={<Link href="/new" />}
              >
                <Plus size={16} weight="bold" aria-hidden />
                New startup
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="gap-1.5"
                render={<Link href="/?preview=1" />}
              >
                <ArrowUpRight size={16} weight="bold" aria-hidden />
                How it works
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => {
              const isSelected = selectedStartupIds.includes(startup._id);
              const cardClasses = `relative flex flex-col justify-between rounded-lg border bg-card p-5 transition-colors ${
                isSelected
                  ? "border-destructive/60 bg-destructive/5"
                  : "border-border/50"
              } ${isSelectionMode ? "cursor-pointer" : ""}`;

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

                      {isSelectionMode ? (
                        <span
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-destructive/70 bg-destructive/10 text-destructive"
                              : "border-border/60 text-transparent"
                          }`}
                        >
                          <Check size={12} weight="bold" />
                        </span>
                      ) : startup.latestRun ? (
                        <ArrowUpRight
                          size={14}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-muted-foreground/40"
                        />
                      ) : null}
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

              return isSelectionMode ? (
                <button
                  key={startup._id}
                  type="button"
                  className={cardClasses}
                  onClick={() => toggleStartupSelection(startup._id)}
                  disabled={isDeleting}
                >
                  {inner}
                </button>
              ) : startup.latestRun ? (
                <Link
                  key={startup._id}
                  href={`/chat/${startup.latestRun._id}`}
                  transitionTypes={["route-fade"]}
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
    </motion.div>
  );
}
