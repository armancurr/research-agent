"use client";

import { useMemo } from "react";
import {
  type Artifact,
  ArtifactRow,
} from "@/features/launch-chat/components/artifact-row";
import { getArtifactDescription } from "@/features/launch-chat/utils/artifact-display-names";

type StageRun = {
  _id: string;
  attemptNumber: number;
  completedAt?: number;
  stageKey: string;
  startedAt: number;
  status: "running" | "completed" | "failed";
  summary?: string;
};

type DerivedStage = {
  key: string;
  label: string;
  status: "completed" | "running" | "failed" | "pending";
  run: StageRun | null;
};

const PIPELINE_STAGES = [
  "intake",
  "research_planning",
  "source_retrieval",
  "evidence_curation",
  "synthesis_agent",
  "hook_agent",
  "package_draft",
  "qa_check",
  "rewrite_attempt",
  "finalized",
] as const;

/** What to show while each stage is actively running (no artifact yet). */
const STAGE_RUNNING_MESSAGES: Partial<Record<string, string>> = {
  intake: "Getting started…",
  research_planning: "Planning which sources to search…",
  source_retrieval: "Searching Reddit, X, YouTube, and the web…",
  evidence_curation: "Sifting through the results…",
  synthesis_agent: "Drawing out the key signals for your launch…",
  hook_agent: "Brainstorming launch angles and hooks…",
  package_draft: "Writing your first launch package…",
  qa_check: "Reviewing quality and identifying improvements…",
  rewrite_attempt: "Rewriting based on the quality review…",
  finalized: "Wrapping up and saving your package…",
};

/** Static mapping from pipeline stage → artifact types produced at that stage */
const STAGE_ARTIFACT_TYPES: Partial<Record<string, string[]>> = {
  research_planning: ["research_plan"],
  evidence_curation: ["evidence_bundle"],
  synthesis_agent: ["synthesis_notes"],
  hook_agent: ["hook_candidates"],
  package_draft: ["launch_package_draft"],
  qa_check: ["qa_report"],
  rewrite_attempt: ["rewrite_draft"],
  finalized: ["launch_package_final", "launch_package_markdown", "research"],
};

function usePipeline(stageRuns: StageRun[]) {
  return useMemo(() => {
    const latest = new Map<string, StageRun>();
    for (const run of stageRuns) {
      const existing = latest.get(run.stageKey);
      if (!existing || run.attemptNumber > existing.attemptNumber) {
        latest.set(run.stageKey, run);
      }
    }

    // Build derived stages from the known pipeline, merging in any extra
    // stageKeys that appear in stageRuns but aren't in PIPELINE_STAGES
    // (e.g. a future stage or rewrite_attempt if it ran).
    const knownKeys = new Set<string>(PIPELINE_STAGES);
    const extraKeys = [...latest.keys()].filter((k) => !knownKeys.has(k));
    const allKeys = [...PIPELINE_STAGES, ...extraKeys];

    const stages: DerivedStage[] = allKeys.map((key) => {
      const run = latest.get(key) ?? null;
      return {
        key,
        label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        status: (run?.status ?? "pending") as DerivedStage["status"],
        run,
      };
    });

    // Remove pending stages that have never started and come after all activity
    const lastActiveIdx = stages.reduce(
      (acc, s, i) => (s.status !== "pending" ? i : acc),
      -1,
    );
    const visibleStages =
      lastActiveIdx === -1
        ? stages.slice(0, 3) // show a few pending stages on fresh run
        : stages;

    const focusIdx = (() => {
      const idx = stages.findIndex((s) => s.status === "running");
      if (idx !== -1) return idx;
      for (let i = stages.length - 1; i >= 0; i--) {
        if (stages[i].status === "completed" || stages[i].status === "failed") {
          return i;
        }
      }
      return 0;
    })();

    return {
      stages: visibleStages,
      focusIdx,
    };
  }, [stageRuns]);
}

export function PipelineView({
  stageRuns,
  artifacts,
}: {
  stageRuns: StageRun[];
  artifacts: Artifact[];
}) {
  const { stages, focusIdx } = usePipeline(stageRuns);

  // Build a lookup: artifactType → artifacts — must be before any early return
  const artifactsByType = useMemo(() => {
    const map = new Map<string, Artifact[]>();
    for (const artifact of artifacts) {
      const existing = map.get(artifact.artifactType) ?? [];
      map.set(artifact.artifactType, [...existing, artifact]);
    }
    return map;
  }, [artifacts]);

  if (stageRuns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground/50">
        Waiting for the pipeline to start…
      </p>
    );
  }

  return (
    <div className="select-none">
      <div className="divide-y divide-border/20 rounded-md border border-border/25 bg-muted/[0.03]">
        {stages.map((stage, i) => {
          const stageArtifactTypes = STAGE_ARTIFACT_TYPES[stage.key] ?? [];
          const stageArtifacts = stageArtifactTypes.flatMap(
            (type) => artifactsByType.get(type) ?? [],
          );
          // Only treat as "live" while the stage is actively running. If we use
          // focusIdx alone, the last completed stage stays focused and every
          // artifact in multi-artifact stages (e.g. finalized) stays expanded.
          const isLiveStage = i === focusIdx && stage.status === "running";

          if (stage.status === "running" && stageArtifacts.length === 0) {
            // Show a pulsing "in progress" row while the stage is working
            return (
              <div
                key={stage.key}
                className="px-3 py-3 text-sm text-muted-foreground/70 animate-in fade-in duration-300"
              >
                {STAGE_RUNNING_MESSAGES[stage.key] ?? "Working…"}
              </div>
            );
          }

          if (stageArtifacts.length === 0) return null;

          return stageArtifacts.map((artifact) => (
            <ArtifactRow
              key={artifact._id}
              artifact={artifact}
              isLive={isLiveStage}
              description={getArtifactDescription(artifact.artifactType)}
            />
          ));
        })}
      </div>
    </div>
  );
}
