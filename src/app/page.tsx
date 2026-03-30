import { RedditLogo, XLogo, YoutubeLogo } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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

const credibilityItems = [
  {
    name: "YouTube",
    icon: <YoutubeLogo className="h-8 w-8" weight="fill" aria-hidden="true" />,
  },
  {
    name: "X / Twitter",
    icon: <XLogo className="h-8 w-8" weight="fill" aria-hidden="true" />,
  },
  {
    name: "Reddit",
    icon: <RedditLogo className="h-8 w-8" weight="fill" aria-hidden="true" />,
  },
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
      "This team helped us bring clarity to our product and translate complex ideas into a much cleaner website experience.",
    badgeLabel: "MI",
    badgeClassName: "bg-[#ff6b2c] text-white",
  },
  {
    name: "Mads Burcharth",
    role: "Wawa Fertility (collaboration)",
    quote:
      "They delivered a modern website that reflects our brand and makes it easier for people to understand our services.",
    badgeLabel: "WA",
    badgeClassName: "bg-[#111111] text-white",
  },
  {
    name: "Raj Khare",
    role: "CEO at Offset",
    quote:
      "Working with the team made the redesign process smooth and efficient. The new website communicates our product much more clearly.",
    badgeLabel: "OF",
    badgeClassName: "bg-[#2b2d2f] text-[#f3eee8]",
  },
  {
    name: "Maria Tavierne",
    role: "Branded Native",
    quote:
      "The team was great to collaborate with. They delivered thoughtful design work and communicated clearly throughout the project.",
    badgeLabel: "BN",
    badgeClassName: "bg-[#0b1f36] text-[#c8dcff]",
  },
];

export const metadata: Metadata = {
  title: "Research Agent | Research-backed launch systems for startups",
  description:
    "A premium AI-guided launch platform that turns startup research into sharper hooks, messaging, and campaign direction.",
  openGraph: {
    title: "Research Agent | Research-backed launch systems for startups",
    description:
      "Turn startup research into sharper hooks, scripts, and launch strategy with cited signals from the platforms that drive attention.",
    images: ["/image1.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Agent | Research-backed launch systems for startups",
    description:
      "Turn startup research into sharper hooks, scripts, and launch strategy with cited signals from the platforms that drive attention.",
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

function CredibilityIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
      {credibilityItems.map(({ name, icon }) => (
        <span key={name} className="flex items-center gap-3">
          {icon}
          <span className="text-[1.1rem] font-medium tracking-[-0.04em]">
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
    <article className="flex h-full flex-col justify-between gap-8 rounded-[6px] border border-border/70 bg-card/80 p-5 sm:p-6">
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

      <p className="max-w-[34ch] text-[1.02rem] leading-[1.18] tracking-[-0.04em] text-muted-foreground sm:text-[1.08rem]">
        {quote}
      </p>
    </article>
  );
}

function TestimonialArtworkCard() {
  return (
    <article className="relative min-h-[320px] overflow-hidden rounded-[6px] bg-card/80">
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

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        id="intro"
        className="relative overflow-hidden bg-background px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
      >
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col">
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-8 pt-4 text-center sm:pt-8 lg:pt-10">
            <div className="max-w-[980px]">
              <h1 className="mx-auto max-w-[980px] text-balance text-[2.9rem] leading-[1.04] font-medium tracking-[-0.07em] text-foreground sm:text-[4rem] lg:text-[5rem]">
                Building viral launch systems for tech companies ready to break
                the feed.
              </h1>

              <div className="mx-auto mt-8 max-w-[760px] space-y-4">
                <p className="text-lg leading-8 font-medium tracking-[-0.04em] text-muted-foreground sm:text-[1.25rem] sm:leading-8">
                  Most startups do not need another chatbot. They need a launch
                  system that turns product depth into hooks, scripts, and
                  campaign angles that actually earn attention.
                </p>
              </div>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/auth"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start a research run
                </Link>
                <a
                  href="#process"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card/70 px-6 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  View process
                </a>
              </div>
            </div>

            <div className="mt-16 flex w-full items-center justify-center lg:mt-20">
              <div className="relative flex w-full max-w-[1450px] items-end justify-center overflow-hidden rounded-[10px] ">
                <Image
                  src="/image1.png"
                  alt="Research Agent hero preview"
                  className="h-full w-full object-cover"
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  priority
                />
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
              <p className="text-[1.02rem] font-medium tracking-[-0.03em] text-muted-foreground">
                And a workflow inspired by specialized writing and strategy
                agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="mx-auto w-full max-w-[1880px] bg-background px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-[1320px]">
          <h2 className="mx-auto mb-16 max-w-[760px] text-center text-[2.9rem] leading-[1.04] font-medium tracking-[-0.07em] text-foreground sm:text-[4rem] lg:text-[5rem]">
            Launch campaigns built for traction
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <article className="group relative overflow-hidden rounded-[8px] border border-border/70 bg-card/50">
              <div className="aspect-[16/11] overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/image2.png"
                    alt="Campaign preview one"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[8px] border border-border/70 bg-card/50">
              <div className="aspect-[16/11] overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/image3.png"
                    alt="Campaign preview two"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[8px] border border-border/70 bg-card/50">
              <div className="aspect-[16/11] overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/image4.png"
                    alt="Campaign preview three"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[8px] border border-border/70 bg-card/50">
              <div className="aspect-[16/11] overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/image5.png"
                    alt="Campaign preview four"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </article>
          </div>

          <div className="mt-20 bg-background px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-[900px]">
              <h3 className="mx-auto max-w-[540px] text-center text-[2.4rem] font-medium leading-[1.06] tracking-[-0.07em] text-foreground sm:text-[3rem]">
                What founders say about research-led launch work.
              </h3>

              <div className="mt-14 grid gap-4 lg:grid-cols-[1.02fr_1fr]">
                <TestimonialArtworkCard />

                <div className="grid gap-4">
                  {founderTestimonials.slice(0, 2).map((testimonial) => (
                    <FounderQuoteCard key={testimonial.name} {...testimonial} />
                  ))}
                </div>

                <FounderQuoteCard {...founderTestimonials[2]} />
                <FounderQuoteCard {...founderTestimonials[3]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="process"
        className="flex min-h-screen w-full flex-col justify-center border-y border-border/70 bg-card/35 px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <h2 className="mx-auto mb-20 max-w-[760px] text-center text-[2.9rem] leading-[1.04] font-medium tracking-[-0.07em] text-white sm:text-[4rem] lg:text-[5rem]">
            A structured process founders can trust.
          </h2>

          <div className="relative mx-auto mb-16 flex w-full max-w-5xl items-end justify-center bg-transparent px-4 py-8 sm:px-8 sm:py-10">
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

          <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-3 lg:gap-16">
            <div className="text-center">
              <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                01 - Research & Insight
              </h3>
              <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                Running research across YouTube, X, and Reddit to identify
                patterns in what resonates with your audience and competitors.
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                02 - Hooks & Script
              </h3>
              <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                Using specialized agents to craft multiple hook variations,
                scripts, and messaging angles tested against novelty and
                intensity.
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-base font-semibold tracking-[-0.03em] text-white">
                03 - Package & Launch
              </h3>
              <p className="text-base leading-7 font-medium tracking-[-0.03em] text-white/50">
                Delivering refined launch assets with strategic angles,
                positioning guidelines, and campaign recommendations ready to
                deploy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
