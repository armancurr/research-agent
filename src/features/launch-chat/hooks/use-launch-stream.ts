"use client";

import type { Id } from "@convex/_generated/dataModel";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { parseSseChunks } from "@/features/launch-chat/utils/sse";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ResearchBucket } from "@/types/launch";

export type StreamPhase =
  | "idle"
  | "researching"
  | "synthesizing"
  | "done"
  | "error";

export function useLaunchStream() {
  const abortRef = useRef<AbortController | null>(null);
  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [buckets, setBuckets] = useState<Map<string, ResearchBucket>>(
    new Map(),
  );
  const [synthesis, setSynthesis] = useState("");
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(
    (args: { research: ResearchBucket[]; synthesisMarkdown: string }) => {
      setBuckets(
        new Map(args.research.map((bucket) => [bucket.source, bucket])),
      );
      setSynthesis(args.synthesisMarkdown);
      setError(null);
      setPhase(args.synthesisMarkdown ? "done" : "idle");
    },
    [],
  );

  const startStream = useCallback(async (args: { runId: Id<"runs"> }) => {
    setPhase("researching");
    setBuckets(new Map());
    setSynthesis("");
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/launch-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: args.runId }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parsed = parseSseChunks(buffer);
        buffer = parsed.remainder;

        for (const event of parsed.events) {
          switch (event.type) {
            case "research":
              setBuckets((prev) =>
                new Map(prev).set(event.data.source, event.data),
              );
              break;
            case "research_complete":
              setPhase("synthesizing");
              break;
            case "token":
              setSynthesis((prev) => prev + event.data.text);
              break;
            case "done":
              setPhase("done");
              break;
            case "error":
              setError(event.data.message);
              setPhase("error");
              toast.error(event.data.message || "Workflow failed.");
              break;
            case "research_error":
              setError(event.data.message);
              toast.error(event.data.message || "A research source failed.");
              break;
          }
        }
      }

      setPhase((current) => (current === "synthesizing" ? "done" : current));
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }

      const message = getErrorMessage(err, "Stream failed");
      setError(message);
      setPhase("error");
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    buckets,
    error,
    hydrate,
    isLive: phase === "researching" || phase === "synthesizing",
    phase,
    startStream,
    synthesis,
  };
}
