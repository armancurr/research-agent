import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
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
  const isLoading =
    status === "running" || (!bucket && phase !== "done" && phase !== "error");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border transition-all duration-500",
        bucket
          ? "border-border/70 bg-card/50 animate-in fade-in slide-in-from-bottom-2 duration-500"
          : "border-border/40 bg-card/20",
        isLoading && "source-scanning",
      )}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
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
          <span className="text-sm font-medium text-foreground/85">
            {label}
          </span>
        </div>
        {status === "failed" ? (
          <Badge
            variant="destructive"
            className="px-1.5 py-0 text-[10px] font-normal"
          >
            failed
          </Badge>
        ) : isLoading ? (
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary/50" />
            Scanning
          </span>
        ) : bucket ? (
          <Badge
            variant="secondary"
            className="px-1.5 py-0 text-[10px] font-normal"
          >
            {bucket.results.length} found
          </Badge>
        ) : null}
      </div>

      {bucket ? (
        <div className="space-y-2 border-t border-border/40 px-3 py-2.5">
          <p className="text-[11px] leading-[1.6] text-muted-foreground">
            <span className="font-medium text-foreground/80">Query:</span>{" "}
            {bucket.query}
          </p>
          {latestMessage ? (
            <p className="text-[11px] leading-[1.6] text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Latest event:
              </span>{" "}
              {latestMessage}
            </p>
          ) : null}
          {bucket.insights.length > 0 ? (
            <div className="space-y-1">
              {bucket.insights.map((insight) => (
                <p
                  key={`${bucket.source}-${insight.signal}`}
                  className="text-[12px] leading-[1.6] text-foreground/70"
                >
                  <span className="font-medium text-foreground/85">
                    {insight.signal}
                  </span>
                  {" — "}
                  {insight.evidence}
                  {insight.whyItMatters ? (
                    <>
                      {" "}
                      <span className="text-muted-foreground">
                        ({insight.whyItMatters})
                      </span>
                    </>
                  ) : null}
                </p>
              ))}
            </div>
          ) : null}

          {bucket.results.length > 0 ? (
            <div className="grid gap-2 pt-0.5">
              {bucket.results.map((result) => (
                <a
                  key={`${bucket.source}-${result.url}`}
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-border/50 bg-muted/20 px-2 py-2 text-[11px] text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 hover:text-foreground"
                  title={result.title}
                >
                  <p className="font-medium text-foreground/85">
                    {result.title}
                  </p>
                  {result.publishedDate ? (
                    <p className="mt-1 text-[10px] text-muted-foreground/75">
                      {result.publishedDate}
                    </p>
                  ) : null}
                  {result.text ? (
                    <p className="mt-1 line-clamp-4 leading-relaxed">
                      {result.text}
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : latestMessage ? (
        <div className="space-y-2 border-t border-border/40 px-3 py-2.5">
          <p className="text-[11px] leading-[1.6] text-muted-foreground">
            <span className="font-medium text-foreground/80">
              Latest event:
            </span>{" "}
            {latestMessage}
          </p>
        </div>
      ) : null}
    </div>
  );
}
