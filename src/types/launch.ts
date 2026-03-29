export type StartupBrief = {
  companyName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  category: string;
  launchGoal: string;
  fundingStage: string;
  desiredOutcome: string;
};

export type SourceInsight = {
  signal: string;
  evidence: string;
  whyItMatters: string;
};

export type SourceResult = {
  title: string;
  url: string;
  publishedDate?: string;
  text?: string;
};

export type ResearchBucket = {
  source: "reddit" | "youtube" | "x" | "web";
  label: string;
  query: string;
  insights: SourceInsight[];
  results: SourceResult[];
};

export type PlannedResearchQuery = {
  focus: string;
  query: string;
};

export type PlannedResearchSource = {
  source: ResearchBucket["source"];
  label: string;
  queries: PlannedResearchQuery[];
};

export type CuratedEvidenceBundle = {
  curatedResearch: ResearchBucket[];
  plannedSources: PlannedResearchSource[];
  retrievalSummary: Array<{
    query: string;
    resultCount: number;
    source: ResearchBucket["source"];
  }>;
};

export type SynthesisNotes = {
  audienceSignals: string[];
  evidenceMap: string[];
  strongestAngle: string;
  strategicTensions: string[];
};

export type HookCandidate = {
  copy: string;
  label: string;
  rationale: string;
};

export type QaReport = {
  pass: boolean;
  rewriteInstructions: string[];
  scores: {
    actionability: number;
    evidenceGrounding: number;
    fundraising: number;
    hooks: number;
    script: number;
    strategicAngle: number;
  };
  verdict: string;
  weaknesses: string[];
};

export type LaunchPackage = {
  strategicAngle: string;
  researchSignals: string[];
  hookOptions: string[];
  launchScript: {
    headline: string;
    hook: string;
    bodyBeats: string[];
    ctaOptions: string[];
  };
  contentStrategy: {
    positioning: string;
    campaignMoves: string[];
    channelPlan: string[];
  };
  fundraisingAngles: string[];
  nextMoves: string[];
};

export type LaunchPackageResponse = {
  brief: StartupBrief;
  research: ResearchBucket[];
  package: LaunchPackage;
};
