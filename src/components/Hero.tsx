import { weddingConfig } from '@/lib/config';

type HeroProps = {
  guestLabel?: string;
  familyName?: string;
  familyMembers?: string[];
};

export default function Hero({ guestLabel, familyName, familyMembers = [] }: HeroProps) {
  const familySummary = familyName && familyMembers.length ? `${familyName}: ${familyMembers.join(', ')}` : '';
  const personalizedText = guestLabel
    ? `${guestLabel}, te invitamos a compartir nuestra historia.`
    : familySummary
      ? `${familySummary}. Te invitamos a compartir nuestra historia.`
      : 'Te invitamos a compartir nuestra historia.';

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={weddingConfig.heroImage}
        alt="Belén y Facundo"
      />

      <div className="pointer-events-none absolute inset-[8px] z-10 rounded-[1.8rem] border border-white/20 sm:inset-[10px]" />

      {/* Overlay suave */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_35%,rgba(0,0,0,0.32)_100%)]" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#3a3022]/30 via-[#3a3022]/20 to-[#2a2418]/60" />

      {/* Contenido */}
      <div className="relative z-30 flex flex-col items-center px-6 text-center text-[#faf6ef] animate-fade-in-up">
        <div className="mb-6 w-fit max-w-[90vw] rounded-full border border-[#f6ead7]/40 bg-[#2a231b]/35 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-[2px] sm:px-7">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#fef4e4] sm:text-xs">
            {personalizedText}
          </p>
        </div>

        {familySummary && (
          <div className="mb-4 rounded-full border border-white/20 bg-[#2a231b]/25 px-4 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.15)] backdrop-blur-sm">
            <p className="text-[0.6rem] uppercase tracking-[0.28em] text-[#f9ead2] sm:text-[0.7rem]">
              {familySummary}
            </p>
          </div>
        )}

        <p className="font-[\'Cormorant_Garamond\'] mb-6 text-sm uppercase tracking-[0.5em] text-[#f7ebdc] opacity-95">
          ¡Nos casamos!
        </p>

        <div className="flex items-center gap-4 sm:gap-8">
          <h1 className="font-[\'Cormorant_Garamond\'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light italic drop-shadow-lg">
            Belén
          </h1>
          <span className="font-[\'Cormorant_Garamond\'] text-3xl sm:text-4xl md:text-5xl font-light opacity-70">
            &
          </span>
          <h1 className="font-[\'Cormorant_Garamond\'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light italic drop-shadow-lg">
            Facundo
          </h1>
        </div>

        <div className="mt-8 flex items-center gap-3 opacity-80">
          <span className="h-px w-12 bg-[#d4b483]" />
          <p className="font-[\'Cormorant_Garamond\'] text-lg sm:text-xl tracking-widest">
            30 · 01 · 2027
          </p>
          <span className="h-px w-12 bg-[#d4b483]" />
        </div>

        <a
          href="#historia"
          className="mt-16 flex flex-col items-center gap-2 text-[#d4b483] transition-transform hover:translate-y-1"
          aria-label="Deslizar para ver más"
        >
          <span className="text-xs uppercase tracking-[0.3em] opacity-70">
            Desliza
          </span>
          <svg
            className="h-6 w-6 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
