"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseCarouselOptions = {
  count: number;
  intervalMs?: number;
  reducedMotion?: boolean;
};

export function useCarousel({
  count,
  intervalMs = 3500,
  reducedMotion = false,
}: UseCarouselOptions) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count],
  );

  const isPaused = hovered || focused || userPaused || reducedMotion;

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [isPaused, next, intervalMs]);

  // Keyboard nav on the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return {
    index,
    goTo,
    next,
    prev,
    isPaused,
    userPaused,
    setUserPaused,
    containerRef,
    bind: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  };
}