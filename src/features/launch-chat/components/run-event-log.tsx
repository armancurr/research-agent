import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatJson,
  formatTimestamp,
} from "@/features/launch-chat/utils/run-display";

type RunEvent = {
  _id: string;
  artifactId?: string;
  attemptNumber?: number;
  createdAt: number;
  kind: string;
  message?: string;
  payload?: unknown;
  sequence: number;
  source?: string;
  stageKey?: string;
};

export function RunEventLog({ events }: { events: RunEvent[] }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Execution Log
        </h2>
        <span className="text-[11px] text-muted-foreground/50">
          {events.length} events
        </span>
      </div>

      <div className="grid gap-3">
        {events.map((event) => (
          <Card key={event._id} size="sm">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-sm">
                  #{event.sequence} • {event.kind.replace(/_/g, " ")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(event.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.stageKey ? (
                  <Badge variant="outline">{event.stageKey}</Badge>
                ) : null}
                {event.source ? (
                  <Badge variant="outline">{event.source}</Badge>
                ) : null}
                {event.attemptNumber ? (
                  <Badge variant="secondary">
                    Attempt {event.attemptNumber}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{event.message ?? "No message recorded."}</p>
              {event.payload !== undefined ? (
                <pre className="overflow-x-auto rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-foreground/85">
                  {formatJson(event.payload)}
                </pre>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
