import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Story() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="historia" className="bg-[#f5ede0] py-20 sm:py-32">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-6 text-center transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-[#c9a96a]" />
          <p className="font-[\'Cormorant_Garamond\'] text-sm uppercase tracking-[0.4em] text-[#b08968]">
            Nuestra historia
          </p>
          <span className="h-px w-16 bg-[#c9a96a]" />
        </div>

        <p className="font-[\'Cormorant_Garamond\'] text-xl sm:text-2xl leading-relaxed text-[#4a3d2e] font-light italic">
          {weddingConfig.storyText}
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl shadow-xl">
          <img
            src={weddingConfig.bouquetImage}
            alt="Nuestra Alianza"
            className="w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
