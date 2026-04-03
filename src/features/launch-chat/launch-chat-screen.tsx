"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/shared/app-header";
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
import { LaunchChatHeaderActions } from "@/features/launch-chat/components/launch-chat-header-actions";
import { LaunchPackagePreviewCard } from "@/features/launch-chat/components/launch-package-preview-card";
import { LaunchRunTabs } from "@/features/launch-chat/components/launch-run-tabs";
import { StartupBriefCard } from "@/features/launch-chat/components/startup-brief-card";
import {
  type StreamPhase,
  useLaunchStream,
} from "@/features/launch-chat/hooks/use-launch-stream";
import { useViewMode } from "@/features/launch-chat/hooks/use-view-mode";
import { getRunProgressPct } from "@/features/launch-chat/utils/run-progress";
import { getErrorMessage } from "@/lib/get-error-message";
import type { LaunchPackage, ResearchBucket } from "@/types/launch";

const STAGE_PREVIEW_ARTIFACTS: Record<string, string> = {
  research_planning: "research_plan",
  source_retrieval: "evidence_bundle",
  evidence_curation: "evidence_bundle",
  synthesis_agent: "synthesis_notes",
  hook_agent: "hook_candidates",
  package_draft: "launch_package_draft",
  qa_check: "qa_report",
  rewrite_attempt: "rewrite_draft",
  finalized: "launch_package_final",
};

export function LaunchChatScreen({ runId }: { runId: string }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const typedRunId = runId as Id<"runs">;
  const runData = useQuery(api.runs.getById, { runId: typedRunId });
  const approveRun = useMutation(api.runs.approve);
  const stopRun = useMutation(api.runs.markStopped);
  const rerunFromRun = useMutation(api.runs.rerunFromRun);
  const hasStartedRef = useRef(false);
  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const {
    buckets,
    finalPackage: streamedPackage,
    hydrate,
    phase,
    startStream,
    stopStream,
    synthesis,
  } = useLaunchStream();
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

  const displayedPhase: StreamPhase =
    phase !== "idle"
      ? phase
      : runData?.run.status === "stopped"
        ? "stopped"
        : runData?.run.status === "failed"
          ? "error"
          : displayedSynthesis
            ? "done"
            : "idle";

  const displayedPackage = streamedPackage ?? persistedPackage;

  const previewArtifactType = useMemo(() => {
    if (displayedPackage || displayedSynthesis) {
      return "launch_package_final";
    }

    const currentStage = runData?.run.currentStage;
    if (!currentStage) {
      return "launch_package_final";
    }

    return STAGE_PREVIEW_ARTIFACTS[currentStage] ?? "launch_package_final";
  }, [displayedPackage, displayedSynthesis, runData?.run.currentStage]);

  const progressPct = useMemo(
    () => getRunProgressPct(runData?.stageRuns ?? []),
    [runData?.stageRuns],
  );

  useEffect(() => {
    if (!runData || hasStartedRef.current) return;
    if (persistedResearch.length > 0 || persistedSynthesis) {
      hydrate({
        finalPackage: persistedPackage,
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
    persistedPackage,
    persistedResearch,
    persistedSynthesis,
    runData,
    startStream,
    typedRunId,
  ]);

  if (runData === undefined) {
    return (
      <motion.div
        className="flex min-h-screen flex-col bg-background"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AppHeader />
        <div className="flex-1" />
      </motion.div>
    );
  }

  async function handleApprove() {
    await approveRun({ runId: typedRunId });
  }

  async function handleRerun() {
    if (isRestarting) return;

    setIsRestarting(true);

    try {
      const { runId: nextRunId } = await rerunFromRun({ runId: typedRunId });
      setIsRestartDialogOpen(false);
      router.push(`/chat/${nextRunId}`, {
        transitionTypes: ["route-fade"],
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to restart this run right now."),
      );
    } finally {
      setIsRestarting(false);
    }
  }

  async function handleStop() {
    stopStream();

    try {
      await stopRun({
        runId: typedRunId,
        message: "Run stopped by user.",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to stop this run right now."));
    }
  }

  const isSplit = effectiveMode === "split";

  const previewProps = {
    artifactType: previewArtifactType,
    phase: displayedPhase,
    progressPct,
    synthesis: displayedSynthesis,
    structuredPackage: displayedPackage,
  };

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
    <LaunchPackagePreviewCard {...previewProps} centerPlaceholder={isSplit} />
  );

  const unifiedContent = (
    <div className="space-y-6">
      <LaunchPackagePreviewCard {...previewProps} />
      <LaunchRunTabs
        stageRuns={runData.stageRuns}
        buckets={displayedBuckets}
        latestMessages={sourceMessages}
        sourceStatuses={sourceStatuses}
        artifacts={runData.artifacts}
      />
    </div>
  );

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-background"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <AlertDialog
        open={isRestartDialogOpen}
        onOpenChange={(open) => {
          if (!isRestarting) {
            setIsRestartDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart this run?</AlertDialogTitle>
            <AlertDialogDescription>
              This will start a new run from the same startup brief and take you
              to the new run once it begins.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestarting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRerun} disabled={isRestarting}>
              {isRestarting ? "Restarting..." : "Restart run"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AppHeader
        actions={
          <LaunchChatHeaderActions
            runStatus={runData.run.status}
            viewMode={mode}
            onViewModeChange={setMode}
            onRerun={() => setIsRestartDialogOpen(true)}
            onStop={handleStop}
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
    </motion.div>
  );
}
