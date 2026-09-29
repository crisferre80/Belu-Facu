import { useEffect, useMemo, useState } from 'react';
import { Heart, Mail, Upload, Users, Send, ChevronDown, ChevronUp, LockKeyhole } from 'lucide-react';
import * as XLSX from 'xlsx';
import { weddingConfig } from '@/lib/config';
import { supabase, type Rsvp } from '@/lib/supabase';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '2027belen';

type Invitee = {
  id: string;
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  asistira?: boolean | null;
  cantidad_acompanantes?: number | null;
  created_at?: string | null;
};

const normalizePhone = (value: string | null | undefined) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('54')) return `549${digits.slice(2)}`;
  if (digits.startsWith('0')) return `54${digits}`;
  return digits.startsWith('54') ? digits : `54${digits}`;
};

const INVITATION_URL = 'https://belu-facu.vercel.app/';

const formatMessage = (nombre: string, customText: string) => {
  const base = customText
    .replace(/\{nombre\}/gi, nombre)
    .replace(/\{nombres?\}/gi, nombre)
    .replace(/\{bride\}/gi, weddingConfig.brideName)
    .replace(/\{groom\}/gi, weddingConfig.groomName)
    .replace(/\{link\}/gi, INVITATION_URL)
    .trim();

  return (
    base ||
    `¡Hola ${nombre}! Te invitamos a nuestra boda de ${weddingConfig.brideName} y ${weddingConfig.groomName}. Ingresá acá: ${INVITATION_URL}`
  );
};

export default function Footer() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customText, setCustomText] = useState(
    '¡Hola {nombre}! Te invitamos a celebrar nuestro día más especial. Te esperamos en nuestra boda de Belén y Facundo. Nos encantaría compartir este momento contigo. Invitación: {link}'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    const fetchInvitees = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('rsvp').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        setInvitees(
          data.map((item: Rsvp) => ({
            id: item.id,
            nombre: item.nombre,
            email: item.email,
            telefono: item.telefono,
            asistira: item.asistira,
            cantidad_acompanantes: item.cantidad_acompanantes,
            created_at: item.created_at,
          }))
        );
      }
      setIsLoading(false);
    };

    fetchInvitees();
  }, []);

  const selectedInvitees = useMemo(
    () => invitees.filter((invitee) => selectedIds.includes(invitee.id)),
    [invitees, selectedIds]
  );

  const toggleInvitee = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, string | number | boolean>>(sheet, {
        defval: '',
      });

      const imported = rows
        .map((row) => {
          const nombre = String(row.nombre ?? row.Nombre ?? row.name ?? '').trim();
          const telefono =
            String(row.telefono ?? row.Telefono ?? row.whatsapp ?? row['WhatsApp'] ?? '').trim();
          const email = String(row.email ?? row.Email ?? '').trim();

          if (!nombre) return null;

          return {
            id: `${nombre}-${telefono || email || Math.random().toString(36).slice(2, 8)}`,
            nombre,
            email: email || null,
            telefono: telefono || null,
            asistira: true,
            cantidad_acompanantes: Number(row.acompanantes ?? row['Cantidad acompañantes'] ?? 0) || 0,
            created_at: new Date().toISOString(),
          } satisfies Invitee;
        })
        .filter(Boolean) as Invitee[];

      if (!imported.length) {
        setImportMessage('No se encontraron filas válidas en el archivo.');
        return;
      }

      setInvitees((current) => [...imported, ...current]);
      setImportMessage(`Se importaron ${imported.length} invitado${imported.length > 1 ? 's' : ''}.`);
      event.target.value = '';
    } catch (error) {
      setImportMessage('No se pudo leer el archivo. Verificá que sea un Excel o CSV válido.');
      console.error(error);
    }
  };

  const sendInvites = () => {
    if (!selectedInvitees.length) return;

    selectedInvitees.forEach((invitee) => {
      const phone = normalizePhone(invitee.telefono ?? null);
      if (!phone) return;
      const message = encodeURIComponent(formatMessage(invitee.nombre, customText));
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      setAdminOpen(true);
      return;
    }

    setLoginError('Usuario o contraseña incorrectos.');
  };

  return (
    <footer className="relative overflow-hidden bg-[#2a2418] py-20 text-center">
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

        <div className="mt-10 border-t border-[#d4b483]/20 pt-8">
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                setAdminOpen((value) => !value);
                return;
              }
              setAdminOpen((value) => !value);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#d4b483]/40 bg-[#2f261d] px-3 py-2 text-[10px] uppercase tracking-[0.35em] text-[#d4b483] transition hover:border-[#d4b483]"
          >
            {adminOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Admin
          </button>
        </div>

        {adminOpen && !isAuthenticated && (
          <div className="mt-6 rounded-[2rem] border border-[#d4b483]/25 bg-[#f8f1e7] p-4 text-left shadow-[0_20px_40px_rgba(0,0,0,0.2)] sm:p-6">
            <div className="mb-4 flex items-center justify-center gap-2 text-[#3a3022]">
              <LockKeyhole className="h-5 w-5 text-[#b08968]" />
              <h3 className="text-lg font-semibold">Acceso administrativo</h3>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[#2a2418] px-4 py-3 text-xs font-medium uppercase tracking-[0.25em] text-[#f9f4ee] transition hover:bg-[#3b3128]"
              >
                Ingresar
              </button>
            </form>
          </div>
        )}

        {isAuthenticated && adminOpen && (
          <div className="mt-6 rounded-[2rem] border border-[#d4b483]/25 bg-[#f8f1e7] p-4 text-left shadow-[0_20px_40px_rgba(0,0,0,0.2)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#3a3022]">
                <Users className="h-5 w-5 text-[#b08968]" />
                <h3 className="text-lg font-semibold">Panel de invitados</h3>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d4b483]/35 bg-white px-2.5 py-2 text-xs font-medium text-[#3a3022]">
                <Upload className="h-4 w-4" />
                Import Excel
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileImport} />
              </label>
            </div>

            <div className="mb-4 rounded-2xl border border-[#e6d5b8] bg-white p-3">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                Mensaje personalizado
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-[#e0d0b0] bg-[#fffdf9] px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#7c5e3c]">
                {selectedInvitees.length} seleccionados
              </span>
              <button
                type="button"
                onClick={sendInvites}
                className="inline-flex items-center gap-2 rounded-full bg-[#2a2418] px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-[#f9f4ee] transition hover:bg-[#3b3128]"
              >
                <Send className="h-4 w-4" />
                Enviar WhatsApp
              </button>
            </div>

            {importMessage && (
              <div className="mb-4 rounded-xl border border-[#d4b483]/30 bg-[#fff8ee] px-3 py-2 text-sm text-[#5f4735]">
                {importMessage}
              </div>
            )}

            <div className="max-h-80 overflow-auto rounded-2xl border border-[#e6d5b8] bg-white">
              {isLoading ? (
                <div className="p-4 text-sm text-[#7c5e3c]">Cargando invitados…</div>
              ) : invitees.length === 0 ? (
                <div className="p-4 text-sm text-[#7c5e3c]">Todavía no hay invitados cargados.</div>
              ) : (
                <ul className="divide-y divide-[#f2e7d8]">
                  {invitees.map((invitee) => {
                    const isSelected = selectedIds.includes(invitee.id);
                    return (
                      <li key={invitee.id} className="flex items-center justify-between gap-3 p-3">
                        <button
                          type="button"
                          onClick={() => toggleInvitee(invitee.id)}
                          className={`flex-1 text-left ${isSelected ? 'text-[#3a3022]' : 'text-[#5d4b3a]'}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{invitee.nombre}</span>
                            <span className="text-xs uppercase tracking-[0.18em] text-[#b08968]">
                              {invitee.asistira ? 'Asiste' : 'No asiste'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-[#7c5e3c]">
                            {invitee.telefono ? invitee.telefono : 'Sin teléfono'}
                            {invitee.email ? ` • ${invitee.email}` : ''}
                          </div>
                        </button>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleInvitee(invitee.id)}
                          className="h-4 w-4 accent-[#b08968]"
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-[#faf6ef]/40">
          Hecho con
          <Heart className="h-3 w-3 fill-[#d4b483] text-[#d4b483]" />
          para compartir nuestro día
        </p>
      </div>
    </footer>
  );
}
