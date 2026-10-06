import { useState } from 'react';
import { Check, Loader2, CalendarCheck, Heart } from 'lucide-react';
import { weddingConfig } from '@/lib/config';
import { supabase, type Rsvp } from '@/lib/supabase';
import { useInView } from '@/hooks/useInView';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function RsvpForm() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asistira: true,
    cantidad_acompanantes: 0,
    mensaje: '',
    restriccion_alimentaria: '',
    cancion_recomendada: '',
  });

  const update = (field: keyof typeof form, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    const nombre = form.nombre.trim();
    if (!nombre) {
      setStatus('error');
      setErrorMsg('Ingresá tu nombre y apellido para confirmar tu asistencia.');
      return;
    }

    const payload: Omit<Rsvp, 'id' | 'created_at'> = {
      nombre,
      email: form.email.trim(),
      telefono: form.telefono.trim() || null,
      asistira: form.asistira,
      cantidad_acompanantes: form.cantidad_acompanantes,
      mesa: null,
      familia: null,
      lista: null,
      grupo: null,
      invitacion_enviada: false,
      mensaje: form.mensaje.trim() || null,
      restriccion_alimentaria: form.restriccion_alimentaria.trim() || null,
      cancion_recomendada: form.cancion_recomendada.trim() || null,
    };

    const { data: existingRows, error: fetchError } = await supabase
      .from('rsvp')
      .select('*')
      .ilike('nombre', nombre)
      .limit(1);

    if (fetchError) {
      setStatus('error');
      setErrorMsg(
        'No pudimos guardar tu confirmación. Por favor, intentá nuevamente en unos momentos.'
      );
      return;
    }

    const existing = existingRows?.[0];

    const { error } = existing
      ? await supabase.from('rsvp').update(payload).eq('id', existing.id)
      : await supabase.from('rsvp').insert(payload);

    if (error) {
      setStatus('error');
      setErrorMsg(
        'No pudimos guardar tu confirmación. Por favor, intentá nuevamente en unos momentos.'
      );
      return;
    }

    window.dispatchEvent(new CustomEvent('rsvp-updated'));
    setStatus('success');
  };

  const inputClass =
    'w-full rounded-lg border border-[#e0d0b0] bg-white/80 px-4 py-3 text-[#3a3022] placeholder-[#b8a88a] focus:border-[#d4b483] focus:outline-none focus:ring-1 focus:ring-[#d4b483] transition-colors';
  const labelClass =
    'block text-sm font-medium text-[#7c5e3c] mb-1.5';

  if (status === 'success') {
    return (
      <section id="confirmar" className="bg-[#faf6ef] py-20 sm:py-28">
        <div
          ref={ref}
          className={`mx-auto max-w-xl px-6 text-center transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="rounded-3xl border border-[#e6d5b8] bg-white/80 px-8 py-16 shadow-lg">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f0e4]">
              <Check className="h-10 w-10 text-[#6b8e4e]" />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light text-[#3a3022] mb-4">
              {form.asistira ? '¡Gracias por confirmar!' : 'Gracias por avisarnos'}
            </h2>
            <p className="text-lg text-[#7c5e3c] mb-2">
              {form.nombre}, {form.asistira
                ? 'nos emociona que vengas a celebrar con nosotros.'
                : 'lamentamos que no puedas acompañarnos, pero te agradecemos el aviso.'}
            </p>
            <p className="mt-6 flex items-center justify-center gap-2 text-[#b08968]">
              <Heart className="h-4 w-4" />
              Belén y Facundo
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setForm({
                  nombre: '',
                  email: '',
                  telefono: '',
                  asistira: true,
                  cantidad_acompanantes: 0,
                  mensaje: '',
                  restriccion_alimentaria: '',
                  cancion_recomendada: '',
                });
              }}
              className="mt-10 text-sm uppercase tracking-wider text-[#b08968] underline-offset-4 hover:underline"
            >
              Enviar otra confirmación
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="confirmar" className="bg-[#faf6ef] py-20 sm:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl px-6 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#c9a96a]" />
            <CalendarCheck className="h-6 w-6 text-[#b08968]" />
            <span className="h-px w-12 bg-[#c9a96a]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light text-[#3a3022] mb-3">
            Confirmá tu asistencia
          </h2>
          <p className="text-[#7c5e3c] max-w-md mx-auto">
            {weddingConfig.welcomeText}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#e6d5b8] bg-white/70 px-6 py-10 shadow-lg sm:px-10"
        >
          {/* Asistencia */}
          <div className="mb-8">
            <p className={labelClass}>¿Podrás acompañarnos?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update('asistira', true)}
                className={`rounded-xl border-2 py-4 text-center transition-all ${
                  form.asistira
                    ? 'border-[#7c5e3c] bg-[#7c5e3c] text-white shadow-md'
                    : 'border-[#e0d0b0] bg-white/60 text-[#7c5e3c] hover:border-[#d4b483]'
                }`}
              >
                <Heart className="mx-auto mb-1 h-5 w-5" />
                <span className="text-sm font-medium">¡Sí, asistiré!</span>
              </button>
              <button
                type="button"
                onClick={() => update('asistira', false)}
                className={`rounded-xl border-2 py-4 text-center transition-all ${
                  !form.asistira
                    ? 'border-[#7c5e3c] bg-[#7c5e3c] text-white shadow-md'
                    : 'border-[#e0d0b0] bg-white/60 text-[#7c5e3c] hover:border-[#d4b483]'
                }`}
              >
                <span className="block text-2xl mb-1">✕</span>
                <span className="text-sm font-medium">No podré asistir</span>
              </button>
            </div>
          </div>

          {/* Campos principales */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="nombre">
                Nombre y apellido *
              </label>
              <input
                id="nombre"
                type="text"
                required
                value={form.nombre}
                onChange={(e) => update('nombre', e.target.value)}
                className={inputClass}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass} htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              value={form.telefono}
              onChange={(e) => update('telefono', e.target.value)}
              className={inputClass}
              placeholder="+54 385 000 0000"
            />
          </div>

          {/* Acompañantes — solo si asiste */}
          {form.asistira && (
            <>
              

              <div className="mt-5">
                <label className={labelClass} htmlFor="restriccion">
                  Restricción alimentaria
                </label>
                <input
                  id="restriccion"
                  type="text"
                  value={form.restriccion_alimentaria}
                  onChange={(e) => update('restriccion_alimentaria', e.target.value)}
                  className={inputClass}
                  placeholder="Celíaco, vegetariano, alergias… (opcional)"
                />
              </div>

              
            </>
          )}

          {/* Mensaje */}
          <div className="mt-5">
            <label className={labelClass} htmlFor="mensaje">
              Mensaje para los novios
            </label>
            <textarea
              id="mensaje"
              rows={4}
              value={form.mensaje}
              onChange={(e) => update('mensaje', e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Dejanos un mensaje, un deseo o una frase especial… (opcional)"
            />
          </div>

          {/* Error */}
          {status === 'error' && (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#7c5e3c] px-8 py-4 text-sm uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#5c4429] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                {form.asistira ? 'Confirmar asistencia' : 'Enviar respuesta'}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
