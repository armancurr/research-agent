"use client";

import type { LaunchPackage } from "@/types/launch";

export function ContentStrategyPanel({
  strategy,
}: {
  strategy: LaunchPackage["contentStrategy"];
}) {
  const hasPositioning = Boolean(strategy.positioning);
  const hasCampaignMoves = strategy.campaignMoves.length > 0;
  const hasChannelPlan = strategy.channelPlan.length > 0;

  if (!hasPositioning && !hasCampaignMoves && !hasChannelPlan) return null;

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both space-y-6"
      style={{ animationDelay: "240ms", animationDuration: "500ms" }}
    >
      <p className="text-sm font-medium text-muted-foreground">
        Content strategy
      </p>

      {hasPositioning ? (
        <div className="border-l-2 border-chart-2/30 bg-chart-2/[0.025] px-5 py-4">
          <p className="mb-1.5 text-sm font-semibold text-chart-2/70">
            Positioning
          </p>
          <p className="text-sm leading-7 text-foreground/90">
            {strategy.positioning}
          </p>
        </div>
      ) : null}

      {hasCampaignMoves ? (
        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground/55">
            Campaign Moves
          </p>
          <div className="space-y-1.5">
            {strategy.campaignMoves.map((move) => (
              <div
                key={move}
                className="flex gap-3 rounded-md bg-muted/[0.08] px-3.5 py-2.5 text-sm leading-relaxed text-foreground/85"
              >
                <span className="mt-px shrink-0 text-chart-2/45">&#x203A;</span>
                <p className="min-w-0 flex-1">{move}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {hasChannelPlan ? (
        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground/55">
            Channel Plan
          </p>
          <div className="space-y-1.5">
            {strategy.channelPlan.map((channel) => (
              <div
                key={channel}
                className="flex gap-3 rounded-md bg-muted/[0.08] px-3.5 py-2.5 text-sm leading-relaxed text-foreground/85"
              >
                <span className="mt-px shrink-0 text-chart-2/45">&#x203A;</span>
                <p className="min-w-0 flex-1">{channel}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
