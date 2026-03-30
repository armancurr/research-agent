"use client";

import {
  ArrowUUpLeftIcon,
  CaretDown,
  CaretRight,
  CheckIcon,
  Globe,
  MagnifyingGlass,
  Package,
  Plus,
  SignOut,
  Timer,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LaunchMarkdownBody } from "@/features/launch-chat/components/launch-markdown";
import {
  sourceMeta,
  sourceOrder,
} from "@/features/launch-chat/constants/source-meta";
import { cn } from "@/lib/utils";

const DEMO_MARKDOWN = `## Strategic Angle

Fieldstone brings the independent bookshop back to neighborhoods that lost theirs—curated picks, community events, and a human story no delivery box can replace.

## Launch Script

**Headline:** The Bookshop That Comes to You.

**Hook:** Remember the quiet hum of your town's old bookstore? Fieldstone brings that feeling back—on wheels, with curated shelves and membership perks that keep readers coming back.

- We park a converted vintage truck in underserved neighborhoods, rural towns, and mid-sized cities. Each stop is a curated pop-up: staff picks, local authors, and seasonal collections.
- Membership covers reserved drops, early access to events, and a quarterly book box—so repeat visits feel like belonging, not a one-off sale.
- Prime delivery is fast; Fieldstone is restorative. We compete on trust, taste, and place—not speed alone.`;

const PIPELINE_LABELS = [
  "Intake",
  "Research Planning",
  "Source Retrieval",
  "Evidence Curation",
  "Synthesis Agent",
  "Hook Agent",
  "Package Draft",
  "QA Check",
  "Finalized",
] as const;

const SOURCE_ROWS: Record<
  (typeof sourceOrder)[number],
  { subtitle: string; titles: string[] }
> = {
  reddit: {
    subtitle: "customer pain, community threads…",
    titles: [
      "Why indie bookstores still matter in 2026",
      "r/smallbusiness — pop-up retail lessons",
      "How r/books talks about Amazon vs local shops",
      "Book deserts and what readers actually miss",
      "AMA: running a mobile retail book pop-up",
    ],
  },
  youtube: {
    subtitle: "category demos, booktube…",
    titles: [
      "Pros and Cons of Substack for Writers",
      "Bookshop.org vs Amazon: what readers choose",
      "Libro.fm vs Audible — indie audio deep dive",
      "BookTube tour: smallest towns, biggest TBRs",
      "Retail math for niche subscription boxes",
    ],
  },
  x: {
    subtitle: "launch buzz, reader sentiment…",
    titles: [
      "Thread: what killed your local bookstore?",
      "Readers who want curation, not algorithms",
      "Indie publishers betting on IRL community again",
      "BookTok fatigue vs slow reading clubs",
      "Quote-tweet storm on “same-day delivery isn’t culture”",
    ],
  },
  web: {
    subtitle: "competitors, membership models…",
    titles: [
      "Why you should switch to Libro.fm",
      "Independent bookseller associations — trends",
      "Bookshop.org affiliate program overview 2026",
      "Case study: mobile retail in rural counties",
      "Membership commerce benchmarks for media brands",
    ],
  },
};

export function LandingChatHeroPreview() {
  const total = PIPELINE_LABELS.length;
  const focusIdx = total - 1;

  return (
    <section
      aria-label="Demo preview of the research chat interface"
      className="relative w-full overflow-hidden rounded-[10px] border border-border/50 bg-background text-start shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]"
    >
      <div
        className={cn(
          /* Taller than 16:9 so the preview has more vertical room */
          "aspect-[16/10] w-full overflow-y-auto overscroll-contain",
          "[scrollbar-width:thin]",
          "[scrollbar-color:rgba(255,255,255,0.12)_transparent]",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-white/12",
          "[&::-webkit-scrollbar-track]:bg-transparent",
        )}
      >
        <div className="flex min-h-full min-w-0 flex-col bg-background">
          {/* App header (static) */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <span className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                <Globe
                  size={18}
                  weight="duotone"
                  className="shrink-0 text-primary"
                />
                Research Agent
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/70 bg-transparent px-2.5 text-xs font-medium text-foreground">
                <Plus size={16} weight="bold" aria-hidden />
                New startup
              </span>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={(e) => e.preventDefault()}
              >
                <ArrowUUpLeftIcon size={16} weight="bold" aria-hidden />
                Restart
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={(e) => e.preventDefault()}
              >
                <CheckIcon size={16} weight="bold" aria-hidden />
                Approve
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Sign out"
                onClick={(e) => e.preventDefault()}
              >
                <SignOut size={18} />
              </Button>
            </div>
          </header>

          <div className="border-t border-border/30">
            <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-5 sm:py-5 lg:px-8">
              {/* StartupBriefCard */}
              <section className="mb-5">
                <div className="border-b border-border/40 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-lg font-medium text-foreground/95 sm:text-xl">
                        Fieldstone
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Fieldstone Press in independent publishing, retail,
                        community culture, subscription commerce, events.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                      Show full brief
                      <CaretDown size={14} className="shrink-0" />
                    </span>
                  </div>
                  <div className="mt-3 border border-border/30 bg-background/20 px-3 py-3 sm:px-4 sm:py-4">
                    <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="flex gap-2 text-sm leading-relaxed">
                        <span className="text-muted-foreground">Company:</span>
                        <span className="text-foreground/85">
                          Fieldstone Press
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm leading-relaxed">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="text-foreground/85">Fieldstone</span>
                      </div>
                      <div className="flex gap-2 text-sm leading-relaxed sm:col-span-2 xl:col-span-1">
                        <span className="text-muted-foreground">Audience:</span>
                        <span className="text-foreground/85">
                          Lifelong readers aged 30–65 in small cities and rural
                          areas seeking curation and community—not just
                          convenience.
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm leading-relaxed sm:col-span-2 xl:col-span-3">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="text-foreground/85">
                          Independent publishing, retail, community culture,
                          subscription commerce, events.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* WorkflowTimeline (expanded, completed run) */}
              <section className="mb-5 select-none">
                <div className="flex w-full items-center gap-2 rounded-md py-1.5 text-left">
                  <CaretRight
                    size={12}
                    weight="bold"
                    className="shrink-0 rotate-90 text-muted-foreground/50"
                  />
                  <Timer
                    size={16}
                    weight="fill"
                    className="shrink-0 text-[#a8cc7c]"
                  />
                  <h2 className="text-sm font-medium text-foreground/85">
                    Progress
                  </h2>
                </div>
                <div className="relative mt-2 px-1.5">
                  <div className="relative flex h-5 items-center">
                    <div className="absolute inset-x-0 h-[1.5px] rounded-full bg-border/30" />
                    <div
                      className="absolute h-[1.5px] rounded-full bg-primary/50"
                      style={{ width: "100%" }}
                    />
                    {PIPELINE_LABELS.map((_, i) => {
                      const left = total <= 1 ? 50 : (i / (total - 1)) * 100;
                      const isLast = i === focusIdx;
                      return (
                        <div
                          key={PIPELINE_LABELS[i]}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${left}%` }}
                        >
                          <div
                            className={cn(
                              "rounded-full transition-all duration-500",
                              isLast
                                ? "h-3 w-3 bg-chart-2"
                                : "h-2 w-2 bg-primary/70",
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="flex-1 rounded-lg px-2 py-2 opacity-55 sm:px-3 sm:py-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold tabular-nums leading-none text-muted-foreground/30">
                        {focusIdx}.
                      </span>
                      <span className="text-[13px] font-medium leading-snug text-muted-foreground/50">
                        QA Check
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-muted-foreground/30">
                      33s
                    </p>
                  </div>
                  <div className="flex-1 rounded-lg bg-muted/30 px-2 py-2 sm:px-3 sm:py-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold tabular-nums leading-none text-primary">
                        {focusIdx + 1}.
                      </span>
                      <span className="text-[13px] font-medium leading-snug text-foreground/90">
                        Finalized
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-chart-2/70">0s</p>
                  </div>
                  <div className="flex-1" />
                </div>
              </section>

              {/* LaunchPackagePreviewCard */}
              <section className="mb-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                <div className="border-b border-border/40 pb-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                      Show full package
                      <CaretDown size={14} className="shrink-0" />
                    </span>
                  </div>
                  <div className="border border-border/30 bg-background/20 px-3 py-3 sm:px-4 sm:py-4">
                    <LaunchMarkdownBody markdown={DEMO_MARKDOWN} />
                  </div>
                </div>
              </section>

              {/* ResearchSourcesGrid */}
              <section className="mb-5 max-w-full select-none">
                <div className="flex w-full items-center gap-2 rounded-md py-1.5 text-left">
                  <CaretRight
                    size={12}
                    weight="bold"
                    className="shrink-0 rotate-90 text-muted-foreground/50"
                  />
                  <MagnifyingGlass
                    size={16}
                    weight="fill"
                    className="shrink-0 text-[#e394dc]"
                  />
                  <h2 className="text-sm font-medium text-foreground/85">
                    Sources
                  </h2>
                </div>
                <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
                  {sourceOrder.map((key) => {
                    const meta = sourceMeta[key];
                    const Icon = meta.icon;
                    const row = SOURCE_ROWS[key];
                    return (
                      <div
                        key={key}
                        className="h-full max-w-full overflow-hidden border-b border-border/30 py-2.5 sm:py-3"
                      >
                        <div className="flex items-start gap-2.5 px-0.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/35">
                            <Icon
                              size={18}
                              weight="fill"
                              className={meta.iconClassName}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-foreground/85">
                              {meta.label}
                            </span>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/70">
                              {row.subtitle}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 px-0.5">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <CaretRight
                              size={10}
                              weight="bold"
                              className="shrink-0"
                            />
                            Activity & insights
                          </span>
                        </div>
                        <div className="mt-2 flex max-w-full flex-wrap gap-1.5 px-0.5 pb-0.5">
                          {row.titles.map((title) => (
                            <span
                              key={title}
                              className="inline-block max-w-full truncate text-xs font-medium text-foreground/75"
                              title={title}
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* RunArtifactsPanel (collapsed header only) */}
              <section className="mb-2 max-w-full select-none">
                <div className="flex w-full items-center gap-2 rounded-md py-1.5 text-left">
                  <CaretRight
                    size={12}
                    weight="bold"
                    className="shrink-0 text-muted-foreground/50"
                  />
                  <Package
                    size={16}
                    weight="fill"
                    className="shrink-0 text-[#efb080]"
                  />
                  <h2 className="text-sm font-medium text-foreground/85">
                    Artifacts
                  </h2>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
