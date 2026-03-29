import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatJson,
  formatTimestamp,
} from "@/features/launch-chat/utils/run-display";

type Artifact = {
  _id: string;
  artifactType: string;
  content: unknown;
  createdAt: number;
  isFinal?: boolean;
  markdown?: string;
  version: number;
};

export function RunArtifactsPanel({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Artifacts
        </h2>
        <span className="text-[11px] text-muted-foreground/50">
          {artifacts.length} persisted outputs
        </span>
      </div>

      <div className="grid gap-3">
        {artifacts.map((artifact) => (
          <Card key={artifact._id}>
            <CardHeader>
              <CardTitle className="text-sm">
                {artifact.artifactType.replace(/_/g, " ")} • v{artifact.version}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(artifact.createdAt)}
                {artifact.isFinal ? " • Final" : ""}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {artifact.markdown ? (
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-foreground/85">
                  {artifact.markdown}
                </pre>
              ) : null}
              <pre className="overflow-x-auto rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-foreground/85">
                {formatJson(artifact.content)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
