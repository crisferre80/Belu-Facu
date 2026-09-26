import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Gallery() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const images = weddingConfig.galleryImages;

  return (
    <section id="galeria" className="bg-[#faf6ef] py-20 sm:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-5xl px-6 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-center font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light text-[#3a3022] mb-4">
          Momentos que atesoramos
        </h2>
        <p className="mb-12 text-center text-sm uppercase tracking-[0.3em] text-[#b08968]">
          Nuestro camino hasta aquí
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {images.map((src, i) => (
            <div
              key={src}
              className={`overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:shadow-xl ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={src}
                alt={`Foto ${i + 1} de Belén y Facundo`}
                className={`w-full object-cover transition-transform duration-700 hover:scale-110 ${
                  i === 0 ? 'h-full min-h-[280px]' : 'h-40 sm:h-52'
                }`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
