"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { LandingChatHeroPreview } from "@/components/landing/landing-chat-hero-preview";
import { AppHeader } from "@/components/shared/app-header";
import { Button } from "@/components/ui/button";

const SECTION_MAX_WIDTH = "max-w-[1450px]";

const PROCESS_STEPS = [
  {
    id: "01",
    title: "Brief In",
    description:
      "Capture your company, product, audience, and positioning in one startup brief so every run starts with the right context.",
  },
  {
    id: "02",
    title: "Research Run",
    description:
      "Generate a cited research package with competitive context, audience signals, and launch angles tailored to your brief.",
  },
  {
    id: "03",
    title: "Refine & Ship",
    description:
      "Review the output, refine the package, and turn the final recommendations into messaging you can actually publish.",
  },
] as const;

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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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

type LandingPageContentProps = {
  isAuthed: boolean;
};

export function LandingPageContent({ isAuthed }: LandingPageContentProps) {
  const shouldReduceMotion = useReducedMotion();

  function getTransition(delay = 0, duration = 0.75) {
    if (shouldReduceMotion) {
      return { duration: 0 };
    }

    return {
      delay,
      duration,
      ease: EASE_OUT,
    };
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={getTransition(0.05, 0.55)}
      >
        <AppHeader
          showPrimaryNav={isAuthed}
          showSignOut={isAuthed}
          showSignIn={!isAuthed}
        />
      </motion.div>

      <section
        id="intro"
        className="relative overflow-hidden bg-background px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={shouldReduceMotion ? false : { opacity: 0.35 }}
          animate={
            shouldReduceMotion ? undefined : { opacity: [0.35, 0.55, 0.35] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
        >
          <div className="absolute right-[-7rem] bottom-[-7rem] h-[16rem] w-[16rem] rounded-full bg-chart-2/20 blur-3xl" />
        </motion.div>

        <div
          className={`mx-auto flex min-h-[calc(100vh-3.5rem)] w-full ${SECTION_MAX_WIDTH} flex-col`}
        >
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-8 pt-4 text-center sm:pt-8 lg:pt-10">
            <div className="max-w-[980px]">
              <motion.h1
                className="mx-auto max-w-[860px] text-balance text-[2.35rem] leading-[1.05] font-medium tracking-[-0.06em] text-foreground sm:text-[3.2rem] lg:text-[4.2rem]"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={getTransition(0.14, 0.8)}
              >
                Ship your launch story before the internet writes one for you.
              </motion.h1>

              <motion.div
                className="mx-auto mt-8 max-w-[760px] space-y-4"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={getTransition(0.3, 0.7)}
              >
                <p className="text-base leading-7 font-medium tracking-[-0.03em] text-muted-foreground sm:text-[1.05rem] sm:leading-7">
                  Research Agent turns your startup brief into market research,
                  positioning, and launch-ready messaging so you can move from
                  blank page to confident rollout faster.
                </p>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={getTransition(0.43, 0.65)}
              >
                <Button
                  nativeButton={false}
                  className="h-10 rounded-full px-5 text-sm"
                  render={<Link href="/new" />}
                >
                  <ArrowRight size={16} weight="bold" aria-hidden />
                  Start a research run
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="mt-16 flex w-full items-center justify-center lg:mt-20"
              initial={
                shouldReduceMotion ? false : { opacity: 0, y: 42, scale: 0.98 }
              }
              animate={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
              }
              transition={getTransition(0.5, 0.9)}
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="process"
        className="flex min-h-screen w-full flex-col justify-center border-y border-border/70 bg-card/35 px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"
      >
        <div className={`mx-auto w-full ${SECTION_MAX_WIDTH}`}>
          <motion.h2
            className="mx-auto mb-16 max-w-[720px] text-center text-[2.1rem] leading-[1.06] font-medium tracking-[-0.06em] text-white sm:text-[2.75rem] lg:text-[3.4rem]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={getTransition(0.08, 0.75)}
          >
            A structured process founders can trust.
          </motion.h2>

          <motion.div
            className="relative mx-auto mb-16 flex w-full max-w-[1200px] items-end justify-center bg-transparent px-4 py-8 sm:px-8 sm:py-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={getTransition(0.2, 0.8)}
          >
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
                      <motion.span
                        key={`${id}-${dotNumber}`}
                        className="block h-2.5 w-2.5 rounded-full sm:h-3.5 sm:w-3.5"
                        style={{
                          backgroundColor: dotColor,
                        }}
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, scale: 0.15, y: 8 }
                        }
                        whileInView={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 1, scale: 1, y: 0 }
                        }
                        viewport={{ once: true, amount: 0.25 }}
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : {
                                delay: columnIndex * 0.015 + dotNumber * 0.028,
                                duration: 0.36,
                                ease: EASE_OUT,
                              }
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-3 lg:gap-16">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                className="text-center"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.6 }}
                transition={getTransition(index * 0.12 + 0.1, 0.65)}
              >
                <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                  {step.id} - {step.title}
                </h3>
                <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.footer
        className="border-t border-border/70 bg-background px-6 py-6 sm:px-8 lg:px-12"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={getTransition(0.05, 0.55)}
      >
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
      </motion.footer>
    </main>
  );
}
