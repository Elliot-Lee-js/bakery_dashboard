"use client";

import Image from "next/image";
import { useState } from "react";
import { useCarousel } from "@/lib/carousel";

type Portrait = { src: string; alt: string };

const OFFSET_X = 90;
const ROTATION_Y = 35;
const SCALE_STEP = 0.18;
const OPACITY_STEP = 0.35;
const VISIBLE_RANGE = 2;
const TRANSITION_MS = 500;

export function CoverflowCarousel({
  portraits,
  reducedMotion,
}: {
  portraits: Portrait[];
  reducedMotion: boolean;
}) {
  const count = portraits.length;
  const {
    index,
    goTo,
    isPaused,
    userPaused,
    setUserPaused,
    containerRef,
    bind,
  } = useCarousel({ count, reducedMotion });

  // Track which images have decoded. Keyed by src so it survives reordering.
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const markLoaded = (src: string) =>
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));

  return (
    <div
      ref={containerRef}
      {...bind}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured pastries"
      tabIndex={0}
      className="relative rounded-2xl bg-neutral-100 py-10 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      <div className="relative flex h-64 items-center justify-center [perspective:1200px]">
        {portraits.map((p, i) => {
          const offset = i - index;
          const abs = Math.abs(offset);
          const isHidden = abs > VISIBLE_RANGE;
          const isLoaded = !!loaded[p.src];

          return (
            <button
              key={p.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show pastry ${i + 1} of ${count}`}
              aria-hidden={isHidden}
              tabIndex={isHidden ? -1 : 0}
              className="absolute h-48 w-36 overflow-hidden rounded-xl shadow-lg transition-all ease-out [backface-visibility:hidden] [transform-style:preserve-3d] will-change-transform"
              style={{
                transform: `translateX(${offset * OFFSET_X}px) scale(${
                  1 - abs * SCALE_STEP
                }) rotateY(${offset * -ROTATION_Y}deg)`,
                zIndex: 10 - abs,
                // Hide if off-screen OR if the image hasn't decoded yet.
                // The transition fades it in once `isLoaded` flips true.
                opacity: isHidden || !isLoaded ? 0 : 1 - abs * OPACITY_STEP,
                pointerEvents: isHidden || !isLoaded ? "none" : "auto",
                transitionDuration: reducedMotion ? "0ms" : `${TRANSITION_MS}ms`,
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="144px"
                className="object-cover"
                priority={i === 0}
                onLoad={() => markLoaded(p.src)}
                // Handle the case where the image was already cached and
                // `load` fired before React attached the handler.
                ref={(el) => {
                  if (el?.complete) markLoaded(p.src);
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {portraits.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className="relative p-3"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-neutral-900"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          </button>
        ))}
      </div>

      {!reducedMotion && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Resume autoplay" : "Pause autoplay"}
          className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700 shadow backdrop-blur transition hover:bg-white"
        >
          {userPaused || isPaused ? "▶" : "❚❚"}
        </button>
      )}
    </div>
  );
}