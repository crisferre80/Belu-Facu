import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Gallery() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const images = weddingConfig.galleryImages;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [images.length]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const activeImage = images[activeIndex];

  return (
    <section id="galeria" className="bg-[#faf6ef] py-20 sm:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-5xl px-6 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="mb-4 text-center font-['Cormorant_Garamond'] text-3xl font-bold text-[#3a3022] sm:text-4xl">
          Book de Fotos
        </h1>
        <h2 className="mb-4 text-center font-['Cormorant_Garamond'] text-3xl font-light text-[#3a3022] sm:text-4xl">
          Momentos que atesoraremos
        </h2>
        <p className="mb-10 text-center text-sm uppercase tracking-[0.3em] text-[#b08968]">
          Nuestro camino hasta aquí
        </p>

        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-transparent p-0 sm:p-0">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),rgba(255,255,255,0.06)_40%,rgba(0,0,0,0.12)_100%)] blur-2xl opacity-90" />

            <div className="relative overflow-hidden rounded-[1.5rem]">
              <img
                src={activeImage}
                alt={`Foto ${activeIndex + 1} de Belén y Facundo`}
                className="relative z-10 h-[420px] w-full object-cover sm:h-[560px]"
                style={{
                  filter: 'saturate(1.05) contrast(1.03)',
                  borderRadius: '1.5rem',
                  boxShadow: 'none',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                aria-label="Foto anterior"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-[#3a3022] shadow-[0_8px_24px_rgba(58,48,34,0.18)] backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                aria-label="Siguiente foto"
                onClick={goToNext}
                className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-[#3a3022] shadow-[0_8px_24px_rgba(58,48,34,0.18)] backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#2d231b]/75 to-transparent p-5 text-left text-white">
                <div className="text-xs uppercase tracking-[0.28em] text-[#f5e6d6]">
                  Galería
                </div>
                <div className="mt-2 text-lg font-medium sm:text-xl">
                  {activeIndex + 1} / {images.length}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-1 pt-1">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Ver foto ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/50 bg-[#f7efe8] transition-all duration-300 sm:h-20 sm:w-20 ${
                    activeIndex === index ? 'scale-105 opacity-100 ring-2 ring-[#b08968]/80' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={src}
                    alt={`Miniatura ${index + 1}`}
                    className="h-full w-full object-cover"
                    style={{ borderRadius: '9999px' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
