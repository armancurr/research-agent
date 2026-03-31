"use client";

import {
  CubeIcon,
  GlobeSimpleIcon,
  HourglassIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { ResearchSourcesGrid } from "@/features/launch-chat/components/research-sources-grid";
import { RunArtifactsPanel } from "@/features/launch-chat/components/run-artifacts-panel";
import { WorkflowTimeline } from "@/features/launch-chat/components/workflow-timeline";
import { cn } from "@/lib/utils";
import type { ResearchBucket } from "@/types/launch";

type StageRun = {
  _id: string;
  attemptNumber: number;
  completedAt?: number;
  stageKey: string;
  startedAt: number;
  status: "running" | "completed" | "failed";
  summary?: string;
};

type Artifact = {
  _id: string;
  artifactType: string;
  content: unknown;
  createdAt: number;
  isFinal?: boolean;
  markdown?: string;
  version: number;
};

type RunTab = "progress" | "sources" | "artifacts";

const tabs: Array<{
  value: RunTab;
  label: string;
  icon: typeof HourglassIcon;
  iconClassName: string;
}> = [
  {
    value: "progress",
    label: "Progress",
    icon: HourglassIcon,
    iconClassName: "text-[#a8cc7c]",
  },
  {
    value: "sources",
    label: "Sources",
    icon: GlobeSimpleIcon,
    iconClassName: "text-[#e394dc]",
  },
  {
    value: "artifacts",
    label: "Artifacts",
    icon: CubeIcon,
    iconClassName: "text-[#efb080]",
  },
];

export function LaunchRunTabs({
  stageRuns,
  buckets,
  latestMessages,
  sourceStatuses,
  artifacts,
}: {
  stageRuns: StageRun[];
  buckets: Map<string, ResearchBucket>;
  latestMessages: Partial<Record<ResearchBucket["source"], string>>;
  sourceStatuses: Partial<
    Record<
      ResearchBucket["source"],
      "waiting" | "running" | "completed" | "failed"
    >
  >;
  artifacts: Artifact[];
}) {
  const [activeTab, setActiveTab] = useState<RunTab>("progress");

  return (
    <section className="mb-6">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "border-border bg-card text-foreground shadow-sm shadow-black/15"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/35 hover:text-foreground/80",
              )}
            >
              <Icon
                size={16}
                weight="fill"
                className={cn("shrink-0", tab.iconClassName)}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-border/30 pt-5">
        {activeTab === "progress" ? (
          <WorkflowTimeline stageRuns={stageRuns} embedded />
        ) : null}
        {activeTab === "sources" ? (
          <ResearchSourcesGrid
            buckets={buckets}
            latestMessages={latestMessages}
            sourceStatuses={sourceStatuses}
            embedded
          />
        ) : null}
        {activeTab === "artifacts" ? (
          <RunArtifactsPanel artifacts={artifacts} embedded />
        ) : null}
      </div>
    </section>
  );
}
