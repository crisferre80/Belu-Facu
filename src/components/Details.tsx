import { Clock, MapPin, Shirt, PartyPopper, Gift, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { weddingConfig } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { useInView } from '@/hooks/useInView';

const GUEST_STORAGE_KEY = 'belen-facundo-guest';
const PROOF_STORAGE_KEY = 'belen-facundo-proof-history';

const getStoredGuest = () => {
  if (typeof window === 'undefined') return null;

  try {
    const rawValue = window.localStorage.getItem(GUEST_STORAGE_KEY);
    if (!rawValue) return null;
    return JSON.parse(rawValue) as { nombre?: string; email?: string; telefono?: string | null };
  } catch {
    return null;
  }
};

const getStoredProofHistory = () => {
  if (typeof window === 'undefined') return [] as Array<{ nombre: string; filename: string; url: string; uploadedAt: string; status: string }>;

  try {
    const rawValue = window.localStorage.getItem(PROOF_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as Array<{ nombre: string; filename: string; url: string; uploadedAt: string; status: string }>) : [];
  } catch {
    return [] as Array<{ nombre: string; filename: string; url: string; uploadedAt: string; status: string }>;
  }
};

const getGuestNameFromUrl = () => {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams(window.location.search);
  const rawValue =
    params.get('invitado') ??
    params.get('nombre') ??
    params.get('name') ??
    params.get('guest') ??
    params.get('familia') ??
    params.get('grupo') ??
    '';

  return rawValue
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
};

const getGuestNameForProof = () => {
  const urlGuest = getGuestNameFromUrl();
  if (urlGuest) return urlGuest;

  const storedGuest = getStoredGuest();
  return storedGuest?.nombre?.trim() || '';
};

export default function Details() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [activePanel, setActivePanel] = useState<'location' | 'dressCode' | null>(null);
  const [madrinasIndex, setMadrinasIndex] = useState(0);
  const [padrinosIndex, setPadrinosIndex] = useState(0);
  const [songName, setSongName] = useState('');
  const [submittedSong, setSubmittedSong] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofUploadMessage, setProofUploadMessage] = useState('');
  const [proofUploadError, setProofUploadError] = useState('');

  const nextMadrina = () => {
    setMadrinasIndex((current) => (current + 1) % weddingConfig.madrinas.length);
  };

  const prevMadrina = () => {
    setMadrinasIndex((current) => (current - 1 + weddingConfig.madrinas.length) % weddingConfig.madrinas.length);
  };

  const nextPadrino = () => {
    setPadrinosIndex((current) => (current + 1) % weddingConfig.padrinos.length);
  };

  const prevPadrino = () => {
    setPadrinosIndex((current) => (current - 1 + weddingConfig.padrinos.length) % weddingConfig.padrinos.length);
  };

  const handleSongSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSong = songName.trim();
    if (trimmedSong) {
      setSubmittedSong(trimmedSong);
    }
  };

  const handleProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setIsUploadingProof(true);
    setProofUploadMessage('');
    setProofUploadError('');

    try {
      const guestName = getGuestNameForProof();
      if (!guestName) {
        throw new Error('No pudimos identificar al invitado para asociar el comprobante. Confirmá tu asistencia primero.');
      }

      const storageBucket = 'comprobantes';
      const ext = selectedFile.name.split('.').pop() || 'file';
      const safeGuestName = guestName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'invitado';
      const storagePath = `${safeGuestName}/${safeGuestName}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type || 'application/octet-stream',
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'No se pudo subir el comprobante.');
      }

      const { data: publicUrlData } = supabase.storage.from(storageBucket).getPublicUrl(storagePath);

      const { data: existingRows, error: fetchError } = await supabase
        .from('rsvp')
        .select('id')
        .ilike('nombre', guestName)
        .limit(1);

      const proofRecord = {
        nombre: guestName,
        filename: selectedFile.name,
        url: publicUrlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        status: 'guardado',
      };

      if (fetchError) {
        throw new Error('No se pudo vincular el comprobante con tu registro.');
      }

      const guestRow = existingRows?.[0];

      if (guestRow) {
        const { error: updateError } = await supabase
          .from('rsvp')
          .update({ comprobante_url: publicUrlData.publicUrl })
          .eq('id', guestRow.id);

        if (updateError) {
          throw new Error(updateError.message || 'No se pudo guardar la URL del comprobante.');
        }

        setProofUploadMessage('Comprobante subido correctamente.');
      } else {
        const proofHistory = getStoredProofHistory();
        const updatedHistory = [...proofHistory, { ...proofRecord, status: 'guardado-localmente' }];
        window.localStorage.setItem(PROOF_STORAGE_KEY, JSON.stringify(updatedHistory));
        setProofUploadMessage('Comprobante guardado localmente. Cuando vuelvas con tu nombre registrado, quedará asociado a tu invitación.');
      }

      event.target.value = '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error al subir el comprobante.';
      setProofUploadError(message);
    } finally {
      setIsUploadingProof(false);
    }
  };

  const proofHistory = getStoredProofHistory();
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
                <p className="mt-3 text-xs uppercase tracking-[0.15em] text-[#7c5e3c]">
                  Titular: Cristian Raul Ferreyra 
                </p>
              </div>
              <div className="rounded-xl border border-[#e6d5b8] bg-white/80 p-4 text-center sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#b08968] sm:text-xs">Monto</p>
                <p className="mt-3 text-xl font-semibold text-[#3a3022] sm:text-2xl">
                  {weddingConfig.giftAmount}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <a
                  href="#confirmar"
                  className="inline-flex items-center justify-center rounded-full border border-[#d4b483] bg-white px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  Confirmar
                </a>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#7c5e3c] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white shadow-md transition hover:bg-[#5c4429] disabled:cursor-not-allowed disabled:opacity-60">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="sr-only"
                    disabled={isUploadingProof}
                    onChange={handleProofUpload}
                  />
                  {isUploadingProof ? 'Subiendo...' : 'Subir comprobante'}
                </label>
              </div>

              <p className="text-center text-xs uppercase tracking-[0.2em] text-[#b08968] sm:text-[11px]">
                Confirmá tu asistencia para registrar tu nombre y luego hacé la transferencia y subí el comprobante. La fecha límite para pagar la tarjeta es el 31 de diciembre de 2026.
              </p>

              {proofHistory.length > 0 && (
                <div className="w-full max-w-xl rounded-2xl border border-[#e6d5b8] bg-white/80 p-4 text-left">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#b08968] sm:text-xs">
                    Comprobantes subidos
                  </p>
                  <ul className="space-y-2">
                    {proofHistory.slice().reverse().map((proof, index) => (
                      <li key={`${proof.filename}-${proof.uploadedAt}-${index}`} className="flex flex-col gap-1 rounded-xl border border-[#f0e0c7] bg-[#faf6ef] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#3a3022]">{proof.filename}</p>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-[#b08968]">
                            {new Date(proof.uploadedAt).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <a
                          href={proof.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c] underline-offset-4 hover:underline"
                        >
                          Ver
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {proofUploadMessage && (
                <p className="text-center text-sm text-[#2e6b2e]">{proofUploadMessage}</p>
              )}
              {proofUploadError && (
                <p className="text-center text-sm text-[#9a3d2d]">{proofUploadError}</p>
              )}
            </div>
          </div>

          <div className="mt-14 space-y-10">
            <div>
              <div className="mb-6 flex items-center justify-center gap-3 text-center">
                <Users className="h-5 w-5 text-[#b08968]" />
                <h3 className="font-[\'Cormorant_Garamond\'] text-2xl text-[#3a3022]">
                  Madrinas
                </h3>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Anterior madrina"
                  onClick={prevMadrina}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden">
                  {weddingConfig.madrinas.map((person, index) => {
                    const isActive = index === madrinasIndex;
                    return (
                      <div
                        key={`${person.name}-${index}`}
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
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08968]">Madrina</p>
                        <p className="mt-2 text-center font-[\'Cormorant_Garamond\'] text-xl text-[#3a3022]">
                          {person.name}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  aria-label="Siguiente madrina"
                  onClick={nextMadrina}
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
                  Padrinos
                </h3>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Anterior padrino"
                  onClick={prevPadrino}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483] bg-white text-[#3a3022] shadow-sm transition hover:bg-[#f5ede0]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden">
                  {weddingConfig.padrinos.map((person, index) => {
                    const isActive = index === padrinosIndex;
                    return (
                      <div
                        key={`${person.name}-${index}`}
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
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08968]">Padrino</p>
                        <p className="mt-2 text-center font-[\'Cormorant_Garamond\'] text-xl text-[#3a3022]">
                          {person.name}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  aria-label="Siguiente padrino"
                  onClick={nextPadrino}
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
