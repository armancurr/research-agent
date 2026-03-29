"use client";

import { Check } from "@phosphor-icons/react";
import {
  getSectionProgress,
  getTotalFilled,
  SECTIONS_WITH_FIELDS,
  TOTAL_FIELDS,
} from "@/features/startup-brief/constants/form-fields";
import type { StartupBrief } from "@/types/launch";

export function VerticalProgressRail({
  brief,
  activeSection,
  onSectionClick,
}: {
  brief: StartupBrief;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}) {
  const totalFilled = getTotalFilled(brief);
  const overallPct = (totalFilled / TOTAL_FIELDS) * 100;

  return (
    <nav className="sticky top-8 w-9 shrink-0" aria-label="Brief sections">
      <div className="relative mx-auto flex h-[min(48vh,20rem)] w-px flex-col justify-between">
        {/* Track */}
        <div
          className="pointer-events-none absolute top-2 bottom-2 left-0 w-px bg-border"
          aria-hidden
        />
        {/* Fill — solid accent, no gradient */}
        <div
          className="pointer-events-none absolute top-2 bottom-2 left-0 w-px overflow-hidden"
          aria-hidden
        >
          <div
            className="w-px rounded-full bg-accent transition-[height] duration-500 ease-out"
            style={{ height: `${overallPct}%` }}
          />
        </div>

        {SECTIONS_WITH_FIELDS.map((section) => {
          const { filled, total } = getSectionProgress(section.id, brief);
          const isComplete = filled === total;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionClick(section.id)}
              title={`${section.label} (${filled}/${total})`}
              className="relative z-10 -ml-[13px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-muted-foreground transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border bg-background transition-colors duration-200 ${
                  isComplete
                    ? "border-accent/50 text-accent"
                    : isActive
                      ? "border-foreground/25 text-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                {isComplete ? (
                  <Check size={12} weight="bold" />
                ) : (
                  section.number
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] tabular-nums text-muted-foreground">
        {totalFilled}/{TOTAL_FIELDS}
      </p>
    </nav>
  );
}
