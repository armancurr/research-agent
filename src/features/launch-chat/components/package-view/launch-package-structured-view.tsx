"use client";

import { ClipboardText } from "@phosphor-icons/react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LaunchMarkdownBody } from "@/features/launch-chat/components/launch-markdown";
import { ContentStrategyPanel } from "@/features/launch-chat/components/package-view/content-strategy-panel";
import { FundraisingAnglesGrid } from "@/features/launch-chat/components/package-view/fundraising-angles-grid";
import { HookOptionsGrid } from "@/features/launch-chat/components/package-view/hook-options-grid";
import { LaunchScriptPanel } from "@/features/launch-chat/components/package-view/launch-script-panel";
import { NextMovesTimeline } from "@/features/launch-chat/components/package-view/next-moves-timeline";
import { PackageHero } from "@/features/launch-chat/components/package-view/package-hero";
import { PackageSignalsTiles } from "@/features/launch-chat/components/package-view/package-signals-tiles";
import { cn } from "@/lib/utils";
import type { LaunchPackage } from "@/types/launch";

type ViewMode = "designed" | "raw";

export function LaunchPackageStructuredView({
  pkg,
  markdown,
}: {
  pkg: LaunchPackage;
  markdown: string;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("designed");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="gap-0 p-6 shadow-md shadow-black/20 ring-1 ring-foreground/8 sm:p-8">
      <div className="mb-6 flex items-center gap-1.5">
        <div className="flex rounded-md bg-muted/20 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("designed")}
            className={cn(
              "rounded-[3px] px-2.5 py-1 text-xs font-medium transition-all duration-150",
              viewMode === "designed"
                ? "bg-muted/50 text-foreground/90 shadow-sm"
                : "text-muted-foreground/55 hover:text-foreground/70",
            )}
          >
            Designed
          </button>
          <button
            type="button"
            onClick={() => setViewMode("raw")}
            className={cn(
              "rounded-[3px] px-2.5 py-1 text-xs font-medium transition-all duration-150",
              viewMode === "raw"
                ? "bg-muted/50 text-foreground/90 shadow-sm"
                : "text-muted-foreground/55 hover:text-foreground/70",
            )}
          >
            Raw text
          </button>
        </div>

        {viewMode === "raw" ? (
          <button
            type="button"
            onClick={handleCopy}
            className="ml-1 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground/55 transition-colors hover:text-foreground/70"
          >
            <ClipboardText size={13} weight="bold" />
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      {viewMode === "raw" ? (
        <LaunchMarkdownBody markdown={markdown} />
      ) : (
        <div className="space-y-10">
          <PackageHero angle={pkg.strategicAngle} />
          <LaunchScriptPanel script={pkg.launchScript} />
          <HookOptionsGrid hooks={pkg.hookOptions} />
          <PackageSignalsTiles signals={pkg.researchSignals} />
          <ContentStrategyPanel strategy={pkg.contentStrategy} />
          <FundraisingAnglesGrid angles={pkg.fundraisingAngles} />
          <NextMovesTimeline moves={pkg.nextMoves} />
        </div>
      )}
    </Card>
  );
}
