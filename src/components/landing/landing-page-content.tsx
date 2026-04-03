"use client";

import {
  ArrowRight,
  RedditLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
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

const credibilityItems = [
  {
    name: "YouTube",
    icon: <YoutubeLogo className="h-7 w-7" weight="fill" aria-hidden="true" />,
  },
  {
    name: "X / Twitter",
    icon: <XLogo className="h-7 w-7" weight="fill" aria-hidden="true" />,
  },
  {
    name: "Reddit",
    icon: <RedditLogo className="h-7 w-7" weight="fill" aria-hidden="true" />,
  },
] as const;

const showcaseCardImages = [
  { id: "panel-1", src: "/image2.png", alt: "Launch campaign preview one" },
  { id: "panel-2", src: "/image3.png", alt: "Launch campaign preview two" },
  { id: "panel-3", src: "/image4.png", alt: "Launch campaign preview three" },
  { id: "panel-4", src: "/image5.png", alt: "Launch campaign preview four" },
] as const;

type FounderTestimonial = {
  name: string;
  role: string;
  quote: string;
  badgeLabel: string;
  badgeClassName: string;
};

const founderTestimonials: FounderTestimonial[] = [
  {
    name: "Aahel Iyer",
    role: "Co-Founder Midship",
    quote:
      "Research Agent gave us clearer launch hooks and a sharper narrative. We went from scattered notes to messaging the whole team could actually use.",
    badgeLabel: "MI",
    badgeClassName: "bg-[#ff6b2c] text-white",
  },
  {
    name: "Mads Burcharth",
    role: "Wawa Fertility (collaboration)",
    quote:
      "The research synthesis made the positioning work much faster. It surfaced the audience language and objections we needed before building the launch copy.",
    badgeLabel: "WA",
    badgeClassName: "bg-[#111111] text-white",
  },
  {
    name: "Raj Khare",
    role: "CEO at Offset",
    quote:
      "What stood out was how quickly the platform turned a startup brief into a credible launch package. The outputs felt grounded, not generic.",
    badgeLabel: "OF",
    badgeClassName: "bg-[#2b2d2f] text-[#f3eee8]",
  },
  {
    name: "Maria Tavierne",
    role: "Branded Native",
    quote:
      "It helped us connect research, strategy, and messaging in one workflow. That made launch planning a lot less noisy and much more decisive.",
    badgeLabel: "BN",
    badgeClassName: "bg-[#0b1f36] text-[#c8dcff]",
  },
];

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

function CredibilityIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 text-muted-foreground sm:gap-6">
      {credibilityItems.map(({ name, icon }) => (
        <span key={name} className="flex items-center gap-3">
          {icon}
          <span className="text-base font-medium tracking-[-0.04em] sm:text-[1.05rem]">
            {name}
          </span>
        </span>
      ))}
    </div>
  );
}

function FounderQuoteCard({
  name,
  role,
  quote,
  badgeLabel,
  badgeClassName,
}: FounderTestimonial) {
  return (
    <article className="flex h-full flex-col justify-between gap-10 rounded-[6px] border border-border/70 bg-card/80 p-6 sm:p-7 lg:p-8">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${badgeClassName}`}
        >
          {badgeLabel}
        </div>
        <div>
          <p className="text-[1.05rem] font-medium leading-none tracking-[-0.04em] text-foreground">
            {name}
          </p>
          <p className="mt-1 text-sm leading-none tracking-[-0.03em] text-muted-foreground">
            {role}
          </p>
        </div>
      </div>

      <p className="max-w-[42ch] text-[1.02rem] leading-[1.22] tracking-[-0.04em] text-muted-foreground sm:text-[1.08rem] lg:max-w-[48ch]">
        {quote}
      </p>
    </article>
  );
}

function TestimonialArtworkCard() {
  return (
    <article className="relative min-h-[360px] overflow-hidden rounded-[6px] bg-card/80 lg:min-h-[420px]">
      <Image
        src="/image6.png"
        alt="Founders and product launch artwork"
        fill
        sizes="(min-width: 1024px) 460px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02),rgba(10,10,10,0.12)_45%,rgba(10,10,10,0.42)_100%)]" />
      <p className="absolute inset-x-5 bottom-5 max-w-[320px] text-[1.1rem] font-medium leading-[1.15] tracking-[-0.05em] text-white sm:inset-x-6 sm:bottom-6 sm:text-[1.2rem]">
        Trusted by founders building and scaling modern B2B products.
      </p>
    </article>
  );
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
      <div>
        <AppHeader
          showPrimaryNav={isAuthed}
          showSignOut={isAuthed}
          showSignIn={!isAuthed}
        />
      </div>

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

            <div className="mx-auto mt-12 max-w-[920px] space-y-5">
              <p className="text-[1.02rem] leading-[1.22] tracking-[-0.04em] text-foreground sm:text-[1.12rem]">
                Research-backed by the platforms where startup launches actually
                move.
              </p>
              <div className="flex justify-center">
                <CredibilityIcons />
              </div>
              <p className="text-[1rem] font-medium tracking-[-0.03em] text-muted-foreground sm:text-[1.02rem]">
                And a workflow inspired by specialized research, writing, and
                strategy agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="mx-auto w-full max-w-[1880px] bg-background px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className={`mx-auto w-full ${SECTION_MAX_WIDTH}`}>
          <motion.h2
            className="mx-auto mb-16 max-w-[760px] text-center text-[2.1rem] leading-[1.06] font-medium tracking-[-0.06em] text-foreground sm:text-[2.75rem] lg:text-[3.4rem]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={getTransition(0.08, 0.75)}
          >
            Launch campaigns built for traction
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {showcaseCardImages.map(({ id, src, alt }, index) => (
              <motion.article
                key={id}
                className="relative overflow-hidden rounded-[8px] border border-border/70 bg-card/50"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.35 }}
                transition={getTransition(index * 0.08 + 0.08, 0.7)}
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01)_35%,rgba(7,7,8,0.52)_100%)]" />
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-20 bg-background px-0 py-2 sm:px-0 lg:px-0">
            <div className={`mx-auto w-full ${SECTION_MAX_WIDTH}`}>
              <motion.h3
                className="mx-auto max-w-[540px] text-center text-[2rem] font-medium leading-[1.06] tracking-[-0.06em] text-foreground sm:text-[2.5rem] lg:text-[3rem]"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.55 }}
                transition={getTransition(0.08, 0.7)}
              >
                What founders say about research-led launch work.
              </motion.h3>

              <div className="mt-14 grid gap-4 lg:grid-cols-[1.02fr_1fr]">
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={
                    shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.35 }}
                  transition={getTransition(0.08, 0.7)}
                >
                  <TestimonialArtworkCard />
                </motion.div>

                <div className="grid gap-4">
                  {founderTestimonials.slice(0, 2).map((testimonial, index) => (
                    <motion.div
                      key={testimonial.name}
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 24 }
                      }
                      whileInView={
                        shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                      }
                      viewport={{ once: true, amount: 0.45 }}
                      transition={getTransition(index * 0.08 + 0.14, 0.65)}
                    >
                      <FounderQuoteCard {...testimonial} />
                    </motion.div>
                  ))}
                </div>

                {founderTestimonials.slice(2).map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={
                      shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true, amount: 0.45 }}
                    transition={getTransition(index * 0.08 + 0.22, 0.65)}
                  >
                    <FounderQuoteCard {...testimonial} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="process"
        className="flex min-h-screen w-full flex-col justify-center  make  px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"
      >
        <div className={`mx-auto w-full ${SECTION_MAX_WIDTH}`}>
          <motion.h2
            className="mx-auto mb-16 max-w-[720px] text-center text-[2.1rem] leading-[1.06] font-medium tracking-[-0.06em] text-foreground sm:text-[2.75rem] lg:text-[3.4rem]"
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
                <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-foreground">
                  {step.id} - {step.title}
                </h3>
                <p className="text-base leading-7 font-medium tracking-[-0.03em] text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.footer
        className="px-6 py-6 sm:px-8 lg:px-12"
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
