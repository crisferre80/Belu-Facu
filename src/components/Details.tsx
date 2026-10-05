import { Clock, MapPin, Shirt, PartyPopper, Gift, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Details() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [isDressCodeOpen, setIsDressCodeOpen] = useState(false);
  const [godparentsIndex, setGodparentsIndex] = useState(0);
  const [witnessesIndex, setWitnessesIndex] = useState(0);

  const nextGodparent = () => {
    setGodparentsIndex((current) => (current + 1) % weddingConfig.godparents.length);
  };

  const prevGodparent = () => {
    setGodparentsIndex((current) => (current - 1 + weddingConfig.godparents.length) % weddingConfig.godparents.length);
  };

  const nextWitness = () => {
    setWitnessesIndex((current) => (current + 1) % weddingConfig.witnesses.length);
  };

  const prevWitness = () => {
    setWitnessesIndex((current) => (current - 1 + weddingConfig.witnesses.length) % weddingConfig.witnesses.length);
  };

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
      onClick: () => setIsDressCodeOpen(true),
      clickable: true,
    },
  ];

  return (
    <>
      <section id="detalles" className="bg-[#faf6ef] py-20 sm:py-28">
        <div
          ref={ref}
          className={`mx-auto max-w-5xl px-6 transition-all duration-1000 ${
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
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`group flex flex-col items-center rounded-2xl border border-[#e6d5b8] bg-white/70 px-6 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  item.clickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4b483] bg-[#faf6ef] transition-colors group-hover:bg-[#d4b483]">
                  <item.icon className="h-7 w-7 text-[#7c5e3c] transition-colors group-hover:text-white" />
                </div>
                <h3 className="font-[\'Cormorant_Garamond\'] text-xl text-[#3a3022]">
                  {item.label}
                </h3>
                <p className="mt-2 text-lg text-[#7c5e3c]">{item.value}</p>
                <p className="mt-1 text-sm text-[#b08968]">{item.sub}</p>
                {item.clickable && (
                  <span className="mt-4 text-xs uppercase tracking-[0.25em] text-[#b08968]">
                    Ver opciones
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#e6d5b8] bg-[#f8efe5] p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-center gap-3 text-center">
              <Gift className="h-5 w-5 text-[#b08968]" />
              <h3 className="font-[\'Cormorant_Garamond\'] text-2xl text-[#3a3022]">
                Datos de la tarjeta
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#e6d5b8] bg-white/80 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[#b08968]">Alias</p>
                <p className="mt-3 text-2xl font-semibold text-[#3a3022]">{weddingConfig.giftAlias}</p>
              </div>
              <div className="rounded-xl border border-[#e6d5b8] bg-white/80 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[#b08968]">Monto</p>
                <p className="mt-3 text-2xl font-semibold text-[#3a3022]">{weddingConfig.giftAmount}</p>
              </div>
            </div>
          </div>

          <div className="mt-14 space-y-10">
            <div>
              <div className="mb-6 flex items-center justify-center gap-3 text-center">
                <Users className="h-5 w-5 text-[#b08968]" />
                <h3 className="font-[\'Cormorant_Garamond\'] text-2xl text-[#3a3022]">
                  Padrinos y madrinas
                </h3>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Anterior padrino o madrina"
                  onClick={prevGodparent}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex min-h-[220px] items-center justify-center">
                  {weddingConfig.godparents.map((person, index) => {
                    const isActive = index === godparentsIndex;
                    return (
                      <div
                        key={`${person.role}-${person.name}`}
                        className={`flex min-w-[180px] flex-col items-center rounded-full border border-[#e6d5b8] bg-white/80 p-4 shadow-sm transition-all duration-300 ${
                          isActive ? 'scale-100 opacity-100' : 'hidden scale-95 opacity-0'
                        }`}
                      >
                        <div className="mb-3 h-28 w-28 overflow-hidden rounded-full border-4 border-[#d4b483] bg-[#f5ede0] shadow-md">
                          <img
                            src={person.image}
                            alt={person.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08968]">{person.role}</p>
                        <p className="mt-2 text-center font-[\'Cormorant_Garamond\'] text-xl text-[#3a3022]">
                          {person.name}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  aria-label="Siguiente padrino o madrina"
                  onClick={nextGodparent}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-center gap-3 text-center">
                <Users className="h-5 w-5 text-[#b08968]" />
                <h3 className="font-[\'Cormorant_Garamond\'] text-2xl text-[#3a3022]">
                  Testigos
                </h3>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Anterior testigo"
                  onClick={prevWitness}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex min-h-[220px] items-center justify-center">
                  {weddingConfig.witnesses.map((person, index) => {
                    const isActive = index === witnessesIndex;
                    return (
                      <div
                        key={`${person.role}-${person.name}`}
                        className={`flex min-w-[180px] flex-col items-center rounded-full border border-[#e6d5b8] bg-white/80 p-4 shadow-sm transition-all duration-300 ${
                          isActive ? 'scale-100 opacity-100' : 'hidden scale-95 opacity-0'
                        }`}
                      >
                        <div className="mb-3 h-28 w-28 overflow-hidden rounded-full border-4 border-[#d4b483] bg-[#f5ede0] shadow-md">
                          <img
                            src={person.image}
                            alt={person.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08968]">{person.role}</p>
                        <p className="mt-2 text-center font-[\'Cormorant_Garamond\'] text-xl text-[#3a3022]">
                          {person.name}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  aria-label="Siguiente testigo"
                  onClick={nextWitness}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
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

      {isDressCodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3a3022]/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-[2rem] border border-[#e6d5b8] bg-[#faf6ef] p-4 shadow-2xl sm:p-6">
            <button
              type="button"
              aria-label="Cerrar código de vestimenta"
              onClick={() => setIsDressCodeOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] transition hover:bg-[#f5ede0]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 pt-8 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#b08968]">Código de vestimenta</p>
              <h3 className="mt-3 font-[\'Cormorant_Garamond\'] text-3xl text-[#3a3022]">
                Elegí tu estilo ideal
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {weddingConfig.dressCodeOptions.map((option) => (
                <div
                  key={option.title}
                  className="overflow-hidden rounded-[1.25rem] border border-[#e6d5b8] bg-white shadow-sm"
                >
                  <img
                    src={option.image}
                    alt={option.title}
                    className="h-[260px] w-full object-cover object-center sm:h-[360px]"
                  />
                  <div className="p-3 text-center sm:p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#b08968] sm:text-xs">
                      {option.title}
                    </p>
                    <p className="mt-2 text-xs text-[#4a3d2e] sm:text-sm">{option.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
