import type {
  HookCandidate,
  LaunchPackage,
  ResearchBucket,
  StartupBrief,
  SynthesisNotes,
} from "@/types/launch";

function buildResearchDigest(brief: StartupBrief, research: ResearchBucket[]) {
  return JSON.stringify(
    {
      brief,
      research: research.map((bucket) => ({
        source: bucket.label,
        query: bucket.query,
        insights: bucket.insights,
        results: bucket.results.map((result) => ({
          title: result.title,
          url: result.url,
          text: result.text,
        })),
      })),
    },
    null,
    2,
  );
}

export function buildDraftPackagePrompt(
  brief: StartupBrief,
  research: ResearchBucket[],
  stageContext?: {
    hookCandidates?: HookCandidate[];
    synthesisNotes?: SynthesisNotes;
  },
) {
  return `You are generating a launch package for a startup.

Startup brief:
${JSON.stringify(brief, null, 2)}

Research digest:
${buildResearchDigest(brief, research)}

Synthesis notes:
${JSON.stringify(stageContext?.synthesisNotes ?? null, null, 2)}

Hook candidates:
${JSON.stringify(stageContext?.hookCandidates ?? [], null, 2)}

Return strict JSON only with this exact shape:
{
  "strategicAngle": "string",
  "researchSignals": ["string"],
  "hookOptions": ["string"],
  "launchScript": {
    "headline": "string",
    "hook": "string",
    "bodyBeats": ["string"],
    "ctaOptions": ["string"]
  },
  "contentStrategy": {
    "positioning": "string",
    "campaignMoves": ["string"],
    "channelPlan": ["string"]
  },
  "fundraisingAngles": ["string"],
  "nextMoves": ["string"]
}

Requirements:
- Make it feel like a viral launch strategist, not a generic chatbot.
- Use the research evidence.
- Hooks must be punchy, differentiated, and usable as real launch copy.
- Script should be founder-video ready and sound like a human with conviction wrote it.
- Fundraising angles should help the startup explain why this matters now, why this team wins, and why the market is ready.
- Campaign moves should feel executable in the next 7-14 days.
- Avoid vague claims, startup cliches, and generic AI phrasing.
- Prefer stronger framing, sharper contrast, and specific language over safe marketing copy.
- If the research reveals distrust, controversy, or a failed default behavior in the market, use that tension inside the positioning.
- Keep every line concrete.`;
}

export function buildSynthesisNotesPrompt(
  brief: StartupBrief,
  research: ResearchBucket[],
) {
  return `You are the synthesis agent in a launch strategy pipeline.

Startup brief:
${JSON.stringify(brief, null, 2)}

Research digest:
${buildResearchDigest(brief, research)}

Return strict JSON only with this exact shape:
{
  "strongestAngle": "string",
  "strategicTensions": ["string"],
  "audienceSignals": ["string"],
  "evidenceMap": ["string"]
}

Requirements:
- Capture the strongest strategic angle in one repeatable sentence.
- Strategic tensions should identify conflicts, distrust, or market defaults worth attacking.
- Audience signals should describe what the target audience actually wants or resists.
- Evidence map should connect concrete findings to campaign implications.
- Avoid generic consultant phrasing.`;
}

export function buildHookCandidatesPrompt(
  brief: StartupBrief,
  research: ResearchBucket[],
  synthesisNotes: SynthesisNotes,
) {
  return `You are the hook agent in a launch strategy pipeline.

Startup brief:
${JSON.stringify(brief, null, 2)}

Research digest:
${buildResearchDigest(brief, research)}

Synthesis notes:
${JSON.stringify(synthesisNotes, null, 2)}

Return strict JSON only with this exact shape:
{
  "hooks": [
    {
      "label": "string",
      "copy": "string",
      "rationale": "string"
    }
  ]
}

Requirements:
- Return exactly 5 hooks.
- Each hook should be short enough to use as real launch copy.
- Labels should be memorable and tactical, not generic.
- Rationales should explain why the hook should work based on the research.
- Prefer contrast, tension, and specificity over safe marketing copy.`;
}

export function buildQaCheckPrompt(
  brief: StartupBrief,
  research: ResearchBucket[],
  draft: LaunchPackage,
) {
  return `You are the QA and weapons-check agent for a launch package pipeline.

Startup brief:
${JSON.stringify(brief, null, 2)}

Research digest:
${buildResearchDigest(brief, research)}

Draft package:
${JSON.stringify(draft, null, 2)}

Return strict JSON only with this exact shape:
{
  "pass": true,
  "verdict": "string",
  "scores": {
    "strategicAngle": 0,
    "hooks": 0,
    "script": 0,
    "fundraising": 0,
    "actionability": 0,
    "evidenceGrounding": 0
  },
  "weaknesses": ["string"],
  "rewriteInstructions": ["string"]
}

Scoring rules:
- Scores must be integers from 1 to 10.
- Set pass to true only if every category is at least 7 and at least two categories are 8 or above.

QA rules:
- Penalize generic copy.
- Penalize weak or forgettable hooks.
- Penalize strategy that is not grounded in the research.
- Penalize vague next moves.
- Penalize fundraising angles that sound like ad copy.
- Rewrite instructions should be precise enough for a rewrite agent to act on.`;
}

export function buildRefinePackagePrompt(
  brief: StartupBrief,
  research: ResearchBucket[],
  draft: LaunchPackage,
) {
  return `You are the weapons-check stage of a launch script pipeline.

Startup brief:
${JSON.stringify(brief, null, 2)}

Research digest:
${buildResearchDigest(brief, research)}

Draft package:
${JSON.stringify(draft, null, 2)}

Revise the package so every line is sharper, more novel, and more emotionally precise.
Cut generic language. Increase specificity. Keep it founder-friendly.

Checklist:
- remove filler and consultant-sounding phrases
- make hooks feel more memorable and more polarizing where useful
- make the strategic angle easier to repeat out loud
- tighten script beats so they feel spoken, not written for a document
- make campaign moves more concrete and time-bound
- make fundraising angles sound like investor narrative, not ad copy

Return strict JSON only using the exact same shape as the draft.`;
}

export function buildMarkdownSynthesisPrompt(
  brief: StartupBrief,
  research: ResearchBucket[],
) {
  return `You are an elite viral launch strategist writing a launch package for a startup.

Startup brief:
${JSON.stringify(brief, null, 2)}

Research digest:
${buildResearchDigest(brief, research)}

Write a polished, founder-ready launch package in markdown. Be concise: short paragraphs, no filler, no repetition. Prefer density over length.

Use the following structure with these exact headings:

## Strategic Angle
One tight paragraph (3–5 sentences max): the core positioning insight that makes this launch cut through noise.

## Research Signals
4–6 bullets only — strongest patterns, pain points, or hooks from the research. Cite sources briefly.

## Hook Options
3–5 hooks. Format each as a ### heading line (e.g. ### Hook 1 — Short label) followed by one or two sentences of copy. Do **not** use triple-backtick fenced code blocks anywhere in this document. Do **not** wrap hook text in backticks.

## Launch Script
**Headline:** One line.
**Hook:** 2 short sentences max for the opening of a video or post.
Bullet 3–5 body beats — very short, spoken phrases.
**CTA Options:** 2–3 bullets.

## Content Strategy
**Positioning:** 2–3 sentences.
Then 5–7 bullets: concrete campaign moves for the next 7–14 days (channel + action in one line each).

## Fundraising Angles
5–7 bullets: investor-ready narratives (why now, team, market).

## Next Moves
Numbered list: exactly 5 items for the next 48 hours (one line each).

Formatting (rich Markdown — required):
- Section titles exactly as above (##). Use ### only for individual hooks under Hook Options.
- Put a thematic break on its own line between every major section: a line containing only \`---\` (Markdown horizontal rule) after each ## block and before the next ##, so topics are visually separated when rendered.
- Use **bold** and *italic* for skim; use bullets and numbered lists; use blockquotes sparingly for one standout line.
- Never use fenced code blocks (triple backticks). Real copy belongs in normal paragraphs, lists, or ### hook subsections — not in code fences.

Requirements:
- Sound like a human strategist with conviction, not a chatbot.
- Use the research evidence — cite specific findings, threads, or gaps where it matters.
- Hooks must be punchy and usable as real copy; keep each hook brief.
- Avoid vague claims, startup cliches, and generic AI phrasing.
- Prefer sharper contrast and specific language over safe marketing copy.
- If the research reveals distrust, controversy, or failed defaults in the market, use that tension.
- Keep every line concrete; cut redundancy.
- Do NOT output JSON. Output only markdown.`;
}

export function buildRefinementAnswerPrompt(args: {
  brief: StartupBrief;
  research: ResearchBucket[];
  launchPackage: LaunchPackage;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  question: string;
}) {
  return `You are continuing a founder strategy session.

Startup brief:
${JSON.stringify(args.brief, null, 2)}

Research digest:
${buildResearchDigest(args.brief, args.research)}

Existing launch package:
${JSON.stringify(args.launchPackage, null, 2)}

Conversation history:
${JSON.stringify(args.history, null, 2)}

Founder question:
${args.question}

Answer like a high-end viral launch strategist. Use the existing package and research. Be concise, practical, and sharp. Write in rich Markdown: headings, lists, **bold** / *italic*, blockquotes when useful. Use short sections and bullets when useful. Do not output JSON.`;
}
