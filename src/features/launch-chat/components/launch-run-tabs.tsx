"use client";

import { GlobeSimpleIcon, Timer } from "@phosphor-icons/react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Artifact } from "@/features/launch-chat/components/artifact-row";
import { PipelineView } from "@/features/launch-chat/components/pipeline-view";
import { ResearchSourcesGrid } from "@/features/launch-chat/components/research-sources-grid";
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

type RunTab = "pipeline" | "sources";

const tabs: Array<{
  value: RunTab;
  label: string;
  icon: typeof Timer;
}> = [
  {
    value: "pipeline",
    label: "Pipeline",
    icon: Timer,
  },
  {
    value: "sources",
    label: "Sources",
    icon: GlobeSimpleIcon,
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
  const [activeTab, setActiveTab] = useState<RunTab>("pipeline");

  return (
    <section className="mb-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as RunTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                <Icon
                  size={16}
                  weight={isActive ? "fill" : "regular"}
                  className="shrink-0"
                />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent
          value="pipeline"
          className="mt-5 border-t border-border/30 pt-5"
        >
          <PipelineView stageRuns={stageRuns} artifacts={artifacts} />
        </TabsContent>
        <TabsContent
          value="sources"
          className="mt-5 border-t border-border/30 pt-5"
        >
          <ResearchSourcesGrid
            buckets={buckets}
            latestMessages={latestMessages}
            sourceStatuses={sourceStatuses}
            embedded
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
