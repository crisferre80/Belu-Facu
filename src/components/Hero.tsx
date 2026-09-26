import { weddingConfig } from '@/lib/config';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Video de fondo en loop */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://res.cloudinary.com/dhvrrxejo/video/upload/v1790452001/WhatsApp_Video_2026-09-26_at_16.45.45_vximdq.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a3022]/40 via-[#3a3022]/30 to-[#2a2418]/70" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center text-[#faf6ef] animate-fade-in-up">
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
