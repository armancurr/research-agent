"use client";

import { Copy, DownloadSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/get-error-message";

export function RunExportActions({
  markdown,
  runId,
}: {
  markdown: string;
  runId: string;
}) {
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleCopy() {
    if (!markdown) {
      toast.error("No final markdown is available yet.");
      return;
    }

    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Final markdown copied.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to copy markdown."));
    } finally {
      setIsCopying(false);
    }
  }

  function handleDownload() {
    if (!markdown) {
      toast.error("No final markdown is available yet.");
      return;
    }

    setIsDownloading(true);

    try {
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `launch-run-${runId}.md`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Markdown export downloaded.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to download markdown."));
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={handleCopy} disabled={isCopying}>
        <Copy size={16} />
        {isCopying ? "Copying..." : "Copy Markdown"}
      </Button>
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <DownloadSimple size={16} />
        {isDownloading ? "Preparing..." : "Download Markdown"}
      </Button>
    </div>
  );
}
