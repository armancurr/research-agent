"use client";

import { ArrowRight } from "@phosphor-icons/react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldCard } from "@/features/startup-brief/components/field-card";
import { FundingStageSelect } from "@/features/startup-brief/components/funding-stage-select";
import { SECTIONS_WITH_FIELDS } from "@/features/startup-brief/constants/form-fields";
import type { StartupBrief } from "@/types/launch";

export function StartupBriefForm({
  brief,
  isSubmitting = false,
  onFieldChange,
  onSubmit,
}: {
  brief: StartupBrief;
  isSubmitting?: boolean;
  onFieldChange: <K extends keyof StartupBrief>(
    key: K,
    value: StartupBrief[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="w-full pb-8">
      <div className="space-y-10">
        {SECTIONS_WITH_FIELDS.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="scroll-mt-20 space-y-10"
          >
            {section.fields.map((field) => {
              const isFilled = brief[field.key].trim().length > 0;

              return (
                <FieldCard
                  key={field.key}
                  id={`field-${field.key}`}
                  label={field.label}
                  hint={field.hint}
                  stepNumber={field.stepNumber}
                  isFilled={isFilled}
                  required={field.required}
                  animationDelay={field.stepNumber * 60}
                >
                  {field.type === "textarea" ? (
                    <Textarea
                      className="min-h-[100px]"
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={brief[field.key]}
                    />
                  ) : field.type === "select" ? (
                    <FundingStageSelect
                      onChange={(value) => onFieldChange(field.key, value)}
                      value={brief[field.key]}
                    />
                  ) : (
                    <Input
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={brief[field.key]}
                    />
                  )}
                </FieldCard>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex justify-end border-t border-border/80 bg-background/95 py-4 backdrop-blur-sm">
        <Button
          size="lg"
          type="submit"
          className="gap-2 px-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Run..." : "Generate Report"}
          <ArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </form>
  );
}
