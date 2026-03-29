"use client";

import { api } from "@convex/_generated/api";
import { Rocket } from "@phosphor-icons/react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/shared/app-shell";
import { UserNav } from "@/components/shared/user-nav";
import { StartupBriefForm } from "@/features/startup-brief/components/startup-brief-form";
import { VerticalProgressRail } from "@/features/startup-brief/components/vertical-progress-rail";
import {
  getTotalFilled,
  SECTIONS_WITH_FIELDS,
  TOTAL_FIELDS,
} from "@/features/startup-brief/constants/form-fields";
import { useStartupBrief } from "@/features/startup-brief/hooks/use-startup-brief";
import { getErrorMessage } from "@/lib/get-error-message";

export function StartupBriefScreen() {
  const router = useRouter();
  const createRunFromBrief = useMutation(api.runs.createFromBrief);
  const { brief, reset, submit, updateField } = useStartupBrief();
  const [activeSection, setActiveSection] = useState(
    SECTIONS_WITH_FIELDS[0].id,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalFilled = getTotalFilled(brief);
  const overallProgress = (totalFilled / TOTAL_FIELDS) * 100;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const nextBrief = submit();
      const { runId } = await createRunFromBrief({
        brief: nextBrief,
      });
      reset();
      router.push(`/chat/${runId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create launch run."));
      setIsSubmitting(false);
    }
  }

  function scrollToSection(sectionId: string) {
    setActiveSection(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const updateActiveFromScroll = useCallback(() => {
    for (const section of [...SECTIONS_WITH_FIELDS].reverse()) {
      const el = document.getElementById(`section-${section.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", updateActiveFromScroll);
  }, [updateActiveFromScroll]);

  return (
    <AppShell className="pb-20 pt-6">
      <header className="mb-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <Rocket size={16} weight="duotone" className="text-[#4c9df3]" />
              <h1 className="text-sm font-semibold text-foreground">Brief</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Create a startup, persist the brief, and open a saved launch run.
            </p>
          </div>
          <UserNav />
        </div>
        {/* Mobile: horizontal progress (no side rail) */}
        <div className="mt-4 sm:hidden">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Progress</span>
            <span className="tabular-nums text-foreground">
              {totalFilled}/{TOTAL_FIELDS}
            </span>
          </div>
          <div className="h-px overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex min-w-0 gap-6 lg:gap-8">
        <div className="hidden shrink-0 sm:block">
          <VerticalProgressRail
            brief={brief}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
        </div>

        <div className="min-w-0 flex-1">
          <StartupBriefForm
            brief={brief}
            onFieldChange={updateField}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </AppShell>
  );
}
