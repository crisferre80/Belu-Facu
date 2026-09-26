import { weddingConfig } from '@/lib/config';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Video de fondo en loop */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="https://res.cloudinary.com/dhvrrxejo/video/upload/v1790452001/WhatsApp_Video_2026-09-26_at_16.45.45_vximdq.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="pointer-events-none absolute inset-[12px] z-10 rounded-[2.2rem] border-[3px] border-transparent bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.95)_18%,rgba(255,255,255,0.6)_35%,rgba(255,255,255,0.16)_60%,rgba(255,255,255,0.05)_100%)] p-[2px] shadow-[0_0_45px_rgba(255,255,255,0.85),0_0_110px_rgba(255,255,255,0.18)] sm:inset-[14px]" />
      <div className="pointer-events-none absolute inset-[22px] z-10 rounded-[1.9rem] border-[1.5px] border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.32),rgba(255,255,255,0.08))] shadow-[inset_0_0_26px_rgba(255,255,255,0.3)] sm:inset-[26px]" />

      {/* Overlay suave */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_38%,rgba(0,0,0,0.42)_100%)]" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#3a3022]/30 via-[#3a3022]/20 to-[#2a2418]/60" />

      {/* Contenido */}
      <div className="relative z-30 flex flex-col items-center px-6 text-center text-[#faf6ef] animate-fade-in-up">
        <p className="font-[\'Cormorant_Garamond\'] text-sm uppercase tracking-[0.5em] mb-6 opacity-90">
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
            22 · 01 · 2027
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
