"use client";

import { ArrowUUpLeftIcon, CheckIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function LaunchChatHeaderActions({
  runStatus,
  onRerun,
  onApprove,
}: {
  runStatus: string;
  onRerun: () => void;
  onApprove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {runStatus !== "generating" ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onRerun}
        >
          <ArrowUUpLeftIcon size={16} weight="bold" aria-hidden />
          Restart
        </Button>
      ) : null}
      {runStatus === "completed" ? (
        <Button size="sm" className="gap-1.5" onClick={onApprove}>
          <CheckIcon size={16} weight="bold" aria-hidden />
          Approve
        </Button>
      ) : null}
    </div>
  );
}
