"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { LaunchChatHeaderActions } from "@/features/launch-chat/components/launch-chat-header-actions";
import { ResearchSourcesGrid } from "@/features/launch-chat/components/research-sources-grid";
import { RunArtifactsPanel } from "@/features/launch-chat/components/run-artifacts-panel";
import { StreamStatusBanner } from "@/features/launch-chat/components/stream-status-banner";
import { SynthesisPanel } from "@/features/launch-chat/components/synthesis-panel";
import { WorkflowTimeline } from "@/features/launch-chat/components/workflow-timeline";
import { useLaunchStream } from "@/features/launch-chat/hooks/use-launch-stream";
import type { ResearchBucket } from "@/types/launch";

export function LaunchChatScreen({ runId }: { runId: string }) {
  const router = useRouter();
  const typedRunId = runId as Id<"runs">;
  const runData = useQuery(api.runs.getById, { runId: typedRunId });
  const approveRun = useMutation(api.runs.approve);
  const rerunFromRun = useMutation(api.runs.rerunFromRun);
  const hasStartedRef = useRef(false);
  const { buckets, hydrate, phase, startStream, synthesis } = useLaunchStream();

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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader
        actions={
          <LaunchChatHeaderActions
            runStatus={runData.run.status}
            onApprove={handleApprove}
            onRerun={handleRerun}
          />
        }
      />

      <div className="flex min-h-0 flex-1 flex-col border-t border-border/30 lg:flex-row">
        <div className="flex min-h-0 w-full flex-col overflow-hidden border-border/30 lg:w-1/2 lg:border-r">
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
            <WorkflowTimeline stageRuns={runData.stageRuns} />
            <ResearchSourcesGrid
              buckets={displayedBuckets}
              latestMessages={sourceMessages}
              phase={displayedPhase}
              sourceStatuses={sourceStatuses}
            />
            <RunArtifactsPanel artifacts={runData.artifacts} />
            <StreamStatusBanner
              bucketCount={displayedBuckets.size}
              currentStage={runData.run.currentStage}
              eventCount={runData.runEvents.length}
              phase={displayedPhase}
            />
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-col overflow-hidden border-t border-border/40 lg:w-1/2 lg:border-t-0">
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
            <SynthesisPanel
              phase={displayedPhase}
              synthesis={displayedSynthesis}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
