import { Heart, Mail } from 'lucide-react';
import { weddingConfig } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#2a2418] py-20 text-center">
      {/* Decoración */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border-[40px] border-[#d4b483]" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-6">
        <p className="font-['Cormorant_Garamond'] text-sm uppercase tracking-[0.4em] text-[#d4b483] mb-6">
          Con todo nuestro amor
        </p>

        <h2 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-light italic text-[#faf6ef] mb-3">
          Belén &amp; Facundo
        </h2>

        <p className="text-[#d4b483] tracking-widest text-lg mb-10">
          22 · 01 · 2027
        </p>

        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-[#d4b483]/40" />
          <p className="font-['Cormorant_Garamond'] text-lg italic text-[#faf6ef]/80">
            #{weddingConfig.hashtag}
          </p>
          <span className="h-px w-12 bg-[#d4b483]/40" />
        </div>

        <a
          href={`mailto:${weddingConfig.email}`}
          className="inline-flex items-center gap-2 text-sm text-[#d4b483]/70 transition-colors hover:text-[#d4b483]"
        >
          <Mail className="h-4 w-4" />
          {weddingConfig.email}
        </a>

        <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-[#faf6ef]/40">
          Hecho con
          <Heart className="h-3 w-3 fill-[#d4b483] text-[#d4b483]" />
          para compartir nuestro día
        </p>
      </div>
    </footer>
  );
}
