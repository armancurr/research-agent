import { MagnifyingGlass } from "@phosphor-icons/react";
import { ResearchSourceCard } from "@/features/launch-chat/components/research-source-card";
import {
  sourceMeta,
  sourceOrder,
} from "@/features/launch-chat/constants/source-meta";
import type { StreamPhase } from "@/features/launch-chat/hooks/use-launch-stream";
import type { ResearchBucket } from "@/types/launch";

export function ResearchSourcesGrid({
  buckets,
  latestMessages,
  phase,
  sourceStatuses,
}: {
  buckets: Map<string, ResearchBucket>;
  latestMessages: Partial<Record<ResearchBucket["source"], string>>;
  phase: StreamPhase;
  sourceStatuses: Partial<
    Record<
      ResearchBucket["source"],
      "waiting" | "running" | "completed" | "failed"
    >
  >;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <MagnifyingGlass
          size={14}
          weight="bold"
          className="text-muted-foreground/70"
        />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Sources
        </h2>
        <span className="ml-auto text-[11px] tabular-nums text-muted-foreground/50">
          {buckets.size}/{sourceOrder.length}
        </span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {sourceOrder.map((sourceKey) => {
          const meta = sourceMeta[sourceKey];

          return (
            <ResearchSourceCard
              key={sourceKey}
              bucket={buckets.get(sourceKey)}
              icon={meta.icon}
              iconClassName={meta.iconClassName}
              label={meta.label}
              latestMessage={latestMessages[sourceKey]}
              phase={phase}
              status={sourceStatuses[sourceKey]}
            />
          );
        })}
      </div>
    </section>
  );
}
