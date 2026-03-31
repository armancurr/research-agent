"use client";

export function PackageHero({ angle }: { angle: string }) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: "0ms", animationDuration: "500ms" }}
    >
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Strategic angle
      </p>
      <div className="relative border-l-2 border-accent/40 pl-5">
        <div className="pointer-events-none absolute -inset-y-2 -left-px -right-4 rounded-r-md bg-accent/[0.02]" />
        <p className="relative text-lg leading-[1.7] text-foreground/95 sm:text-xl sm:leading-[1.7]">
          {angle}
        </p>
      </div>
    </div>
  );
}
