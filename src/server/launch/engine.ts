import { generateText, streamText } from "ai";
import {
  buildDraftPackagePrompt,
  buildHookCandidatesPrompt,
  buildMarkdownSynthesisPrompt,
  buildQaCheckPrompt,
  buildRefinementAnswerPrompt,
  buildRefinePackagePrompt,
  buildSynthesisNotesPrompt,
} from "@/server/launch/prompts";
import { getProviders } from "@/server/launch/providers";
import {
  buildResearchPlan,
  curateEvidenceBundle,
  getExaClient,
  researchSource,
  runPlannedSourceResearch,
  sourceConfigs,
} from "@/server/launch/research";
import type {
  CuratedEvidenceBundle,
  HookCandidate,
  LaunchPackage,
  LaunchPackageResponse,
  PlannedResearchSource,
  QaReport,
  ResearchBucket,
  StartupBrief,
  SynthesisNotes,
} from "@/types/launch";

function stripCodeFences(input: string) {
  return input
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function parseJsonObject<T>(input: string): T {
  const cleaned = stripCodeFences(input);

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }

    throw new Error("Model did not return valid JSON.");
  }
}

async function generateTextWithFallback(args: {
  prompt: string;
  temperature: number;
}) {
  const providers = getProviders();
  const failures: string[] = [];

  for (const provider of providers) {
    try {
      const result = await generateText({
        model: provider.model,
        temperature: args.temperature,
        prompt: args.prompt,
      });

      return result.text.trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      failures.push(`${provider.label}: ${message}`);
    }
  }

  throw new Error(`All text model providers failed. ${failures.join(" | ")}`);
}

export async function generateDraftPackage(
  brief: StartupBrief,
  research: ResearchBucket[],
  stageContext?: {
    hookCandidates?: HookCandidate[];
    synthesisNotes?: SynthesisNotes;
  },
) {
  const text = await generateTextWithFallback({
    prompt: buildDraftPackagePrompt(brief, research, stageContext),
    temperature: 0.4,
  });

  return parseJsonObject<LaunchPackage>(text);
}

export async function refinePackageWithWeaponsCheck(
  brief: StartupBrief,
  research: ResearchBucket[],
  draft: LaunchPackage,
) {
  const text = await generateTextWithFallback({
    prompt: buildRefinePackagePrompt(brief, research, draft),
    temperature: 0.35,
  });

  return parseJsonObject<LaunchPackage>(text);
}

export async function generateSynthesisNotes(
  brief: StartupBrief,
  research: ResearchBucket[],
) {
  const text = await generateTextWithFallback({
    prompt: buildSynthesisNotesPrompt(brief, research),
    temperature: 0.3,
  });

  return parseJsonObject<SynthesisNotes>(text);
}

export async function generateHookCandidates(
  brief: StartupBrief,
  research: ResearchBucket[],
  synthesisNotes: SynthesisNotes,
) {
  const text = await generateTextWithFallback({
    prompt: buildHookCandidatesPrompt(brief, research, synthesisNotes),
    temperature: 0.55,
  });

  return parseJsonObject<{ hooks: HookCandidate[] }>(text).hooks;
}

export async function qaCheckPackage(
  brief: StartupBrief,
  research: ResearchBucket[],
  draft: LaunchPackage,
) {
  const text = await generateTextWithFallback({
    prompt: buildQaCheckPrompt(brief, research, draft),
    temperature: 0.2,
  });

  return parseJsonObject<QaReport>(text);
}

export function streamTextWithFallback(args: {
  prompt: string;
  temperature: number;
}) {
  const providers = getProviders();
  const provider = providers[0];

  return streamText({
    model: provider.model,
    temperature: args.temperature,
    prompt: args.prompt,
  });
}

export {
  buildMarkdownSynthesisPrompt,
  buildResearchPlan,
  curateEvidenceBundle,
  getExaClient,
  researchSource,
  runPlannedSourceResearch,
  sourceConfigs,
};

export function formatLaunchPackageMarkdown(pkg: LaunchPackage) {
  const hooks = pkg.hookOptions.length
    ? pkg.hookOptions
        .map((hook: string, index: number) => `### Hook ${index + 1}\n${hook}`)
        .join("\n\n")
    : "No hooks generated.";
  const bodyBeats = pkg.launchScript.bodyBeats
    .map((beat: string) => `- ${beat}`)
    .join("\n");
  const ctas = pkg.launchScript.ctaOptions
    .map((cta: string) => `- ${cta}`)
    .join("\n");
  const campaignMoves = pkg.contentStrategy.campaignMoves
    .map((move: string) => `- ${move}`)
    .join("\n");
  const channels = pkg.contentStrategy.channelPlan
    .map((channel: string) => `- ${channel}`)
    .join("\n");
  const fundraising = pkg.fundraisingAngles
    .map((angle: string) => `- ${angle}`)
    .join("\n");
  const nextMoves = pkg.nextMoves
    .map((move: string, index: number) => `${index + 1}. ${move}`)
    .join("\n");

  return `## Strategic Angle
${pkg.strategicAngle}

---

## Research Signals
${pkg.researchSignals.map((signal) => `- ${signal}`).join("\n")}

---

## Hook Options
${hooks}

---

## Launch Script
**Headline:** ${pkg.launchScript.headline}

**Hook:** ${pkg.launchScript.hook}

${bodyBeats}

**CTA Options:**
${ctas}

---

## Content Strategy
**Positioning:** ${pkg.contentStrategy.positioning}

### Campaign Moves
${campaignMoves}

### Channel Plan
${channels}

---

## Fundraising Angles
${fundraising}

---

## Next Moves
${nextMoves}`;
}

export async function collectCuratedResearch(brief: StartupBrief): Promise<{
  curatedResearch: ResearchBucket[];
  evidenceBundle: CuratedEvidenceBundle;
  plannedSources: PlannedResearchSource[];
}> {
  const exa = getExaClient();
  const plannedSources = buildResearchPlan(brief);
  const retrievalRuns = await Promise.all(
    plannedSources.map((plannedSource: PlannedResearchSource) => {
      const config = sourceConfigs.find(
        (entry: (typeof sourceConfigs)[number]) =>
          entry.source === plannedSource.source,
      );

      if (!config) {
        throw new Error(`Missing source config for ${plannedSource.source}.`);
      }

      return runPlannedSourceResearch(
        exa,
        plannedSource,
        config.includeDomains,
      );
    }),
  );
  const evidenceBundle = curateEvidenceBundle({
    plannedSources,
    retrievalRuns,
  });

  return {
    curatedResearch: evidenceBundle.curatedResearch,
    evidenceBundle,
    plannedSources,
  };
}

export async function buildLaunchPackage(
  brief: StartupBrief,
): Promise<LaunchPackageResponse> {
  const { curatedResearch: research } = await collectCuratedResearch(brief);

  const synthesisNotes = await generateSynthesisNotes(brief, research);
  const hookCandidates = await generateHookCandidates(
    brief,
    research,
    synthesisNotes,
  );
  const draft = await generateDraftPackage(brief, research, {
    hookCandidates,
    synthesisNotes,
  });
  const refinedPackage = await refinePackageWithWeaponsCheck(
    brief,
    research,
    draft,
  );

  return {
    brief,
    research,
    package: refinedPackage,
  };
}

export async function refineLaunchPackage(args: {
  brief: StartupBrief;
  research: ResearchBucket[];
  launchPackage: LaunchPackage;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  question: string;
}) {
  return generateTextWithFallback({
    prompt: buildRefinementAnswerPrompt(args),
    temperature: 0.45,
  });
}
