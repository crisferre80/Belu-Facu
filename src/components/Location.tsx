import { ExternalLink, Navigation } from 'lucide-react';
import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Location() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const { venueLat, venueLng, mapsQuery } = weddingConfig;

  const embedSrc = `https://maps.google.com/maps?q=${mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venueLat},${venueLng}`;
  const placeUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section id="ubicacion" className="bg-[#f5ede0] py-20 sm:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-6 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-center font-[\'Cormorant_Garamond\'] text-3xl sm:text-4xl font-light text-[#3a3022] mb-4">
          Cómo llegar
        </h2>
        <p className="mb-10 text-center text-sm uppercase tracking-[0.3em] text-[#b08968]">
          Te esperamos en {weddingConfig.venueName}
        </p>

        <div className="overflow-hidden rounded-2xl border-4 border-white shadow-xl">
          <iframe
            title="Mapa del lugar de la boda"
            src={embedSrc}
            className="h-[320px] w-full sm:h-[420px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7c5e3c] px-8 py-3.5 text-sm uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#5c4429] hover:shadow-lg"
          >
            <Navigation className="h-4 w-4" />
            Cómo llegar
          </a>
          <a
            href={placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d4b483] bg-white px-8 py-3.5 text-sm uppercase tracking-wider text-[#7c5e3c] shadow-sm transition-all hover:bg-[#faf6ef] hover:shadow-md"
          >
            <ExternalLink className="h-4 w-4" />
            Ver en Google Maps
          </a>
        </div>

        <p className="mt-6 text-center text-sm text-[#b08968]">
          {weddingConfig.venueAddress}
        </p>
      </div>
    </section>
  );
}
