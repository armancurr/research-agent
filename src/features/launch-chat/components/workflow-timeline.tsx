import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDuration,
  formatTimestamp,
} from "@/features/launch-chat/utils/run-display";

type StageRun = {
  _id: string;
  attemptNumber: number;
  completedAt?: number;
  stageKey: string;
  startedAt: number;
  status: "running" | "completed" | "failed";
  summary?: string;
};

function stageBadgeVariant(status: StageRun["status"]) {
  switch (status) {
    case "completed":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export function WorkflowTimeline({ stageRuns }: { stageRuns: StageRun[] }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Workflow Timeline
        </h2>
        <span className="text-[11px] text-muted-foreground/50">
          {stageRuns.length} stage attempts
        </span>
      </div>

      <div className="grid gap-3">
        {stageRuns.map((stageRun) => (
          <Card key={stageRun._id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="capitalize">
                  {stageRun.stageKey.replace(/_/g, " ")}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Attempt {stageRun.attemptNumber} • Started{" "}
                  {formatTimestamp(stageRun.startedAt)}
                </p>
              </div>
              <Badge variant={stageBadgeVariant(stageRun.status)}>
                {stageRun.status}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              <p>
                <span className="font-medium text-foreground">Completed:</span>{" "}
                {formatTimestamp(stageRun.completedAt)}
              </p>
              <p>
                <span className="font-medium text-foreground">Duration:</span>{" "}
                {formatDuration(stageRun.startedAt, stageRun.completedAt) ??
                  "In progress"}
              </p>
              <p>
                <span className="font-medium text-foreground">Summary:</span>{" "}
                {stageRun.summary ?? "No summary recorded yet."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
