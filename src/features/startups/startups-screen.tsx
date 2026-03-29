"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { UserNav } from "@/components/shared/user-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StartupsScreen() {
  const startups = useQuery(api.startups.listMine);

  return (
    <AppShell className="pb-20 pt-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Startups</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your persisted startup briefs and launch runs now live here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <UserNav />
          <Button nativeButton={false} render={<Link href="/" />}>
            New Startup
          </Button>
        </div>
      </header>

      <div className="grid gap-4">
        {startups === undefined ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading startups...</CardTitle>
            </CardHeader>
          </Card>
        ) : startups.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No startups yet</CardTitle>
              <CardDescription>
                Create your first startup brief to start saving launch runs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button nativeButton={false} render={<Link href="/" />}>
                Create first startup
              </Button>
            </CardContent>
          </Card>
        ) : (
          startups.map((startup) => (
            <Card key={startup._id}>
              <CardHeader>
                <CardTitle>
                  {startup.brief.companyName || startup.brief.productName}
                </CardTitle>
                <CardDescription>
                  {startup.brief.productName} • {startup.brief.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{startup.brief.targetAudience}</p>
                  <p>
                    Runs: {startup.runCount}
                    {startup.latestRun
                      ? ` • Latest status: ${startup.latestRun.status}`
                      : " • No runs yet"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {startup.latestRun ? (
                    <Button
                      nativeButton={false}
                      variant="outline"
                      render={<Link href={`/chat/${startup.latestRun._id}`} />}
                    >
                      Open latest run
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
