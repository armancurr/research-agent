"use client";

function inferTitle(text: string): [string | null, string] {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 0 && colonIdx < 60) {
    return [text.slice(0, colonIdx).trim(), text.slice(colonIdx + 1).trim()];
  }
  return [null, text];
}

export function FundraisingAnglesGrid({ angles }: { angles: string[] }) {
  if (angles.length === 0) return null;

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: "300ms", animationDuration: "500ms" }}
    >
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Fundraising angles
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {angles.map((angle) => {
          const [title, body] = inferTitle(angle);
          return (
            <div
              key={angle}
              className="rounded-lg border border-chart-3/15 bg-chart-3/[0.025] px-4 py-3.5 transition-colors hover:bg-chart-3/[0.04]"
            >
              {title ? (
                <p className="mb-1.5 text-sm font-semibold text-chart-3/65">
                  {title}
                </p>
              ) : null}
              <p className="text-sm leading-7 text-foreground/85">{body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
