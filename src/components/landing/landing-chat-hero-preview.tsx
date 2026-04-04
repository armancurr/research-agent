"use client";

import { GearSix, GlobeSimple } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Artifact } from "@/features/launch-chat/components/artifact-row";
import { LaunchChatHeaderActions } from "@/features/launch-chat/components/launch-chat-header-actions";
import { LaunchRunTabs } from "@/features/launch-chat/components/launch-run-tabs";
import { LaunchPackageStructuredView } from "@/features/launch-chat/components/package-view/launch-package-structured-view";
import { StartupBriefCard } from "@/features/launch-chat/components/startup-brief-card";
import {
  sourceMeta,
  sourceOrder,
} from "@/features/launch-chat/constants/source-meta";
import type { ViewMode } from "@/features/launch-chat/hooks/use-view-mode";
import type {
  LaunchPackage,
  ResearchBucket,
  StartupBrief,
} from "@/types/launch";

const DEMO_BRIEF: StartupBrief = {
  companyName: "Fieldstone Press",
  productName: "Fieldstone",
  productDescription:
    "A curated mobile bookshop on wheels—membership, neighborhood stops, and community events for readers who want curation over algorithms.",
  targetAudience:
    "Lifelong readers aged 30–65 in small cities and rural areas seeking curation and community—not just convenience.",
  category:
    "Independent publishing, retail, community culture, subscription commerce, events.",
  launchGoal:
    "Launch the founding member waitlist in three pilot cities with local press and community events.",
  fundingStage: "Pre-seed",
  desiredOutcome:
    "Prove repeat visits and membership conversion in underserved markets before scaling the truck fleet.",
};

const DEMO_PACKAGE: LaunchPackage = {
  strategicAngle:
    "Fieldstone brings the independent bookshop back to neighborhoods that lost theirs\u2014curated picks, community events, and a human story no delivery box can replace.",
  launchScript: {
    headline: "The Bookshop That Comes to You.",
    hook: "Remember the quiet hum of your town\u2019s old bookstore? Fieldstone brings that feeling back\u2014on wheels, with curated shelves and membership perks that keep readers coming back.",
    bodyBeats: [
      "We park a converted vintage truck in underserved neighborhoods, rural towns, and mid-sized cities. Each stop is a curated pop-up: staff picks, local authors, and seasonal collections.",
      "Membership covers reserved drops, early access to events, and a quarterly book box\u2014so repeat visits feel like belonging, not a one-off sale.",
      "Prime delivery is fast; Fieldstone is restorative. We compete on trust, taste, and place\u2014not speed alone.",
    ],
    ctaOptions: [
      "Reserve your neighborhood stop\u2014join the waitlist",
      "Become a founding member\u2014early bird pricing",
    ],
  },
  hookOptions: [
    "Remember the quiet hum of your town\u2019s old bookstore? Fieldstone brings that feeling back\u2014on wheels, with curated shelves and membership perks that keep readers coming back.",
    "Amazon delivers boxes. Fieldstone delivers belonging. A curated mobile bookshop that parks in your neighborhood and stays until you\u2019ve found the perfect read.",
    "There are 3,000 fewer independent bookstores in America than there were in 2000. Fieldstone is building the next 3,000\u2014one neighborhood at a time.",
    "Your city lost its bookstore. We\u2019re bringing it back\u2014not in a strip mall, but in a converted vintage truck, staffed by readers who know your name.",
  ],
  researchSignals: [
    "Book desert: 30% of US counties lack a single bookstore within reasonable driving distance",
    "Membership model: subscription commerce in media verticals shows 40%+ retention at 12 months",
    "Community premium: consumers pay 15\u201325% more for locally curated vs algorithmic recommendations",
    "Mobile retail: pop-up and mobile retail saw 23% YoY growth post-pandemic in underserved markets",
    "BookTok fatigue: rising sentiment for slow reading and offline discovery in reader communities",
  ],
  contentStrategy: {
    positioning:
      "Fieldstone is the neighborhood bookshop reimagined for a delivery-first world\u2014mobile, membership-driven, and rooted in community trust over algorithmic convenience.",
    campaignMoves: [
      "Partner with 5 local authors in launch cities for co-branded pop-up events",
      "Run a \u2018What did your bookstore mean to you?\u2019 story campaign on social",
      "Launch founding member waitlist with early-bird pricing and city vote",
    ],
    channelPlan: [
      "Instagram and TikTok: weekly \u2018truck diary\u2019 video series showing stops, readers, and picks",
      "Newsletter: curated monthly reading list with member-only first editions",
      "Local press: pitch human-interest angle to city papers in launch markets",
    ],
  },
  fundraisingAngles: [
    "Market timing: indie retail renaissance meets subscription commerce\u2014Fieldstone sits at the intersection of two accelerating trends",
    "Unit economics: mobile format eliminates fixed lease costs while maintaining premium AOV through curated selection",
    "Community moat: each neighborhood stop builds local loyalty that no digital-first competitor can replicate",
    "Expansion playbook: asset-light model scales city-by-city with minimal capex per new market",
  ],
  nextMoves: [
    "Finalize first three launch cities based on book desert data and waitlist density",
    "Secure vintage truck conversion partner and design the branded mobile experience",
    "Open founding member waitlist with referral incentives and city unlock thresholds",
    "Build publisher relationships for exclusive early access and local author partnerships",
    "Plan grand opening weekend with local press, social coverage, and community event",
  ],
};

const DEMO_MARKDOWN = `## Strategic Angle

Fieldstone brings the independent bookshop back to neighborhoods that lost theirs\u2014curated picks, community events, and a human story no delivery box can replace.

---

## Launch Script
**Headline:** The Bookshop That Comes to You.

**Hook:** Remember the quiet hum of your town\u2019s old bookstore? Fieldstone brings that feeling back\u2014on wheels, with curated shelves and membership perks that keep readers coming back.

---

- We park a converted vintage truck in underserved neighborhoods, rural towns, and mid-sized cities. Each stop is a curated pop-up: staff picks, local authors, and seasonal collections.
- Membership covers reserved drops, early access to events, and a quarterly book box\u2014so repeat visits feel like belonging, not a one-off sale.
- Prime delivery is fast; Fieldstone is restorative. We compete on trust, taste, and place\u2014not speed alone.

**CTA Options:**
- Reserve your neighborhood stop\u2014join the waitlist
- Become a founding member\u2014early bird pricing`;

const SOURCE_ROWS: Record<
  ResearchBucket["source"],
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

function buildDemoBuckets(): Map<string, ResearchBucket> {
  const map = new Map<string, ResearchBucket>();
  for (const key of sourceOrder) {
    const meta = sourceMeta[key];
    const row = SOURCE_ROWS[key];
    map.set(key, {
      source: key,
      label: meta.label,
      query: row.subtitle,
      insights: [],
      results: row.titles.map((title, i) => ({
        title,
        url: `https://example.com/demo/${key}/${i}`,
      })),
    });
  }
  return map;
}

const DEMO_SOURCE_STATUSES: Partial<
  Record<
    ResearchBucket["source"],
    "waiting" | "running" | "completed" | "failed"
  >
> = {
  reddit: "completed",
  youtube: "completed",
  web: "completed",
};

export function LandingChatHeroPreview() {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const demoBuckets = useMemo(() => buildDemoBuckets(), []);

  const runTabsProps = {
    stageRuns: [],
    buckets: demoBuckets,
    latestMessages: {},
    sourceStatuses: DEMO_SOURCE_STATUSES,
    artifacts: [] as Artifact[],
  };

  return (
    <section
      aria-label="Demo preview of the research chat interface"
      className="relative flex w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-background text-start shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]"
    >
      <div className="flex min-h-0 flex-col min-h-[min(70vh,520px)] max-h-[70vh] lg:min-h-[min(72vh,720px)] lg:max-h-[min(72vh,720px)]">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <span className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <GlobeSimple
                size={18}
                weight="fill"
                className="shrink-0 text-primary"
                aria-hidden
              />
              Research Agent
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LaunchChatHeaderActions
              runStatus="completed"
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRerun={() => {}}
              onStop={() => {}}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="shrink-0"
              aria-label="Settings (demo)"
              onClick={(e) => e.preventDefault()}
            >
              <GearSix size={18} weight="fill" />
            </Button>
          </div>
        </header>

        {/* Mobile: unified column, single scroll (matches app below lg) */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 lg:hidden">
          <div className="mx-auto w-full max-w-5xl space-y-6 [&_section]:mb-0">
            <StartupBriefCard brief={DEMO_BRIEF} />
            <LaunchPackageStructuredView
              pkg={DEMO_PACKAGE}
              markdown={DEMO_MARKDOWN}
            />
            <LaunchRunTabs {...runTabsProps} />
          </div>
        </div>

        {/* Desktop: full-width split panes, independent scroll (matches launch-chat-screen split) */}
        <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:overflow-hidden">
          <div className="flex min-h-0 flex-col gap-6 overflow-y-auto overscroll-contain border-r border-border/30 px-5 py-5 sm:px-6">
            <StartupBriefCard brief={DEMO_BRIEF} />
            <LaunchRunTabs {...runTabsProps} sourcesSingleColumn />
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <LaunchPackageStructuredView
              pkg={DEMO_PACKAGE}
              markdown={DEMO_MARKDOWN}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
