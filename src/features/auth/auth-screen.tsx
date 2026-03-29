"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/shared/app-header";
import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  return (
    <>
      <AppHeader showPrimaryNav={false} showSignOut={false} />
      <AppShell className="items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {mode === "signIn" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              Sign in to create startups, persist runs, and review launch
              packages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="founder@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signIn" ? "current-password" : "new-password"
                  }
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting
                  ? mode === "signIn"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signIn"
                    ? "Sign In"
                    : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setMode((current) =>
                    current === "signIn" ? "signUp" : "signIn",
                  );
                }}
              >
                {mode === "signIn"
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AppShell>
    </>
  );
}
