"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { LaunchChatHeaderActions } from "@/features/launch-chat/components/launch-chat-header-actions";
import { LaunchPackagePreviewCard } from "@/features/launch-chat/components/launch-package-preview-card";
import { LaunchRunTabs } from "@/features/launch-chat/components/launch-run-tabs";
import { StartupBriefCard } from "@/features/launch-chat/components/startup-brief-card";
import { useLaunchStream } from "@/features/launch-chat/hooks/use-launch-stream";
import { useViewMode } from "@/features/launch-chat/hooks/use-view-mode";
import type { LaunchPackage, ResearchBucket } from "@/types/launch";

export function LaunchChatScreen({ runId }: { runId: string }) {
  const router = useRouter();
  const typedRunId = runId as Id<"runs">;
  const runData = useQuery(api.runs.getById, { runId: typedRunId });
  const approveRun = useMutation(api.runs.approve);
  const rerunFromRun = useMutation(api.runs.rerunFromRun);
  const hasStartedRef = useRef(false);
  const { buckets, hydrate, phase, startStream, synthesis } = useLaunchStream();
  const { mode, effectiveMode, setMode } = useViewMode();

  const persistedResearch = useMemo(() => {
    const artifact = runData?.artifacts.find(
      (entry) => entry.artifactType === "research",
    );
    return (artifact?.content as ResearchBucket[] | undefined) ?? [];
  }, [runData]);

  const persistedSynthesis = useMemo(() => {
    const artifact = runData?.artifacts.find(
      (entry) => entry.artifactType === "launch_package_markdown",
    );
    if (!artifact) return "";
    if (typeof artifact.markdown === "string") return artifact.markdown;
    const value = artifact.content as { text?: string } | undefined;
    return value?.text ?? "";
  }, [runData]);

  const persistedPackage = useMemo(() => {
    const artifact = runData?.artifacts.find(
      (entry) => entry.artifactType === "launch_package_final",
    );
    if (artifact?.content && typeof artifact.content === "object") {
      return artifact.content as LaunchPackage;
    }
    return null;
  }, [runData]);

  const displayedBuckets = buckets.size
    ? buckets
    : new Map(persistedResearch.map((bucket) => [bucket.source, bucket]));
  const displayedSynthesis = synthesis || persistedSynthesis;

  const sourceStatuses = useMemo(() => {
    const result: Partial<
      Record<
        ResearchBucket["source"],
        "waiting" | "running" | "completed" | "failed"
      >
    > = {};
    runData?.runEvents.forEach((event) => {
      if (!event.source) return;
      if (event.kind === "source_started") result[event.source] = "running";
      if (event.kind === "source_completed") result[event.source] = "completed";
      if (event.kind === "source_failed") result[event.source] = "failed";
    });
    return result;
  }, [runData]);

  const sourceMessages = useMemo(() => {
    const result: Partial<Record<ResearchBucket["source"], string>> = {};
    runData?.runEvents.forEach((event) => {
      if (event.source && event.message) result[event.source] = event.message;
    });
    return result;
  }, [runData]);

  const displayedPhase =
    phase !== "idle"
      ? phase
      : runData?.run.status === "failed"
        ? "error"
        : displayedSynthesis
          ? "done"
          : "idle";

  useEffect(() => {
    if (!runData || hasStartedRef.current) return;
    if (persistedResearch.length > 0 || persistedSynthesis) {
      hydrate({
        research: persistedResearch,
        synthesisMarkdown: persistedSynthesis,
      });
      hasStartedRef.current = true;
      return;
    }
    if (
      runData.run.status === "queued" ||
      runData.run.status === "generating"
    ) {
      hasStartedRef.current = true;
      void startStream({ runId: typedRunId });
    }
  }, [
    hydrate,
    persistedResearch,
    persistedSynthesis,
    runData,
    startStream,
    typedRunId,
  ]);

  if (runData === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <div className="flex-1" />
      </div>
    );
  }

  async function handleApprove() {
    await approveRun({ runId: typedRunId });
  }

  async function handleRerun() {
    const { runId: nextRunId } = await rerunFromRun({ runId: typedRunId });
    router.push(`/chat/${nextRunId}`);
  }

  const isSplit = effectiveMode === "split";

  const leftContent = (
    <>
      <StartupBriefCard brief={runData.run.briefSnapshot} />
      <LaunchRunTabs
        stageRuns={runData.stageRuns}
        buckets={displayedBuckets}
        latestMessages={sourceMessages}
        sourceStatuses={sourceStatuses}
        artifacts={runData.artifacts}
      />
    </>
  );

  const rightContent = (
    <LaunchPackagePreviewCard
      phase={displayedPhase}
      synthesis={displayedSynthesis}
      structuredPackage={persistedPackage}
    />
  );

  const unifiedContent = (
    <div className="space-y-6">
      <LaunchRunTabs
        stageRuns={runData.stageRuns}
        buckets={displayedBuckets}
        latestMessages={sourceMessages}
        sourceStatuses={sourceStatuses}
        artifacts={runData.artifacts}
      />
      <LaunchPackagePreviewCard
        phase={displayedPhase}
        synthesis={displayedSynthesis}
        structuredPackage={persistedPackage}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader
        actions={
          <LaunchChatHeaderActions
            runStatus={runData.run.status}
            viewMode={mode}
            onViewModeChange={setMode}
            onRerun={handleRerun}
            onApprove={handleApprove}
          />
        }
      />

      <div>
        {isSplit ? (
          <div
            className="grid grid-cols-2"
            style={{
              height: "calc(100vh - 3.5rem)",
            }}
          >
            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              {leftContent}
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              {rightContent}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl px-5 py-5 sm:px-6 lg:px-8">
            <StartupBriefCard brief={runData.run.briefSnapshot} />
            {unifiedContent}
          </div>
        )}
      </div>
    </div>
  );
}
