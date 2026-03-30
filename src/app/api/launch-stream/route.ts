import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import {
  buildResearchPlan,
  curateEvidenceBundle,
  formatLaunchPackageMarkdown,
  generateDraftPackage,
  generateHookCandidates,
  generateSynthesisNotes,
  getExaClient,
  qaCheckPackage,
  refinePackageWithWeaponsCheck,
  runPlannedSourceResearch,
  selectHookCandidates,
  sourceConfigs,
  validateLaunchPackage,
} from "@/server/launch/engine";
import { classifyLaunchError, withRetry } from "@/server/launch/errors";
import {
  logLaunchError,
  logLaunchInfo,
  logLaunchWarn,
} from "@/server/launch/observability";
import type {
  ResearchBucket,
  SourceInsight,
  SourceResult,
} from "@/types/launch";

export const runtime = "nodejs";
export const maxDuration = 120;

function sseEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { runId?: string };
  const runId = body.runId as Id<"runs"> | undefined;

  if (!runId) {
    return Response.json({ error: "Missing run ID." }, { status: 400 });
  }

  const token = await convexAuthNextjsToken();

  if (!token) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const runData = await fetchQuery(api.runs.getById, { runId }, { token });
  const brief = runData.run.briefSnapshot;
  const encoder = new TextEncoder();
  const startedAt = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        logLaunchInfo("run_stream_started", { runId });
        await fetchMutation(api.runs.markGenerating, { runId }, { token });
        await fetchMutation(
          api.runs.recordEvent,
          {
            runId,
            kind: "stream_connected",
            stageKey: "research_planning",
            message: "Client connected to workflow stream.",
          },
          { token },
        );
        const exa = getExaClient();
        const plannedSources = buildResearchPlan(brief);
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "research_plan",
            content: {
              plannedSources,
            },
            stageKey: "research_planning",
            message: "Research plan artifact saved.",
          },
          { token },
        );
        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "source_retrieval" },
          { token },
        );
        const retrievalRuns: Array<{
          curatedBucket: ResearchBucket;
          queryRuns: Array<{
            focus: string;
            insights: SourceInsight[];
            query: string;
            results: SourceResult[];
          }>;
        }> = [];
        let synthesis = "";

        const researchPromises = plannedSources.map(async (plannedSource) => {
          const config = sourceConfigs.find(
            (entry) => entry.source === plannedSource.source,
          );

          if (!config) {
            throw new Error(
              `Missing source config for ${plannedSource.source}.`,
            );
          }

          try {
            await fetchMutation(
              api.runs.recordEvent,
              {
                runId,
                kind: "source_started",
                stageKey: "source_retrieval",
                source: plannedSource.source,
                message: `Starting ${plannedSource.label} retrieval across ${plannedSource.queries.length} planned queries.`,
                payload: {
                  plannedQueries: plannedSource.queries,
                },
              },
              { token },
            );
            const retrievalRun = await withRetry({
              fn: () =>
                runPlannedSourceResearch(
                  exa,
                  plannedSource,
                  config.includeDomains,
                ),
              label: `${plannedSource.source} retrieval`,
              maxAttempts: 2,
              onRetry: async ({ attempt, error }) => {
                logLaunchWarn("source_retry", {
                  attempt,
                  code: error.code,
                  runId,
                  source: plannedSource.source,
                });
                await fetchMutation(
                  api.runs.recordEvent,
                  {
                    runId,
                    kind: "source_failed",
                    stageKey: "source_retrieval",
                    source: plannedSource.source,
                    message: `${plannedSource.label} retrieval attempt ${attempt} failed. Retrying...`,
                    payload: {
                      code: error.code,
                      retryable: error.retryable,
                    },
                  },
                  { token },
                );
              },
            });
            retrievalRuns.push(retrievalRun);
            await fetchMutation(
              api.runs.recordEvent,
              {
                runId,
                kind: "source_completed",
                stageKey: "source_retrieval",
                source: plannedSource.source,
                message: `${plannedSource.label} retrieval completed.`,
                payload: {
                  curatedInsightCount:
                    retrievalRun.curatedBucket.insights.length,
                  plannedQueries: plannedSource.queries,
                  resultCount: retrievalRun.curatedBucket.results.length,
                },
              },
              { token },
            );
            controller.enqueue(
              encoder.encode(sseEvent("research", retrievalRun.curatedBucket)),
            );
          } catch (err) {
            const classified = classifyLaunchError(err);
            logLaunchWarn("source_failed", {
              code: classified.code,
              message: classified.internalMessage,
              runId,
              source: plannedSource.source,
            });
            await fetchMutation(
              api.runs.recordEvent,
              {
                runId,
                kind: "source_failed",
                stageKey: "source_retrieval",
                source: plannedSource.source,
                message: `${plannedSource.label} retrieval failed: ${classified.userMessage}`,
                payload: {
                  code: classified.code,
                  retryable: classified.retryable,
                },
              },
              { token },
            );
            controller.enqueue(
              encoder.encode(
                sseEvent("research_error", {
                  source: plannedSource.source,
                  label: plannedSource.label,
                  message: classified.userMessage,
                }),
              ),
            );
          }
        });

        await Promise.all(researchPromises);

        if (retrievalRuns.length < 2) {
          throw new Error(
            "Not enough research sources completed successfully to continue.",
          );
        }

        const evidenceBundle = curateEvidenceBundle({
          plannedSources,
          retrievalRuns,
        });
        const research = evidenceBundle.curatedResearch;
        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "evidence_curation" },
          { token },
        );
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "evidence_bundle",
            content: evidenceBundle,
            stageKey: "evidence_curation",
            message: "Curated evidence bundle saved.",
          },
          { token },
        );
        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "synthesis_agent" },
          { token },
        );
        const synthesisNotes = await withRetry({
          fn: () => generateSynthesisNotes(brief, research),
          label: "synthesis notes",
          maxAttempts: 2,
          onRetry: ({ attempt, error }) => {
            logLaunchWarn("stage_retry", {
              attempt,
              code: error.code,
              runId,
              stage: "synthesis_agent",
            });
          },
        });
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "synthesis_notes",
            content: synthesisNotes,
            stageKey: "synthesis_agent",
            message: "Synthesis agent produced strategy notes.",
          },
          { token },
        );
        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "hook_agent" },
          { token },
        );
        const generatedHookCandidates = await withRetry({
          fn: () => generateHookCandidates(brief, research, synthesisNotes),
          label: "hook candidates",
          maxAttempts: 2,
          onRetry: ({ attempt, error }) => {
            logLaunchWarn("stage_retry", {
              attempt,
              code: error.code,
              runId,
              stage: "hook_agent",
            });
          },
        });
        const hookSelection = await withRetry({
          fn: () =>
            selectHookCandidates(
              brief,
              research,
              synthesisNotes,
              generatedHookCandidates,
            ),
          label: "hook selection",
          maxAttempts: 2,
        });
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "hook_candidates",
            content: {
              generatedHooks: generatedHookCandidates,
              rejectedHooks: hookSelection.rejectedHooks,
              selectedHooks: hookSelection.selectedHooks,
              winningHook: hookSelection.winningHook,
            },
            stageKey: "hook_agent",
            message: "Hook agent generated and ranked candidate hooks.",
          },
          { token },
        );
        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "package_draft" },
          { token },
        );
        const draftPackage = await withRetry({
          fn: () =>
            generateDraftPackage(brief, research, {
              hookCandidates: hookSelection.selectedHooks,
              synthesisNotes,
              winningHook: hookSelection.winningHook,
            }).then(validateLaunchPackage),
          label: "package draft",
          maxAttempts: 2,
          onRetry: ({ attempt, error }) => {
            logLaunchWarn("stage_retry", {
              attempt,
              code: error.code,
              runId,
              stage: "package_draft",
            });
          },
        });
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "launch_package_draft",
            content: draftPackage,
            stageKey: "package_draft",
            message: "Package draft generated.",
          },
          { token },
        );
        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "qa_check" },
          { token },
        );
        let qaReport = await withRetry({
          fn: () => qaCheckPackage(brief, research, draftPackage),
          label: "qa check",
          maxAttempts: 2,
        });
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "qa_report",
            content: qaReport,
            stageKey: "qa_check",
            message: qaReport.pass
              ? "QA check passed on the first attempt."
              : "QA check failed and requested a rewrite.",
          },
          { token },
        );

        let finalPackage = draftPackage;

        if (!qaReport.pass) {
          await fetchMutation(
            api.runs.updateStage,
            { runId, currentStage: "rewrite_attempt" },
            { token },
          );
          finalPackage = await withRetry({
            fn: () =>
              refinePackageWithWeaponsCheck(
                brief,
                research,
                draftPackage,
                qaReport,
              ).then(validateLaunchPackage),
            label: "rewrite attempt",
            maxAttempts: 2,
          });
          await fetchMutation(
            api.runs.createArtifact,
            {
              runId,
              artifactType: "rewrite_draft",
              content: finalPackage,
              stageKey: "rewrite_attempt",
              message: "Rewrite agent produced a revised draft.",
            },
            { token },
          );
          await fetchMutation(
            api.runs.updateStage,
            { runId, currentStage: "qa_check" },
            { token },
          );
          qaReport = await withRetry({
            fn: () => qaCheckPackage(brief, research, finalPackage),
            label: "qa recheck",
            maxAttempts: 2,
          });
          await fetchMutation(
            api.runs.createArtifact,
            {
              runId,
              artifactType: "qa_report",
              content: qaReport,
              stageKey: "qa_check",
              message: qaReport.pass
                ? "QA check passed after rewrite."
                : "QA check still found weaknesses after rewrite.",
            },
            { token },
          );
        }

        await fetchMutation(
          api.runs.updateStage,
          { runId, currentStage: "finalized" },
          { token },
        );
        finalPackage = validateLaunchPackage(finalPackage);
        await fetchMutation(
          api.runs.recordEvent,
          {
            runId,
            kind: "stage_completed",
            stageKey: "finalized",
            message:
              "Final package passed structural validation before render.",
          },
          { token },
        );
        await fetchMutation(
          api.runs.createArtifact,
          {
            runId,
            artifactType: "launch_package_final",
            content: finalPackage,
            isFinal: true,
            stageKey: "finalized",
            message: "Final structured launch package saved.",
          },
          { token },
        );
        controller.enqueue(encoder.encode(sseEvent("research_complete", {})));

        const markdown = formatLaunchPackageMarkdown(finalPackage);
        const chunks = markdown.split(/(\n\n|\n)/).filter(Boolean);

        for (const chunk of chunks) {
          controller.enqueue(
            encoder.encode(sseEvent("token", { text: chunk })),
          );
          synthesis += chunk;
        }

        await fetchMutation(
          api.runs.saveStreamResult,
          {
            runId,
            research,
            synthesisMarkdown: synthesis,
          },
          { token },
        );
        await fetchMutation(
          api.runs.recordEvent,
          {
            runId,
            kind: "stream_completed",
            stageKey: "finalized",
            message:
              "Stream finished and all visible artifacts were persisted.",
          },
          { token },
        );
        logLaunchInfo("run_stream_completed", {
          durationMs: Date.now() - startedAt,
          runId,
          sourcesCompleted: retrievalRuns.length,
        });
        controller.enqueue(encoder.encode(sseEvent("done", {})));
        controller.close();
      } catch (err) {
        const classified = classifyLaunchError(err);
        logLaunchError("run_stream_failed", {
          code: classified.code,
          durationMs: Date.now() - startedAt,
          message: classified.internalMessage,
          runId,
        });
        await fetchMutation(
          api.runs.markFailed,
          { runId, message: classified.userMessage },
          { token },
        );
        controller.enqueue(
          encoder.encode(
            sseEvent("error", {
              code: classified.code,
              message: classified.userMessage,
            }),
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
