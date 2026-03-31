"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <Card className="gap-0 p-6 shadow-md shadow-black/20 ring-1 ring-foreground/8 sm:p-8">
        {/*<p className="mb-4 text-sm font-medium text-muted-foreground">
          Startup brief
        </p>*/}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
            className="shrink-0"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : "Show full"}
            <CaretDown
              size={14}
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </Button>
        </div>

        <div className="relative mt-5">
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
            {previewFields.map((field) => (
              <div
                key={field.key}
                className="flex gap-2 text-sm leading-relaxed"
              >
                <span className="shrink-0 text-muted-foreground">
                  {field.label}:
                </span>
                <span className="min-w-0 text-foreground/85">
                  {brief[field.key]}
                </span>
              </div>
            ))}

            {expanded
              ? remainingFields.map((field) => (
                  <div
                    key={field.key}
                    className="flex gap-2 text-sm leading-relaxed"
                  >
                    <span className="shrink-0 text-muted-foreground">
                      {field.label}:
                    </span>
                    <span className="min-w-0 text-foreground/85">
                      {brief[field.key]}
                    </span>
                  </div>
                ))
              : null}
          </div>

          {!expanded ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card via-card/85 to-transparent" />
          ) : null}
        </div>

        {expanded ? (
          <div className="mt-6 border-t border-border/30 pt-6">
            <p className="text-sm font-medium text-muted-foreground">
              Product description
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-foreground/80">
              {brief.productDescription}
            </p>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
