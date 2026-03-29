"use client";

import { CaretRight, Package } from "@phosphor-icons/react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { JsonArtifactView } from "@/features/launch-chat/components/json-artifact-view";
import { LaunchMarkdownBody } from "@/features/launch-chat/components/launch-markdown";
import { formatTimestamp } from "@/features/launch-chat/utils/run-display";
import { cn } from "@/lib/utils";

type Artifact = {
  _id: string;
  artifactType: string;
  content: unknown;
  createdAt: number;
  isFinal?: boolean;
  markdown?: string;
  version: number;
};

function hasRenderableJson(content: unknown): boolean {
  if (content === undefined || content === null) return false;
  if (typeof content === "string") return content.trim().length > 0;
  if (typeof content === "object") {
    if (Array.isArray(content)) return content.length > 0;
    return Object.keys(content as object).length > 0;
  }
  return true;
}

function ArtifactRow({ artifact }: { artifact: Artifact }) {
  const [open, setOpen] = useState(false);
  const showMarkdown = Boolean(artifact.markdown?.trim());
  const showJson = hasRenderableJson(artifact.content);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full min-w-0 cursor-pointer items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/20",
          open && "bg-muted/10",
        )}
      >
        <CaretRight
          size={12}
          weight="bold"
          className={cn(
            "shrink-0 text-muted-foreground/50 transition-transform duration-150",
            open && "rotate-90",
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm capitalize text-foreground/80">
          {artifact.artifactType.replace(/_/g, " ")}
          <span className="ml-1.5 font-normal text-muted-foreground/50">
            v{artifact.version}
          </span>
          {artifact.isFinal ? (
            <span className="ml-1.5 text-xs font-normal text-primary/70">
              Final
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground/40">
          {formatTimestamp(artifact.createdAt)}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="max-w-full space-y-4 px-4 pb-4 pt-1">
          {showMarkdown ? (
            <div className="overflow-hidden rounded-lg border border-border/50 bg-card/40 px-4 py-4">
              <LaunchMarkdownBody markdown={artifact.markdown ?? ""} />
            </div>
          ) : null}
          {showJson ? (
            <div className="space-y-1.5">
              {showMarkdown ? (
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  Structured data
                </p>
              ) : null}
              <JsonArtifactView data={artifact.content} />
            </div>
          ) : null}
          {!showMarkdown && !showJson ? (
            <p className="text-sm text-muted-foreground/50">No content.</p>
          ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function RunArtifactsPanel({ artifacts }: { artifacts: Artifact[] }) {
  const [sectionOpen, setSectionOpen] = useState(true);

  if (artifacts.length === 0) return null;

  return (
    <section className="mb-6 max-w-full select-none">
      <Collapsible open={sectionOpen} onOpenChange={setSectionOpen}>
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 text-left">
          <CaretRight
            size={12}
            weight="bold"
            className={cn(
              "shrink-0 text-muted-foreground/50 transition-transform duration-150",
              sectionOpen && "rotate-90",
            )}
          />
          <Package size={16} className="shrink-0 text-muted-foreground/60" />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/40">
            Artifacts
          </h2>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[starting-style]:animate-in data-[starting-style]:fade-in-0">
          <div className="mt-3 max-w-full rounded-lg border border-border/50 divide-y divide-border/30">
            {artifacts.map((artifact) => (
              <ArtifactRow key={artifact._id} artifact={artifact} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
