"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/shared/app-header";
import { AppShell } from "@/components/shared/app-shell";
import { StartupBriefForm } from "@/features/startup-brief/components/startup-brief-form";
import { useStartupBrief } from "@/features/startup-brief/hooks/use-startup-brief";
import { getErrorMessage } from "@/lib/get-error-message";

export function StartupBriefScreen() {
  const router = useRouter();
  const createRunFromBrief = useMutation(api.runs.createFromBrief);
  const { brief, reset, submit, updateField } = useStartupBrief();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error(
        getErrorMessage(
          error,
          "Unable to create your research run right now. Please try again.",
        ),
      );
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader />
      <AppShell className="pb-20 pt-8">
        <header className="mb-10">
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            New startup
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Define your brief and start a launch research run.
          </p>
        </header>

        <StartupBriefForm
          brief={brief}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </AppShell>
    </>
  );
}
