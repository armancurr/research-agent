"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { LANDING_SECTION_MAX_WIDTH } from "@/lib/landing-layout";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const PRIMARY_LINKS = [
  { href: "#features", label: "Product" },
  { href: "#intro", label: "About Us" },
  { href: "#features", label: "Pricing" },
  { href: "#process", label: "FAQ" },
  { href: "#intro", label: "Contact" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://x.com",
    label: "Twitter",
    ariaLabel: "Research Agent on X (opens in a new tab)",
  },
  {
    href: "https://www.linkedin.com",
    label: "LinkedIn",
    ariaLabel: "Research Agent on LinkedIn (opens in a new tab)",
  },
] as const;

type LandingFooterProps = {
  isAuthed: boolean;
};

export function LandingFooter({ isAuthed }: LandingFooterProps) {
  const shouldReduceMotion = useReducedMotion();

  function getTransition(delay = 0, duration = 0.75) {
    if (shouldReduceMotion) {
      return { duration: 0 };
    }
    return { delay, duration, ease: EASE_OUT };
  }

  const linkClass =
    "text-[13px] font-medium tracking-[-0.02em] text-foreground transition-colors hover:text-primary";

  return (
    <motion.footer
      className="relative overflow-hidden bg-background px-6 pt-16 pb-0 sm:px-8 lg:px-12"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={getTransition(0.05, 0.55)}
    >
      <div
        className={cn(
          "mx-auto flex w-full flex-col items-center gap-6",
          LANDING_SECTION_MAX_WIDTH,
        )}
      >
        <nav
          aria-label="Footer"
          className="flex flex-col items-center gap-5 text-center"
        >
          <ul className="flex max-w-[min(100%,640px)] flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-7">
            {PRIMARY_LINKS.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
            {isAuthed ? (
              <li>
                <Link href="/startup" className={linkClass}>
                  Startup runs
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/auth" className={linkClass}>
                  Sign in
                </Link>
              </li>
            )}
            {SOCIAL_LINKS.map(({ href, label, ariaLabel }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    linkClass,
                    "inline-flex items-center gap-0.5 whitespace-nowrap",
                  )}
                  aria-label={ariaLabel}
                >
                  {label}
                  <ArrowUpRight
                    size={12}
                    weight="bold"
                    className="shrink-0 opacity-80"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>

          <Link
            href="/privacy"
            className="text-[12px] font-medium tracking-[-0.02em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>

      <div className="relative z-0 mt-2 w-screen -translate-x-1/2 left-1/2 select-none">
        <div className="pointer-events-none relative flex h-[clamp(6.5rem,32vw,16rem)] w-full items-end justify-center overflow-hidden">
          <span
            className={cn(
              "block w-full translate-y-[26%] bg-clip-text pb-[clamp(0.75rem,5vw,2.5rem)] text-center font-semibold tracking-[-0.02em]",
              "text-[clamp(5rem,36vw,28rem)] leading-[0.74]",
              "bg-gradient-to-b from-foreground from-[4%] via-foreground/38 via-[28%] to-background to-[82%]",
              "text-transparent",
            )}
          >
            reagent
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
