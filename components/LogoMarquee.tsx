const LOGOS = ["Thornlie", "Myaree", "Victoria Park", "Morley",];

export function LogoMarquee({ reducedMotion }: { reducedMotion: boolean }) {
  const items = reducedMotion ? LOGOS : [...LOGOS, ...LOGOS];

  return (
    <div
      className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
      aria-label="Trusted by"
    >
      <div
        className={`flex w-max gap-10 ${
          reducedMotion ? "" : "animate-marquee hover:[animation-play-state:paused]"
        }`}
      >
        {items.map((logo, i) => (
          <span
            key={`${logo}-${i}`}
            aria-hidden={i >= LOGOS.length || undefined}
            className="text-sm font-semibold tracking-wide text-neutral-500"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}