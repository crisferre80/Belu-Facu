import { Clock, MapPin, Shirt, PartyPopper, Gift, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { weddingConfig } from '@/lib/config';
import { useInView } from '@/hooks/useInView';

export default function Details() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [activePanel, setActivePanel] = useState<'location' | 'dressCode' | null>(null);
  const [godparentsIndex, setGodparentsIndex] = useState(0);
  const [witnessesIndex, setWitnessesIndex] = useState(0);
  const [songName, setSongName] = useState('');
  const [submittedSong, setSubmittedSong] = useState('');

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

  const handleSongSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSong = songName.trim();
    if (trimmedSong) {
      setSubmittedSong(trimmedSong);
    }
  };

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(weddingConfig.mapsQuery)}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${weddingConfig.venueLat},${weddingConfig.venueLng}`;
  const placeUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weddingConfig.mapsQuery)}`;

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
      onClick: () => setActivePanel((current) => (current === 'location' ? null : 'location')),
      clickable: true,
    },
    {
      icon: Shirt,
      label: 'Código de vestimenta',
      value: weddingConfig.dressCode,
      sub: 'Formal',
      onClick: () => setActivePanel((current) => (current === 'dressCode' ? null : 'dressCode')),
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
              <div key={item.label} className="contents">
                <button
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

                {activePanel === 'location' && item.label === 'Fiesta' && (
                  <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[#e6d5b8] bg-[#f8efe5] p-4 shadow-sm sm:col-span-3 sm:p-6">
                    <div className="mb-5 text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#b08968]">Cómo llegar</p>
                      <h3 className="mt-3 font-[\'Cormorant_Garamond\'] text-3xl text-[#3a3022]">
                        {weddingConfig.venueAddress}
                      </h3>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#e6d5b8] bg-white">
                      <iframe
                        title="Mapa del lugar de la boda"
                        src={embedSrc}
                        className="h-[260px] w-full sm:h-[320px]"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7c5e3c] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white shadow-md transition hover:bg-[#5c4429]"
                      >
                        Cómo llegar
                      </a>
                      <a
                        href={placeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4b483] bg-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c] transition hover:bg-[#faf6ef]"
                      >
                        Ver en Google Maps
                      </a>
                    </div>

                    <p className="mt-4 text-center text-sm text-[#4a3d2e]">{weddingConfig.venueAddress}</p>
                  </div>
                )}

                {activePanel === 'dressCode' && item.label === 'Código de vestimenta' && (
                  <div className="mt-4 rounded-[1.5rem] border border-[#e6d5b8] bg-[#f8efe5] p-4 shadow-sm sm:col-span-3 sm:p-6">
                    <div className="mb-5 text-center">
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
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#e6d5b8] bg-[#f8efe5] p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-center gap-3 text-center">
              <Gift className="h-5 w-5 text-[#b08968]" />
              <h3 className="font-[\'Cormorant_Garamond\'] text-2xl text-[#3a3022]">
                Datos de la tarjeta
              </h3>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#e6d5b8] bg-white/80 p-4 text-center sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#b08968] sm:text-xs">Alias</p>
                <p className="mt-3 break-all text-xl font-semibold text-[#3a3022] sm:text-2xl">
                  {weddingConfig.giftAlias}
                </p>
              </div>
              <div className="rounded-xl border border-[#e6d5b8] bg-white/80 p-4 text-center sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#b08968] sm:text-xs">Monto</p>
                <p className="mt-3 text-xl font-semibold text-[#3a3022] sm:text-2xl">
                  {weddingConfig.giftAmount}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 space-y-10">
            <div>
              <div className="mb-6 flex items-center justify-center gap-3 text-center">
                <Users className="h-5 w-5 text-[#b08968]" />
                <h3 className="font-[\'Cormorant_Garamond\'] text-2xl text-[#3a3022]">
                  Padrinos y Madrinas
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

                <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden">
                  {weddingConfig.godparents.map((person, index) => {
                    const isActive = index === godparentsIndex;
                    return (
                      <div
                        key={`${person.role}-${person.name}`}
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-[#e6d5b8] bg-white/80 p-4 shadow-[0_24px_50px_rgba(58,48,34,0.08)] backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? 'translate-x-0 scale-100 opacity-100 blur-0'
                            : 'pointer-events-none translate-x-8 scale-95 opacity-0 blur-sm'
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

                <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden">
                  {weddingConfig.witnesses.map((person, index) => {
                    const isActive = index === witnessesIndex;
                    return (
                      <div
                        key={`${person.role}-${person.name}`}
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-[#e6d5b8] bg-white/80 p-4 shadow-[0_24px_50px_rgba(58,48,34,0.08)] backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? 'translate-x-0 scale-100 opacity-100 blur-0'
                            : 'pointer-events-none -translate-x-8 scale-95 opacity-0 blur-sm'
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

          <div className="mt-12 rounded-[2rem] border border-[#e6d5b8] bg-[#f8efe5] p-5 shadow-sm sm:p-7">
            <div className="mb-5 text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <PartyPopper className="h-5 w-5 text-[#b08968]" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#b08968]">Registro musical</p>
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-3xl text-[#3a3022] sm:text-4xl">
                ¿Qué canción no puede faltar en la fiesta?
              </h3>
            </div>

            <form onSubmit={handleSongSubmit} className="mx-auto max-w-xl space-y-4">
              <label className="block text-left text-sm font-medium uppercase tracking-[0.2em] text-[#7c5e3c]">
                Nombre de la canción
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={songName}
                  onChange={(event) => setSongName(event.target.value)}
                  placeholder="Escribí el nombre de la canción"
                  className="w-full rounded-full border border-[#e6d5b8] bg-white px-4 py-3 text-sm text-[#3a3022] outline-none transition placeholder:text-[#a38d79] focus:border-[#d4b483] focus:ring-2 focus:ring-[#ead9bf]"
                />
                <button
                  type="submit"
                  className="rounded-full border border-[#d4b483] bg-[#f5ede0] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#3a3022] transition hover:bg-[#ead9bf]"
                >
                  Guardar
                </button>
              </div>
            </form>

            {submittedSong && (
              <p className="mt-4 text-center text-sm text-[#4a3d2e]">
                Tu canción elegida es:{' '}
                <span className="font-semibold text-[#3a3022]">{submittedSong}</span>
              </p>
            )}
          </div>          
        </div>
      </section>

    </>
  );
}
