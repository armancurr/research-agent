"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/shared/app-header";
import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/get-error-message";

export function AuthScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/startup");
      router.refresh();
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("flow", mode);
      const result = await signIn("password", formData);

      if (result.signingIn) {
        router.replace("/startup");
        router.refresh();
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to authenticate."));
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "h-10 rounded-md bg-card text-[15px] placeholder:text-muted-foreground/70";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader showPrimaryNav={false} showSignOut={false} />
      <AppShell className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[400px] space-y-10">
          <div className="space-y-2 text-left">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
              {mode === "signIn"
                ? "Welcome to Research Agent"
                : "Create your account"}
            </h1>
            <p className="text-[15px] text-muted-foreground">
              {mode === "signIn"
                ? "Structured brand research for founders."
                : "Create your workspace."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[13px] font-normal text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Your email address"
                required
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[13px] font-normal text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signIn" ? "current-password" : "new-password"
                }
                placeholder="At least 8 characters"
                required
                className={fieldClass}
              />
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="h-10 w-full rounded-md text-[15px] font-medium"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting
                ? mode === "signIn"
                  ? "Signing in…"
                  : "Creating account…"
                : "Continue"}
            </Button>
            <p className="text-left text-[13px] text-muted-foreground">
              {mode === "signIn" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    onClick={() => setMode("signUp")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    onClick={() => setMode("signIn")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </AppShell>
    </div>
  );
}
