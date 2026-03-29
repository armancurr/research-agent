import { AppHeader } from "@/components/shared/app-header";
import { AppShell } from "@/components/shared/app-shell";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <AppShell className="flex flex-1 items-center justify-center pb-20 pt-6">
        <p className="text-sm text-muted-foreground">Coming soon.</p>
      </AppShell>
    </div>
  );
}
