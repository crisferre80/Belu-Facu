import { Clock, MapPin, Shirt, PartyPopper } from 'lucide-react';
import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Details() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const items = [
    {
      icon: Clock,
      label: 'Ceremonia',
      value: weddingConfig.ceremonyTime,
      sub: 'Iglesia San Francisco',
    },
    {
      icon: PartyPopper,
      label: 'Fiesta',
      value: weddingConfig.partyTime,
      sub: 'Salón principal de Camioneros',
    },
    {
      icon: Shirt,
      label: 'Código de vestimenta',
      value: weddingConfig.dressCode,
      sub: 'Formal',
    },
  ];

  return (
    <section id="detalles" className="bg-[#faf6ef] py-20 sm:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-6 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="mb-4 text-center font-[\'Cormorant_Garamond\'] text-3xl sm:text-4xl font-light text-[#3a3022]">
          Detalles del evento
        </h2>
        <p className="mb-12 text-center text-sm uppercase tracking-[0.3em] text-[#b08968]">
          Todo lo que necesitas saber
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="group flex flex-col items-center rounded-2xl border border-[#e6d5b8] bg-white/70 px-6 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4b483] bg-[#faf6ef] transition-colors group-hover:bg-[#d4b483]">
                <item.icon className="h-7 w-7 text-[#7c5e3c] transition-colors group-hover:text-white" />
              </div>
              <h3 className="font-[\'Cormorant_Garamond\'] text-xl text-[#3a3022]">
                {item.label}
              </h3>
              <p className="mt-2 text-lg text-[#7c5e3c]">{item.value}</p>
              <p className="mt-1 text-sm text-[#b08968]">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 rounded-xl bg-[#f5ede0] px-6 py-5">
          <MapPin className="h-5 w-5 text-[#b08968]" />
          <p className="text-center text-[#4a3d2e]">
            <span className="font-medium">{weddingConfig.venueName}</span> —{' '}
            {weddingConfig.venueAddress}
          </p>
        </div>
      </div>
    </section>
  );
}
