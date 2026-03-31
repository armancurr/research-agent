"use client";

import type { LaunchPackage } from "@/types/launch";

export function LaunchScriptPanel({
  script,
}: {
  script: LaunchPackage["launchScript"];
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both space-y-6"
      style={{ animationDelay: "60ms", animationDuration: "500ms" }}
    >
      <p className="text-sm font-medium text-muted-foreground">Launch script</p>

      {script.headline ? (
        <div className="rounded-lg bg-card/60 px-5 py-4 ring-1 ring-foreground/[0.06]">
          <p className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
            {script.headline}
          </p>
        </div>
      ) : null}

      {script.hook ? (
        <div className="border-l-2 border-primary/30 bg-primary/[0.025] px-5 py-4">
          <p className="text-sm leading-7 text-foreground/90 italic">
            &ldquo;{script.hook}&rdquo;
          </p>
        </div>
      ) : null}

      {script.bodyBeats.length > 0 ? (
        <div className="space-y-2.5 pl-0.5">
          {script.bodyBeats.map((beat, i) => (
            <div
              key={beat}
              className="flex gap-3 text-sm leading-7 text-foreground/85"
            >
              <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-[10px] font-semibold tabular-nums text-muted-foreground/60">
                {i + 1}
              </span>
              <p className="min-w-0 flex-1">{beat}</p>
            </div>
          ))}
        </div>
      ) : null}

      {script.ctaOptions.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground/55">
            Call to Action
          </p>
          <div className="flex flex-wrap gap-2">
            {script.ctaOptions.map((cta) => (
              <div
                key={cta}
                className="rounded-md border border-primary/20 bg-primary/[0.04] px-3.5 py-2 text-sm leading-snug text-foreground/90"
              >
                {cta}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
