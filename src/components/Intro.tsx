import { useState } from 'react';
import { weddingConfig } from '@/lib/config';

type Props = {
  onEnter: () => void;
};

export default function Intro({ onEnter }: Props) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div
      className="relative flex min-h-screen cursor-pointer items-center justify-center overflow-hidden bg-[#2a2418]"
      onClick={onEnter}
    >
      {/* Video de fondo del sobre animado */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://res.cloudinary.com/dhvrrxejo/video/upload/v1790455774/sobre_animado_e1hllt.mp4"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
      />

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2418]/50 via-[#2a2418]/30 to-[#2a2418]/70" />

      {/* Contenido superpuesto */}
      <div
        className={`relative z-10 flex flex-col items-center px-6 text-center text-[#faf6ef] transition-all duration-1000 ${
          videoReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="font-['Cormorant_Garamond'] text-sm uppercase tracking-[0.5em] mb-6 opacity-80">
          Tenés una invitación
        </p>

        <div className="flex items-center gap-4 sm:gap-8">
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl md:text-6xl font-light italic drop-shadow-lg">
            {weddingConfig.brideName}
          </h1>
          <span className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl md:text-4xl font-light opacity-60">
            &
          </span>
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl md:text-6xl font-light italic drop-shadow-lg">
            {weddingConfig.groomName}
          </h1>
        </div>

        <div className="mt-8 flex items-center gap-3 opacity-70">
          <span className="h-px w-12 bg-[#d4b483]" />
          <p className="font-['Cormorant_Garamond'] text-base sm:text-lg tracking-widest">
            22 · 01 · 2027
          </p>
          <span className="h-px w-12 bg-[#d4b483]" />
        </div>

        {/* Indicador de clic */}
        <div className="mt-20 flex flex-col items-center gap-3 animate-fade-in-up">
          <div className="rounded-full border border-[#d4b483]/40 bg-[#2a2418]/30 px-8 py-3 backdrop-blur-sm transition-all hover:bg-[#d4b483]/20">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4b483]">
              Tocá para abrir
            </p>
          </div>
          <svg
            className="h-6 w-6 animate-bounce text-[#d4b483]/70"
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
        </div>
      </div>
    </div>
  );
}
