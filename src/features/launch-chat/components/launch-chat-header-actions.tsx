"use client";

import {
  ArrowUUpLeftIcon,
  CheckIcon,
  Columns,
  Rows,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/features/launch-chat/hooks/use-view-mode";
import { cn } from "@/lib/utils";

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  return (
    <div className="flex h-7 items-stretch rounded-lg border border-border/60 bg-muted/25 p-0.5">
      <button
        type="button"
        aria-pressed={mode === "unified"}
        onClick={() => onChange("unified")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-150",
          mode === "unified"
            ? "bg-background text-foreground/90 shadow-sm shadow-black/20"
            : "text-muted-foreground/60 hover:text-muted-foreground/80",
        )}
      >
        <Rows size={13} weight={mode === "unified" ? "fill" : "regular"} />
        <span className="hidden sm:inline">Unified</span>
      </button>
      <button
        type="button"
        aria-pressed={mode === "split"}
        onClick={() => onChange("split")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-150",
          mode === "split"
            ? "bg-background text-foreground/90 shadow-sm shadow-black/20"
            : "text-muted-foreground/60 hover:text-muted-foreground/80",
        )}
      >
        <Columns size={13} weight={mode === "split" ? "fill" : "regular"} />
        <span className="hidden sm:inline">Split</span>
      </button>
    </div>
  );
}

export function LaunchChatHeaderActions({
  runStatus,
  viewMode,
  onViewModeChange,
  onRerun,
  onApprove,
}: {
  runStatus: string;
  viewMode: ViewMode;
  onViewModeChange: (next: ViewMode) => void;
  onRerun: () => void;
  onApprove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
      {runStatus !== "generating" ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onRerun}
        >
          <ArrowUUpLeftIcon size={16} weight="bold" aria-hidden />
          Restart
        </Button>
      ) : null}
      {runStatus === "completed" ? (
        <Button size="sm" className="gap-1.5" onClick={onApprove}>
          <CheckIcon size={16} weight="bold" aria-hidden />
          Approve
        </Button>
      ) : null}
    </div>
  );
}
