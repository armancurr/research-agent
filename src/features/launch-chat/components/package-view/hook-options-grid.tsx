"use client";

export function HookOptionsGrid({ hooks }: { hooks: string[] }) {
  if (hooks.length === 0) return null;

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: "120ms", animationDuration: "500ms" }}
    >
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Hook options
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {hooks.map((hook, i) => (
          <div
            key={hook}
            className="rounded-lg border border-chart-5/15 bg-chart-5/[0.025] px-4 py-3.5 transition-colors hover:bg-chart-5/[0.04]"
          >
            <p className="mb-2 text-sm font-semibold text-chart-5/75">
              Hook {i + 1}
            </p>
            <p className="text-sm leading-7 text-foreground/85">{hook}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
