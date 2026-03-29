"use client";

import type { IconProps } from "@phosphor-icons/react";
import { CaretRight } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { StreamPhase } from "@/features/launch-chat/hooks/use-launch-stream";
import { cn } from "@/lib/utils";
import type { ResearchBucket } from "@/types/launch";

export function ResearchSourceCard({
  bucket,
  icon: Icon,
  iconClassName,
  label,
  latestMessage,
  phase,
  status,
}: {
  bucket?: ResearchBucket;
  icon: ComponentType<IconProps>;
  iconClassName: string;
  label: string;
  latestMessage?: string;
  phase: StreamPhase;
  status?: "waiting" | "running" | "completed" | "failed";
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isLoading =
    status === "running" || (!bucket && phase !== "done" && phase !== "error");

  const hasFoldableDetails =
    bucket &&
    (Boolean(latestMessage) ||
      bucket.insights.length > 0 ||
      (bucket.query && bucket.query.length > 0));

  return (
    <div
      className={cn(
        "max-w-full overflow-hidden rounded-lg border transition-all duration-500",
        bucket ? "border-border/70 bg-card/50" : "border-border/40 bg-card/20",
        isLoading && "source-scanning",
      )}
    >
      <div className="flex items-start gap-2.5 px-3 pt-2.5">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            bucket ? "bg-muted/35" : "bg-muted/20",
          )}
        >
          <Icon
            size={18}
            weight="fill"
            className={cn(iconClassName, !bucket && "opacity-45")}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground/85">
              {label}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              {status === "failed" ? (
                <Badge
                  variant="destructive"
                  className="px-1.5 py-0 text-xs font-normal"
                >
                  failed
                </Badge>
              ) : isLoading ? (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary/50" />
                  Scanning
                </span>
              ) : null}
            </div>
          </div>
          {bucket?.query ? (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/70">
              {bucket.query}
            </p>
          ) : latestMessage ? (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/70">
              {latestMessage}
            </p>
          ) : null}
        </div>
      </div>

      {hasFoldableDetails ? (
        <div className="mt-4 border-t border-border/30 pt-1">
          <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
            <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/20">
              <CaretRight
                size={10}
                weight="bold"
                className={cn(
                  "shrink-0 transition-transform duration-150",
                  detailsOpen && "rotate-90",
                )}
              />
              {detailsOpen ? "Hide details" : "Activity & insights"}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2.5 border-t border-border/20 px-3 pb-3 pt-2">
                {bucket.query ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      Query:
                    </span>{" "}
                    {bucket.query}
                  </p>
                ) : null}
                {latestMessage ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      Latest:
                    </span>{" "}
                    {latestMessage}
                  </p>
                ) : null}
                {bucket.insights.length > 0 ? (
                  <div className="space-y-1.5">
                    {bucket.insights.map((insight) => (
                      <p
                        key={`${bucket.source}-${insight.signal}`}
                        className="text-sm leading-relaxed text-foreground/70"
                      >
                        <span className="font-medium text-foreground/85">
                          {insight.signal}
                        </span>
                        {" — "}
                        {insight.evidence}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : !bucket && latestMessage ? (
        <div className="border-t border-border/30 px-3 py-2">
          <p className="line-clamp-1 text-xs text-muted-foreground/70">
            {latestMessage}
          </p>
        </div>
      ) : null}

      {bucket && bucket.results.length > 0 ? (
        <div
          className={cn(
            "flex max-w-full flex-wrap gap-1.5 px-3 pb-2.5",
            hasFoldableDetails ? "mt-3" : "mt-2",
          )}
        >
          {bucket.results.map((result) => (
            <a
              key={`${bucket.source}-${result.url}`}
              href={result.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block max-w-full truncate rounded border border-border/40 bg-muted/15 px-2 py-1 text-xs font-medium text-foreground/75 transition-colors hover:border-border hover:bg-muted/30 hover:text-foreground"
              title={result.title}
            >
              {result.title}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
