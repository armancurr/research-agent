"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      autoScroll.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 300;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function maybeScrollToBottom() {
    if (!autoScroll.current) {
      return;
    }

    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  return {
    bottomRef,
    maybeScrollToBottom,
  };
}
