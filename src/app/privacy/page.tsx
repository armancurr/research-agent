import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Research Agent",
  description: "How Research Agent handles your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="mt-10 text-3xl font-medium tracking-[-0.04em]">
          Privacy Policy
        </h1>
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          This page is a placeholder. Replace this copy with your real privacy
          policy before production use.
        </p>
      </div>
    </main>
  );
}
