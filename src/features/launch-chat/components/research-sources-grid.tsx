"use client";

import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ResearchSourceCard } from "@/features/launch-chat/components/research-source-card";
import {
  sourceMeta,
  sourceOrder,
} from "@/features/launch-chat/constants/source-meta";
import { cn } from "@/lib/utils";
import type { ResearchBucket } from "@/types/launch";

export function ResearchSourcesGrid({
  buckets,
  latestMessages,
  sourceStatuses,
}: {
  buckets: Map<string, ResearchBucket>;
  latestMessages: Partial<Record<ResearchBucket["source"], string>>;
  sourceStatuses: Partial<
    Record<
      ResearchBucket["source"],
      "waiting" | "running" | "completed" | "failed"
    >
  >;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-6 max-w-full select-none">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 text-left">
          <CaretRight
            size={12}
            weight="bold"
            className={cn(
              "shrink-0 text-muted-foreground/50 transition-transform duration-150",
              open && "rotate-90",
            )}
          />
          <MagnifyingGlass
            size={16}
            weight="fill"
            className="shrink-0 text-[#e394dc]"
          />
          <h2 className="text-sm font-medium text-foreground/85">Sources</h2>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[starting-style]:animate-in data-[starting-style]:fade-in-0">
          <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
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
                  status={sourceStatuses[sourceKey]}
                />
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
