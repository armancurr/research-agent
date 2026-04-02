"use client";

import { CaretDown, Clock } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LaunchMarkdownBody } from "@/features/launch-chat/components/launch-markdown";
import { LaunchPackageStructuredView } from "@/features/launch-chat/components/package-view/launch-package-structured-view";
import type { StreamPhase } from "@/features/launch-chat/hooks/use-launch-stream";
import { parsePackageFromMarkdown } from "@/features/launch-chat/lib/parse-package-markdown";
import {
  getArtifactDescription,
  getArtifactDisplayName,
} from "@/features/launch-chat/utils/artifact-display-names";
import { cn } from "@/lib/utils";
import type { LaunchPackage } from "@/types/launch";

function getPreviewMarkdown(markdown: string) {
  const previewLines = markdown
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, 12);

  return previewLines.join("\n\n");
}

export function LaunchPackagePreviewCard({
  artifactType,
  centerPlaceholder = false,
  phase,
  progressPct = 0,
  synthesis,
  structuredPackage,
}: {
  artifactType?: string;
  centerPlaceholder?: boolean;
  phase: StreamPhase;
  progressPct?: number;
  synthesis: string;
  structuredPackage?: LaunchPackage | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSynthesis = synthesis.trim().length > 0;
  const previewMarkdown = hasSynthesis ? getPreviewMarkdown(synthesis) : "";
  const isLoading = phase === "researching" || phase === "synthesizing";
  const isStopped = phase === "stopped";
  const artifactTitle = artifactType
    ? getArtifactDisplayName(artifactType)
    : "Launch package";
  const artifactDescription = artifactType
    ? getArtifactDescription(artifactType)
    : undefined;

  const resolvedPackage = useMemo(() => {
    if (structuredPackage) return structuredPackage;
    if (!isLoading && !isStopped && hasSynthesis) {
      return parsePackageFromMarkdown(synthesis);
    }
    return null;
  }, [structuredPackage, hasSynthesis, isLoading, isStopped, synthesis]);

  const showStructuredView = resolvedPackage !== null;
  const showMarkdownPreview = !showStructuredView && hasSynthesis;
  const shouldCenterPlaceholder =
    centerPlaceholder && !showStructuredView && !showMarkdownPreview;

  return (
    <section
      className={cn(
        "mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
        shouldCenterPlaceholder &&
          "flex min-h-full items-center justify-center",
      )}
    >
      <div className="w-full border-b border-border/40 pb-6">
        {showStructuredView ? (
          <LaunchPackageStructuredView
            pkg={resolvedPackage}
            markdown={synthesis}
          />
        ) : isLoading ? (
          <div className="px-4 py-6">
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex size-9 items-center justify-center rounded-full bg-muted/40">
                <Clock
                  size={16}
                  weight="fill"
                  className="text-muted-foreground/75"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground/80">
                <p className="font-medium text-foreground/85">
                  {artifactTitle}
                </p>
                {artifactDescription ? <p>{artifactDescription}</p> : null}
                <p className="text-xs text-muted-foreground/70">
                  Building this stage now.
                </p>
              </div>
              <div className="mt-5 w-full max-w-md">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="gap-0 overflow-hidden p-0 ring-1 ring-foreground/8">
            <div className="border-b border-border/30 px-4 py-3">
              {showMarkdownPreview ? (
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded((value) => !value)}
                  >
                    {expanded ? "Show preview" : "Show full"}
                    <CaretDown
                      size={14}
                      className={cn(
                        "transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </Button>
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                "px-4 py-6",
                !showMarkdownPreview &&
                  "flex min-h-[320px] flex-col items-center justify-center text-center",
              )}
            >
              {isStopped && artifactType ? (
                <div className="space-y-2 text-sm text-muted-foreground/80">
                  <p className="font-medium text-foreground/85">
                    {artifactTitle}
                  </p>
                  {artifactDescription ? <p>{artifactDescription}</p> : null}
                  <p className="text-xs text-muted-foreground/70">
                    Research stopped before this stage finished.
                  </p>
                </div>
              ) : showMarkdownPreview ? (
                <div className="border border-border/30 bg-background/20 px-4 py-4">
                  <div
                    className={cn(
                      "relative text-sm",
                      !expanded && "max-h-96 overflow-hidden",
                    )}
                  >
                    <LaunchMarkdownBody
                      markdown={expanded ? synthesis : previewMarkdown}
                    />
                    {!expanded ? (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/85 to-transparent" />
                    ) : null}
                  </div>
                </div>
              ) : artifactType ? (
                <div className="space-y-2 text-sm text-muted-foreground/80">
                  <p className="font-medium text-foreground/85">
                    {artifactTitle}
                  </p>
                  {artifactDescription ? <p>{artifactDescription}</p> : null}
                </div>
              ) : (
                <div className="border border-destructive/30 bg-destructive/[0.04] px-4 py-4 text-sm text-destructive/85">
                  Launch package preview unavailable for this run.
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
