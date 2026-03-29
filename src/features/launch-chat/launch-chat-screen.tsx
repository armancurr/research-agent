"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { UserNav } from "@/components/shared/user-nav";
import { Button } from "@/components/ui/button";
import { LaunchChatHeader } from "@/features/launch-chat/components/launch-chat-header";
import { ResearchSourcesGrid } from "@/features/launch-chat/components/research-sources-grid";
import { RunArtifactsPanel } from "@/features/launch-chat/components/run-artifacts-panel";
import { RunEventLog } from "@/features/launch-chat/components/run-event-log";
import { RunExportActions } from "@/features/launch-chat/components/run-export-actions";
import { StreamStatusBanner } from "@/features/launch-chat/components/stream-status-banner";
import { SynthesisPanel } from "@/features/launch-chat/components/synthesis-panel";
import { WorkflowTimeline } from "@/features/launch-chat/components/workflow-timeline";
import { useAutoScroll } from "@/features/launch-chat/hooks/use-auto-scroll";
import { useLaunchStream } from "@/features/launch-chat/hooks/use-launch-stream";
import type { ResearchBucket } from "@/types/launch";

export function LaunchChatScreen({ runId }: { runId: string }) {
  const router = useRouter();
  const typedRunId = runId as Id<"runs">;
  const runData = useQuery(api.runs.getById, { runId: typedRunId });
  const approveRun = useMutation(api.runs.approve);
  const rerunFromRun = useMutation(api.runs.rerunFromRun);
  const hasStartedRef = useRef(false);
  const { bottomRef, maybeScrollToBottom } = useAutoScroll();
  const { buckets, hydrate, isLive, phase, startStream, synthesis } =
    useLaunchStream();

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

    if (!artifact) {
      return "";
    }

    if (typeof artifact.markdown === "string") {
      return artifact.markdown;
    }

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
      if (!event.source) {
        return;
      }

      if (event.kind === "source_started") {
        result[event.source] = "running";
      }

      if (event.kind === "source_completed") {
        result[event.source] = "completed";
      }

      if (event.kind === "source_failed") {
        result[event.source] = "failed";
      }
    });

    return result;
  }, [runData]);
  const sourceMessages = useMemo(() => {
    const result: Partial<Record<ResearchBucket["source"], string>> = {};

    runData?.runEvents.forEach((event) => {
      if (event.source && event.message) {
        result[event.source] = event.message;
      }
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
    if (!runData || hasStartedRef.current) {
      return;
    }

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
      void startStream({
        runId: typedRunId,
      });
    }
  }, [
    hydrate,
    persistedResearch,
    persistedSynthesis,
    runData,
    startStream,
    typedRunId,
  ]);

  useEffect(() => {
    if (
      displayedPhase === "idle" ||
      displayedPhase === "done" ||
      displayedPhase === "error"
    ) {
      return;
    }

    maybeScrollToBottom();
    const id = setInterval(maybeScrollToBottom, 400);
    return () => clearInterval(id);
  }, [displayedPhase, maybeScrollToBottom]);

  if (runData === undefined) {
    return <div className="min-h-screen bg-background" />;
  }

  const brief = runData.run.briefSnapshot;

  async function handleApprove() {
    await approveRun({ runId: typedRunId });
  }

  async function handleRerun() {
    const { runId: nextRunId } = await rerunFromRun({ runId: typedRunId });
    router.push(`/chat/${nextRunId}`);
  }

  return (
    <AppShell className="pb-20 pt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Run Thread
          </p>
          <p className="text-sm text-muted-foreground">Saved run ID: {runId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <UserNav />
          <RunExportActions markdown={displayedSynthesis} runId={runId} />
          {runData.run.status !== "generating" ? (
            <Button variant="outline" onClick={handleRerun}>
              Rerun Workflow
            </Button>
          ) : null}
          {runData.run.status === "completed" ? (
            <Button onClick={handleApprove}>Approve Final</Button>
          ) : null}
        </div>
      </div>
      <LaunchChatHeader brief={brief} isLive={isLive} phase={displayedPhase} />
      <WorkflowTimeline stageRuns={runData.stageRuns} />
      <RunEventLog events={runData.runEvents} />
      <ResearchSourcesGrid
        buckets={displayedBuckets}
        latestMessages={sourceMessages}
        phase={displayedPhase}
        sourceStatuses={sourceStatuses}
      />
      <SynthesisPanel phase={displayedPhase} synthesis={displayedSynthesis} />
      <RunArtifactsPanel artifacts={runData.artifacts} />
      <StreamStatusBanner
        bucketCount={displayedBuckets.size}
        currentStage={runData.run.currentStage}
        eventCount={runData.runEvents.length}
        phase={displayedPhase}
      />
      <div ref={bottomRef} className="h-px" />
    </AppShell>
  );
}
