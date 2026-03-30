"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StartupBrief } from "@/types/launch";

const briefFields: Array<{
  key: keyof StartupBrief;
  label: string;
}> = [
  { key: "companyName", label: "Company" },
  { key: "productName", label: "Product" },
  { key: "targetAudience", label: "Audience" },
  { key: "category", label: "Category" },
  { key: "launchGoal", label: "Launch goal" },
  { key: "fundingStage", label: "Funding stage" },
  { key: "desiredOutcome", label: "Desired outcome" },
];

export function StartupBriefCard({ brief }: { brief: StartupBrief }) {
  const [expanded, setExpanded] = useState(false);
  const previewFields = briefFields.slice(0, 4);
  const remainingFields = briefFields.slice(4);

  return (
    <section className="mb-6">
      <div className="border-b border-border/40 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-xl font-medium text-foreground/95">
              {brief.productName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {brief.companyName} in {brief.category}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : "Show full brief"}
            <CaretDown
              size={14}
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </Button>
        </div>

        <div className="mt-4 border border-border/30 bg-background/20 px-4 py-4">
          <div className="relative">
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
              {previewFields.map((field) => (
                <div
                  key={field.key}
                  className="flex gap-2 text-sm leading-relaxed"
                >
                  <span className="text-muted-foreground">{field.label}:</span>
                  <span className="text-foreground/85">{brief[field.key]}</span>
                </div>
              ))}

              {expanded
                ? remainingFields.map((field) => (
                    <div
                      key={field.key}
                      className="flex gap-2 text-sm leading-relaxed"
                    >
                      <span className="text-muted-foreground">
                        {field.label}:
                      </span>
                      <span className="text-foreground/85">
                        {brief[field.key]}
                      </span>
                    </div>
                  ))
                : null}
            </div>

            {!expanded ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background via-background/85 to-transparent" />
            ) : null}
          </div>

          {expanded ? (
            <div className="mt-4 border-t border-border/30 pt-4">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-foreground/80">
                {brief.productDescription}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
