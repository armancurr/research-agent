"use client";

import { CaretDown, Clock } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LaunchMarkdownBody } from "@/features/launch-chat/components/launch-markdown";
import { LaunchPackageStructuredView } from "@/features/launch-chat/components/package-view/launch-package-structured-view";
import type { StreamPhase } from "@/features/launch-chat/hooks/use-launch-stream";
import { parsePackageFromMarkdown } from "@/features/launch-chat/lib/parse-package-markdown";
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
  phase,
  synthesis,
  structuredPackage,
}: {
  phase: StreamPhase;
  synthesis: string;
  structuredPackage?: LaunchPackage | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSynthesis = synthesis.trim().length > 0;
  const previewMarkdown = hasSynthesis ? getPreviewMarkdown(synthesis) : "";
  const isLoading = phase === "researching" || phase === "synthesizing";
  const isDone = phase === "done";

  const resolvedPackage = useMemo(() => {
    if (structuredPackage) return structuredPackage;
    if (isDone && hasSynthesis) return parsePackageFromMarkdown(synthesis);
    return null;
  }, [structuredPackage, isDone, hasSynthesis, synthesis]);

  const showStructuredView = isDone && resolvedPackage !== null && hasSynthesis;

  return (
    <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <div className="border-b border-border/40 pb-6">
        {showStructuredView ? (
          <LaunchPackageStructuredView
            pkg={resolvedPackage}
            markdown={synthesis}
          />
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between gap-3">
              {hasSynthesis ? (
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
              ) : null}
            </div>

            {isLoading ? (
              <div className="border border-border/30 rounded-lg bg-muted/10 px-4 py-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground/80">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted/40">
                    <Clock
                      size={16}
                      weight="fill"
                      className="text-muted-foreground/75"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground/85">
                      Building launch package
                    </p>
                    <p>Just a minute.</p>
                  </div>
                </div>
              </div>
            ) : hasSynthesis ? (
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
            ) : (
              <div className="border border-destructive/30 bg-destructive/[0.04] px-4 py-4 text-sm text-destructive/85">
                Launch package preview unavailable for this run.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
