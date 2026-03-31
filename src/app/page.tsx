import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LandingChatHeroPreview } from "@/components/landing/landing-chat-hero-preview";
import { AppHeader } from "@/components/shared/app-header";
import { Button } from "@/components/ui/button";

const SECTION_MAX_WIDTH = "max-w-[1450px]";

const processColumns = [
  { id: "a1", height: 3 },
  { id: "a2", height: 5 },
  { id: "a3", height: 7 },
  { id: "a4", height: 11 },
  { id: "a5", height: 4 },
  { id: "a6", height: 5 },
  { id: "a7", height: 8 },
  { id: "a8", height: 4 },
  { id: "a9", height: 1 },
  { id: "b1", height: 4 },
  { id: "b2", height: 2 },
  { id: "b3", height: 4 },
  { id: "b4", height: 5 },
  { id: "b5", height: 4 },
  { id: "b6", height: 3 },
  { id: "b7", height: 1 },
  { id: "c1", height: 3 },
  { id: "c2", height: 4 },
  { id: "c3", height: 5 },
  { id: "c4", height: 7 },
  { id: "c5", height: 13 },
  { id: "c6", height: 11 },
  { id: "c7", height: 8 },
  { id: "c8", height: 5 },
  { id: "c9", height: 4 },
  { id: "d1", height: 5 },
  { id: "d2", height: 3 },
  { id: "d3", height: 2 },
  { id: "d4", height: 4 },
  { id: "d5", height: 3 },
  { id: "d6", height: 6 },
  { id: "d7", height: 4 },
  { id: "d8", height: 2 },
  { id: "e1", height: 5 },
  { id: "e2", height: 4 },
  { id: "e3", height: 6 },
  { id: "e4", height: 4 },
] as const;

export const metadata: Metadata = {
  title: "Research Agent | Research-backed launch systems for startups",
  description:
    "Research Agent helps founders turn a startup brief into cited launch research, sharper positioning, and ready-to-use messaging.",
  openGraph: {
    title: "Research Agent | Research-backed launch systems for startups",
    description:
      "Turn a startup brief into research-backed positioning, launch angles, and messaging you can use right away.",
    images: ["/image1.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Agent | Research-backed launch systems for startups",
    description:
      "Turn a startup brief into research-backed positioning, launch angles, and messaging you can use right away.",
    images: ["/image1.png"],
  },
};

function getProcessDotColor(columnIndex: number, rowIndex: number) {
  const columnRatio = columnIndex / (processColumns.length - 1);
  const rowRatio = rowIndex / 12;

  let hue = 18 + columnRatio * 188;
  let saturation = 58 + rowRatio * 14;
  let lightness = 82 - rowRatio * 24;

  if (columnRatio > 0.46 && columnRatio < 0.66 && rowRatio > 0.42) {
    hue = 10 + (1 - rowRatio) * 12;
    saturation = 72;
    lightness = 68 - rowRatio * 18;
  }

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const { preview } = await searchParams;
  const isAuthed = await isAuthenticatedNextjs();
  if (isAuthed && preview !== "1") {
    redirect("/startup");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader
        showPrimaryNav={isAuthed}
        showSignOut={isAuthed}
        showSignIn={!isAuthed}
      />
      <section
        id="intro"
        className="relative overflow-hidden bg-background px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
      >
        <div
          className={`mx-auto flex min-h-[calc(100vh-3.5rem)] w-full ${SECTION_MAX_WIDTH} flex-col`}
        >
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-8 pt-4 text-center sm:pt-8 lg:pt-10">
            <div className="max-w-[980px]">
              <h1 className="mx-auto max-w-[860px] text-balance text-[2.35rem] leading-[1.05] font-medium tracking-[-0.06em] text-foreground sm:text-[3.2rem] lg:text-[4.2rem]">
                Ship your launch story before the internet writes one for you.
              </h1>

              <div className="mx-auto mt-8 max-w-[760px] space-y-4">
                <p className="text-base leading-7 font-medium tracking-[-0.03em] text-muted-foreground sm:text-[1.05rem] sm:leading-7">
                  Research Agent turns your startup brief into market research,
                  positioning, and launch-ready messaging so you can move from
                  blank page to confident rollout faster.
                </p>
              </div>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  nativeButton={false}
                  className="h-10 rounded-full px-5 text-sm"
                  render={<Link href="/new" />}
                >
                  <ArrowRight size={16} weight="bold" aria-hidden />
                  Start a research run
                </Button>
              </div>
            </div>

            <div className="mt-16 flex w-full items-center justify-center lg:mt-20">
              <div
                className={`relative w-full ${SECTION_MAX_WIDTH} max-w-full`}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat"
                  />
                  <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
                    <div className="mx-auto w-full max-w-[min(100%,1320px)]">
                      <LandingChatHeroPreview />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="process"
        className="flex min-h-screen w-full flex-col justify-center border-y border-border/70 bg-card/35 px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"
      >
        <div className={`mx-auto w-full ${SECTION_MAX_WIDTH}`}>
          <h2 className="mx-auto mb-16 max-w-[720px] text-center text-[2.1rem] leading-[1.06] font-medium tracking-[-0.06em] text-white sm:text-[2.75rem] lg:text-[3.4rem]">
            A structured process founders can trust.
          </h2>

          <div className="relative mx-auto mb-16 flex w-full max-w-[1200px] items-end justify-center bg-transparent px-4 py-8 sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />
            <div className="flex w-full items-end justify-between gap-1 sm:gap-1.5">
              {processColumns.map(({ id, height }, columnIndex) => (
                <div
                  key={id}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  {Array.from(
                    { length: height },
                    (_, dotNumber) => dotNumber + 1,
                  ).map((dotNumber) => {
                    const dotColor = getProcessDotColor(
                      columnIndex,
                      dotNumber - 1,
                    );

                    return (
                      <span
                        key={`${id}-${dotNumber}`}
                        className="block h-2.5 w-2.5 rounded-full sm:h-3.5 sm:w-3.5"
                        style={{
                          backgroundColor: dotColor,
                          boxShadow: `0 0 14px ${dotColor}22`,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-3 lg:gap-16">
            <div className="text-center">
              <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                01 - Brief In
              </h3>
              <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                Capture your company, product, audience, and positioning in one
                startup brief so every run starts with the right context.
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                02 - Research Run
              </h3>
              <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                Generate a cited research package with competitive context,
                audience signals, and launch angles tailored to your brief.
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                03 - Refine & Ship
              </h3>
              <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                Review the output, refine the package, and turn the final
                recommendations into messaging you can actually publish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-background px-6 py-6 sm:px-8 lg:px-12">
        <div
          className={`mx-auto flex w-full ${SECTION_MAX_WIDTH} flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between`}
        >
          <p>Research Agent</p>
          <div className="flex items-center gap-4">
            <Link
              href="/new"
              className="transition-colors hover:text-foreground"
            >
              New startup
            </Link>
            <Link
              href="/startup"
              className="transition-colors hover:text-foreground"
            >
              Startup runs
            </Link>
            <Link
              href="/auth"
              className="transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
