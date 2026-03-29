"use client";

import { Check, Copy, Sparkle } from "@phosphor-icons/react";
import { useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { StreamPhase } from "@/features/launch-chat/hooks/use-launch-stream";
import { cn } from "@/lib/utils";

/** Fenced blocks from the model read as "double code"; render as soft callouts with body typography. */
const synthesisMarkdownComponents: Components = {
  hr() {
    return (
      <hr className="my-10 w-full border-0 border-t border-transparent bg-transparent bg-gradient-to-r from-transparent via-border/55 to-transparent" />
    );
  },
  pre({ children }) {
    return (
      <div className="my-3 rounded-lg border border-border/45 bg-muted/25 p-4 text-sm leading-relaxed text-foreground/90 [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:font-sans [&>code]:text-inherit">
        {children}
      </div>
    );
  },
  code({ className, children, ...rest }) {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code
          className={cn(
            "block whitespace-pre-wrap font-sans text-[0.95em] leading-relaxed",
            className,
          )}
          {...rest}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[0.85em] font-medium text-accent"
        {...rest}
      >
        {children}
      </code>
    );
  },
};

export function SynthesisPanel({
  phase,
  synthesis,
}: {
  phase: StreamPhase;
  synthesis: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(synthesis);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (phase !== "synthesizing" && phase !== "done") {
    return null;
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={14} weight="fill" className="text-primary" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Launch Package
          </h2>
        </div>
        {phase === "done" && synthesis ? (
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground animate-in fade-in duration-300"
          >
            {copied ? (
              <>
                <Check size={12} weight="bold" />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </Button>
        ) : null}
      </div>

      <div className="rounded-lg border border-border/70 bg-card/50 px-5 py-5">
        <div className="prose prose-invert prose-sm max-w-none text-foreground prose-headings:mb-3 prose-headings:mt-6 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground first:prose-headings:mt-0 prose-p:my-2 prose-p:leading-7 prose-p:text-foreground/90 prose-strong:text-foreground prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1 prose-li:text-foreground/90 prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-base prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 prose-hr:my-0 prose-hr:border-0 prose-hr:bg-transparent">
          <ReactMarkdown components={synthesisMarkdownComponents}>
            {synthesis}
          </ReactMarkdown>
          {phase === "synthesizing" ? (
            <span className="streaming-cursor ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-primary" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
