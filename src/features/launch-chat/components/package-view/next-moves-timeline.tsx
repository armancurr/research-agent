"use client";

export function NextMovesTimeline({ moves }: { moves: string[] }) {
  if (moves.length === 0) return null;

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: "360ms", animationDuration: "500ms" }}
    >
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Next moves
      </p>
      <div className="space-y-3">
        {moves.map((move, i) => (
          <div
            key={move}
            className="flex items-baseline gap-2.5 text-sm leading-7 text-foreground/85"
          >
            <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
              {i + 1}.
            </span>
            <p className="min-w-0 flex-1">{move}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
