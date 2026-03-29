import Exa from "exa-js";
import { researchSchema } from "@/server/launch/schemas";
import type {
  CuratedEvidenceBundle,
  PlannedResearchSource,
  ResearchBucket,
  SourceInsight,
  SourceResult,
  StartupBrief,
} from "@/types/launch";

export const sourceConfigs = [
  {
    source: "reddit" as const,
    label: "Reddit",
    includeDomains: ["reddit.com"],
    buildQueries: (brief: StartupBrief) => [
      {
        focus: "customer pain",
        query: `${brief.productName} ${brief.targetAudience} ${brief.category} customer pain points, objections, complaints, buying triggers, desired outcomes`,
      },
      {
        focus: "controversy and objections",
        query: `${brief.productName} ${brief.targetAudience} category distrust, failed alternatives, backlash, skepticism, reddit threads`,
      },
    ],
  },
  {
    source: "youtube" as const,
    label: "YouTube",
    includeDomains: ["youtube.com"],
    buildQueries: (brief: StartupBrief) => [
      {
        focus: "launch hooks",
        query: `${brief.productName} ${brief.category} launch video hooks, product demos, viral titles, storytelling patterns, best performing launch framing`,
      },
      {
        focus: "creator storytelling",
        query: `${brief.category} founder story, product reveal, transformation hook, demo breakdown, youtube`,
      },
    ],
  },
  {
    source: "x" as const,
    label: "X",
    includeDomains: ["x.com", "twitter.com"],
    buildQueries: (brief: StartupBrief) => [
      {
        focus: "launch discourse",
        query: `${brief.productName} ${brief.targetAudience} founder launch thread, polarizing opinions, viral hooks, quote tweet debates, launch positioning`,
      },
      {
        focus: "fundraising and market framing",
        query: `${brief.productName} ${brief.category} market narrative, why now, founder hot take, x thread`,
      },
    ],
  },
  {
    source: "web" as const,
    label: "Web",
    includeDomains: undefined,
    buildQueries: (brief: StartupBrief) => [
      {
        focus: "competitor positioning",
        query: `${brief.productName} ${brief.category} competitors, positioning gaps, category framing, market narrative, launch messaging`,
      },
      {
        focus: "buyer language",
        query: `${brief.targetAudience} ${brief.category} buying criteria, objections, alternatives, use cases`,
      },
    ],
  },
];

export function getExaClient() {
  if (!process.env.EXA_API_KEY) {
    throw new Error("Missing EXA_API_KEY. Add it to your environment.");
  }

  return new Exa(process.env.EXA_API_KEY);
}

function normalizeResult(result: {
  title?: string | null;
  url?: string;
  publishedDate?: string;
  text?: string;
}) {
  return {
    title: result.title ?? "Untitled result",
    url: result.url ?? "",
    publishedDate: result.publishedDate,
    text: result.text?.slice(0, 420),
  } satisfies SourceResult;
}

export async function researchSource(
  exa: Exa,
  brief: StartupBrief,
  config: (typeof sourceConfigs)[number],
) {
  const plannedSource = buildResearchPlan(brief).find(
    (entry) => entry.source === config.source,
  );

  if (!plannedSource) {
    throw new Error(`Missing research plan for ${config.source}.`);
  }

  const curated = await runPlannedSourceResearch(
    exa,
    plannedSource,
    config.includeDomains,
  );

  return curated.curatedBucket;
}

export function buildResearchPlan(
  brief: StartupBrief,
): PlannedResearchSource[] {
  return sourceConfigs.map((config) => ({
    source: config.source,
    label: config.label,
    queries: config.buildQueries(brief),
  }));
}

function dedupeResults(results: SourceResult[]) {
  const seen = new Set<string>();
  const deduped: SourceResult[] = [];

  for (const result of results) {
    const key = `${result.url}::${result.title}`;

    if (!result.url || seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(result);
  }

  return deduped;
}

function dedupeInsights(insights: SourceInsight[]) {
  const seen = new Set<string>();
  const deduped: SourceInsight[] = [];

  for (const insight of insights) {
    const key = `${insight.signal}::${insight.evidence}`.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(insight);
  }

  return deduped;
}

export async function runPlannedSourceResearch(
  exa: Exa,
  plannedSource: PlannedResearchSource,
  includeDomains?: string[],
) {
  const queryRuns = [] as Array<{
    focus: string;
    insights: SourceInsight[];
    query: string;
    results: SourceResult[];
  }>;

  for (const plannedQuery of plannedSource.queries) {
    const response = await exa.search(plannedQuery.query, {
      type: "deep",
      numResults: 4,
      includeDomains,
      contents: {
        text: { maxCharacters: 3500 },
      },
      outputSchema: researchSchema,
    });

    const structured = response.output?.content as
      | { insights?: SourceInsight[] }
      | undefined;

    queryRuns.push({
      focus: plannedQuery.focus,
      insights: structured?.insights?.slice(0, 4) ?? [],
      query: plannedQuery.query,
      results: (
        (response.results ?? []) as Array<{
          title?: string | null;
          url?: string;
          publishedDate?: string;
          text?: string;
        }>
      ).map(normalizeResult),
    });
  }

  const curatedBucket = {
    source: plannedSource.source,
    label: plannedSource.label,
    query: plannedSource.queries
      .map((query) => `${query.focus}: ${query.query}`)
      .join("\n"),
    insights: dedupeInsights(
      queryRuns.flatMap((run) =>
        run.insights.map((insight) => ({
          ...insight,
          whyItMatters: `${run.focus}: ${insight.whyItMatters}`,
        })),
      ),
    ).slice(0, 6),
    results: dedupeResults(queryRuns.flatMap((run) => run.results)).slice(0, 8),
  } satisfies ResearchBucket;

  return {
    curatedBucket,
    queryRuns,
  };
}

export function curateEvidenceBundle(args: {
  plannedSources: PlannedResearchSource[];
  retrievalRuns: Array<{
    curatedBucket: ResearchBucket;
    queryRuns: Array<{
      focus: string;
      insights: SourceInsight[];
      query: string;
      results: SourceResult[];
    }>;
  }>;
}) {
  return {
    curatedResearch: args.retrievalRuns.map((entry) => entry.curatedBucket),
    plannedSources: args.plannedSources,
    retrievalSummary: args.retrievalRuns.flatMap((entry) =>
      entry.queryRuns.map((queryRun) => ({
        query: queryRun.query,
        resultCount: queryRun.results.length,
        source: entry.curatedBucket.source,
      })),
    ),
  } satisfies CuratedEvidenceBundle;
}
