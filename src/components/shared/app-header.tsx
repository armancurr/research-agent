"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Globe, Plus, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  /** Extra controls (e.g. Restart / Approve on /chat). Shown before sign out. */
  actions?: ReactNode;
  /** Hide brand + New startup (e.g. auth page). */
  showPrimaryNav?: boolean;
  /** Hide sign out (e.g. auth page). */
  showSignOut?: boolean;
  className?: string;
};

export function AppHeader({
  actions,
  showPrimaryNav = true,
  showSignOut = true,
  className,
}: AppHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/auth");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {showPrimaryNav ? (
          <>
            <Link
              href="/startup"
              className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              <Globe
                size={18}
                weight="duotone"
                className="shrink-0 text-primary"
              />
              Research Agent
            </Link>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              className="gap-1.5"
              render={<Link href="/new" />}
            >
              <Plus size={16} weight="bold" aria-hidden />
              New startup
            </Button>
          </>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {showSignOut ? (
          <Button
            variant="outline"
            size="icon-sm"
            disabled={isSigningOut}
            onClick={handleSignOut}
            aria-label={isSigningOut ? "Signing out" : "Sign out"}
          >
            <SignOut size={18} />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
