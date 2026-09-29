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
  mesa?: number | null;
  familia?: string | null;
  lista?: string | null;
  grupo?: string | null;
  created_at?: string | null;
};

const TABLE_COUNT = 10;

const normalizePhone = (value: string | null | undefined) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('54')) return `549${digits.slice(2)}`;
  if (digits.startsWith('0')) return `54${digits}`;
  return digits.startsWith('54') ? digits : `54${digits}`;
};

const INVITATION_URL = 'https://belu-facu.vercel.app/';

const buildInvitationLink = (nombre: string, familyName?: string | null, familyMembers: string[] = []) => {
  const params = new URLSearchParams();
  const cleanName = nombre.trim();
  const cleanFamily = familyName?.trim();
  const cleanMembers = Array.from(new Set(familyMembers.map((member) => member.trim()).filter(Boolean)));

  params.set('invitado', cleanName);
  if (cleanFamily) params.set('familia', cleanFamily);
  if (cleanMembers.length) params.set('integrantes', cleanMembers.join(', '));

  return `${INVITATION_URL}?${params.toString()}`;
};

const formatMessage = (nombre: string, customText: string, familyName?: string | null, familyMembers: string[] = []) => {
  const link = buildInvitationLink(nombre, familyName, familyMembers);
  const base = customText
    .replace(/\{nombre\}/gi, nombre)
    .replace(/\{nombres?\}/gi, nombre)
    .replace(/\{familia\}/gi, familyName ?? '')
    .replace(/\{grupos?\}/gi, familyName ?? '')
    .replace(/\{integrantes?\}/gi, familyMembers.join(', '))
    .replace(/\{miembros?\}/gi, familyMembers.join(', '))
    .replace(/\{bride\}/gi, weddingConfig.brideName)
    .replace(/\{groom\}/gi, weddingConfig.groomName)
    .replace(/\{link\}/gi, link)
    .trim();

  const familyText = familyName ? ` Familia: ${familyName}${familyMembers.length ? ` (${familyMembers.join(', ')})` : ''}.` : '';

  return (
    base ||
    `¡Hola ${nombre}!${familyText} Te invitamos a nuestra boda de ${weddingConfig.brideName} y ${weddingConfig.groomName}. Ingresá acá: ${link}`
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFamily, setFilterFamily] = useState('all');
  const [filterMesa, setFilterMesa] = useState('all');
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);
  const [draftInvitee, setDraftInvitee] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mesa: null as number | null,
    familia: '',
    lista: '',
    grupo: '',
    asistira: true,
  });
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
            mesa: item.mesa ?? null,
            familia: item.familia ?? null,
            lista: item.lista ?? null,
            grupo: item.grupo ?? null,
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

  const tableGroups = useMemo(
    () =>
      Array.from({ length: TABLE_COUNT }, (_, index) => {
        const mesa = index + 1;
        return {
          mesa,
          invitees: invitees.filter((invitee) => invitee.mesa === mesa),
        };
      }),
    [invitees]
  );

  const familyGroups = useMemo(() => {
    const grouped = new Map<string, Invitee[]>();

    invitees.forEach((invitee) => {
      const labels = [invitee.familia, invitee.lista, invitee.grupo].filter(Boolean) as string[];
      labels.forEach((label) => {
        const key = label.trim();
        if (!key) return;
        const current = grouped.get(key) ?? [];
        if (!current.some((item) => item.id === invitee.id)) {
          current.push(invitee);
        }
        grouped.set(key, current);
      });
    });

    return Array.from(grouped.entries())
      .map(([name, groupInvitees]) => ({ name, invitees: groupInvitees }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [invitees]);

  const selectedFamilyMembers = useMemo(() => {
    if (!selectedFamily) return [];
    return invitees.filter((invitee) =>
      [invitee.familia, invitee.lista, invitee.grupo].includes(selectedFamily)
    );
  }, [invitees, selectedFamily]);

  const filteredInvitees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return invitees.filter((invitee) => {
      const matchesSearch =
        !query ||
        invitee.nombre.toLowerCase().includes(query) ||
        (invitee.telefono ?? '').toLowerCase().includes(query) ||
        (invitee.email ?? '').toLowerCase().includes(query) ||
        (invitee.familia ?? '').toLowerCase().includes(query) ||
        (invitee.grupo ?? '').toLowerCase().includes(query);

      const matchesFamily =
        filterFamily === 'all' ||
        [invitee.familia, invitee.lista, invitee.grupo].includes(filterFamily);

      const matchesMesa = filterMesa === 'all' || String(invitee.mesa ?? '') === filterMesa;
      const matchesConfirmed = !showOnlyConfirmed || invitee.asistira === true;

      return matchesSearch && matchesFamily && matchesMesa && matchesConfirmed;
    });
  }, [invitees, searchTerm, filterFamily, filterMesa, showOnlyConfirmed]);

  const adminSummary = useMemo(() => {
    const confirmed = invitees.filter((invitee) => invitee.asistira).length;
    const pending = invitees.length - confirmed;
    const uniqueFamilies = new Set(
      invitees
        .flatMap((invitee) => [invitee.familia, invitee.lista, invitee.grupo])
        .filter((value): value is string => Boolean(value))
    );
    const uniqueTables = new Set(
      invitees
        .map((invitee) => invitee.mesa)
        .filter((value): value is number => value !== null && value > 0)
    );

    return {
      total: invitees.length,
      confirmed,
      pending,
      families: uniqueFamilies.size,
      tables: uniqueTables.size,
    };
  }, [invitees]);

  const startEditing = (invitee: Invitee) => {
    setEditingId(invitee.id);
    setDraftInvitee({
      nombre: invitee.nombre ?? '',
      email: invitee.email ?? '',
      telefono: invitee.telefono ?? '',
      mesa: invitee.mesa ?? null,
      familia: invitee.familia ?? '',
      lista: invitee.lista ?? '',
      grupo: invitee.grupo ?? '',
      asistira: invitee.asistira ?? true,
    });
  };

  const saveInvitee = async () => {
    if (!editingId) return;

    const trimmedNombre = draftInvitee.nombre.trim();
    const trimmedEmail = draftInvitee.email.trim();
    const trimmedTelefono = draftInvitee.telefono.trim();

    if (!trimmedNombre) return;

    const familyValue = draftInvitee.familia?.trim() || null;
    const listValue = draftInvitee.lista?.trim() || null;
    const groupValue = draftInvitee.grupo?.trim() || null;

    const safeEmail = trimmedEmail || '';

    const { error } = await supabase
      .from('rsvp')
      .update({
        nombre: trimmedNombre,
        email: safeEmail,
        telefono: trimmedTelefono || null,
        mesa: draftInvitee.mesa,
        familia: familyValue,
        lista: listValue,
        grupo: groupValue,
        asistira: draftInvitee.asistira,
      })
      .eq('id', editingId);

    if (!error) {
      setInvitees((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                nombre: trimmedNombre,
                email: trimmedEmail || '',
                telefono: trimmedTelefono || null,
                mesa: draftInvitee.mesa,
                familia: familyValue,
                lista: listValue,
                grupo: groupValue,
                asistira: draftInvitee.asistira,
              }
            : item
        )
      );
      setEditingId(null);
    }
  };

  const deleteInvitee = async (id: string) => {
    const confirmed = window.confirm('¿Seguro que querés borrar este invitado?');
    if (!confirmed) return;

    const { error } = await supabase.from('rsvp').delete().eq('id', id);
    if (!error) {
      setInvitees((current) => current.filter((invitee) => invitee.id !== id));
      setSelectedIds((current) => current.filter((item) => item !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

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
          const rawMesa = row.mesa ?? row.Mesa ?? row['Mesa'] ?? row['Mesa Nº'] ?? row['mesa_numero'] ?? null;
          const mesaNumber = Number(rawMesa);
          const mesa = Number.isFinite(mesaNumber) && mesaNumber >= 1 && mesaNumber <= TABLE_COUNT ? mesaNumber : null;
          const familia = String(row.familia ?? row.Familia ?? row['Familia'] ?? row['Grupo familiar'] ?? '').trim();
          const lista = String(row.lista ?? row.Lista ?? row['Lista'] ?? row['Lista familiar'] ?? '').trim();
          const grupo = String(row.grupo ?? row.Grupo ?? row['Grupo'] ?? '').trim();

          if (!nombre) return null;

          const generatedId =
            typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

          return {
            id: generatedId,
            nombre,
            email: email || null,
            telefono: telefono || null,
            asistira: true,
            cantidad_acompanantes: Number(row.acompanantes ?? row['Cantidad acompañantes'] ?? 0) || 0,
            mesa,
            familia: familia || null,
            lista: lista || null,
            grupo: grupo || null,
            created_at: new Date().toISOString(),
          } satisfies Invitee;
        })
        .filter(Boolean) as Invitee[];

      if (!imported.length) {
        setImportMessage('No se encontraron filas válidas en el archivo.');
        return;
      }

      const rowsToInsert = imported.map((invitee) => ({
        id: invitee.id,
        nombre: invitee.nombre,
        email: invitee.email || '',
        telefono: invitee.telefono || null,
        asistira: invitee.asistira ?? true,
        cantidad_acompanantes: invitee.cantidad_acompanantes ?? 0,
        mesa: invitee.mesa ?? null,
        familia: invitee.familia ?? null,
        lista: invitee.lista ?? null,
        grupo: invitee.grupo ?? null,
        mensaje: null,
        restriccion_alimentaria: null,
        cancion_recomendada: null,
        created_at: invitee.created_at ?? new Date().toISOString(),
      }));

      const { error } = await supabase.from('rsvp').insert(rowsToInsert);

      if (error) {
        throw error;
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
      const familyName = invitee.familia ?? invitee.lista ?? invitee.grupo ?? null;
      const familyMembers = invitees
        .filter((item) =>
          [item.familia, item.lista, item.grupo].includes(familyName ?? '') && item.nombre !== invitee.nombre
        )
        .map((item) => item.nombre);
      const message = encodeURIComponent(formatMessage(invitee.nombre, customText, familyName, [invitee.nombre, ...familyMembers]));
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  const exportInvitees = () => {
    const rows = (filteredInvitees.length ? filteredInvitees : invitees).map((invitee) => ({
      nombre: invitee.nombre,
      telefono: invitee.telefono ?? '',
      email: invitee.email ?? '',
      mesa: invitee.mesa ?? '',
      familia: invitee.familia ?? '',
      lista: invitee.lista ?? '',
      grupo: invitee.grupo ?? '',
      asistira: invitee.asistira ? 'Sí' : 'No',
      acompanantes: invitee.cantidad_acompanantes ?? 0,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invitados');
    XLSX.writeFile(wb, `invitados_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const assignFamilyToSelection = async (newFamilyName: string) => {
    const trimmedName = newFamilyName.trim();
    if (!trimmedName) return;

    const targetIds = selectedIds.length ? selectedIds : invitees.map((invitee) => invitee.id);
    if (!targetIds.length) return;

    const { error } = await supabase
      .from('rsvp')
      .update({ familia: trimmedName, lista: trimmedName, grupo: trimmedName })
      .in('id', targetIds);

    if (!error) {
      setInvitees((current) =>
        current.map((invitee) =>
          targetIds.includes(invitee.id)
            ? {
                ...invitee,
                familia: trimmedName,
                lista: trimmedName,
                grupo: trimmedName,
              }
            : invitee
        )
      );
      setFamilyName('');
      setSelectedFamily(trimmedName);
    }
  };

  const renameFamilyGroup = async (oldName: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === oldName) return;

    const targetIds = invitees
      .filter((invitee) => [invitee.familia, invitee.lista, invitee.grupo].includes(oldName))
      .map((invitee) => invitee.id);

    if (!targetIds.length) return;

    const { error } = await supabase
      .from('rsvp')
      .update({ familia: trimmedName, lista: trimmedName, grupo: trimmedName })
      .in('id', targetIds);

    if (!error) {
      setInvitees((current) =>
        current.map((invitee) =>
          targetIds.includes(invitee.id)
            ? {
                ...invitee,
                familia: trimmedName,
                lista: trimmedName,
                grupo: trimmedName,
              }
            : invitee
        )
      );
      setSelectedFamily(trimmedName);
    }
  };

  const deleteFamilyGroup = async (groupName: string) => {
    const targetIds = invitees
      .filter((invitee) => [invitee.familia, invitee.lista, invitee.grupo].includes(groupName))
      .map((invitee) => invitee.id);

    if (!targetIds.length) return;

    const { error } = await supabase
      .from('rsvp')
      .update({ familia: null, lista: null, grupo: null })
      .in('id', targetIds);

    if (!error) {
      setInvitees((current) =>
        current.map((invitee) =>
          targetIds.includes(invitee.id)
            ? {
                ...invitee,
                familia: null,
                lista: null,
                grupo: null,
              }
            : invitee
        )
      );
      if (selectedFamily === groupName) {
        setSelectedFamily(null);
      }
    }
  };

  const sendFamilyGroup = (groupName: string) => {
    const groupInvitees = invitees.filter(
      (invitee) =>
        [invitee.familia, invitee.lista, invitee.grupo].filter(Boolean).includes(groupName)
    );

    const familyMembers = Array.from(new Set(groupInvitees.map((invitee) => invitee.nombre))).filter(Boolean);

    groupInvitees.forEach((invitee) => {
      const phone = normalizePhone(invitee.telefono ?? null);
      if (!phone) return;
      const message = encodeURIComponent(formatMessage(invitee.nombre, customText, groupName, familyMembers));
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

            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-[#d7c6a7] bg-[#fffaf2] p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c]">Total</p>
                <p className="mt-2 text-2xl font-semibold text-[#2a2418]">{adminSummary.total}</p>
              </div>
              <div className="rounded-2xl border border-[#d7c6a7] bg-[#fffaf2] p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c]">Confirman</p>
                <p className="mt-2 text-2xl font-semibold text-[#2a2418]">{adminSummary.confirmed}</p>
              </div>
              <div className="rounded-2xl border border-[#d7c6a7] bg-[#fffaf2] p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c]">Pendientes</p>
                <p className="mt-2 text-2xl font-semibold text-[#2a2418]">{adminSummary.pending}</p>
              </div>
              <div className="rounded-2xl border border-[#d7c6a7] bg-[#fffaf2] p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c]">Familias</p>
                <p className="mt-2 text-2xl font-semibold text-[#2a2418]">{adminSummary.families}</p>
              </div>
              <div className="rounded-2xl border border-[#d7c6a7] bg-[#fffaf2] p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c]">Mesas</p>
                <p className="mt-2 text-2xl font-semibold text-[#2a2418]">{adminSummary.tables}</p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-[#e6d5b8] bg-white p-3">
              <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto_auto] md:items-end">
                <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  Buscar invitado
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre, teléfono o familia"
                    className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-[#fffdf9] px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                  />
                </label>

                <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  Familia
                  <select
                    value={filterFamily}
                    onChange={(e) => setFilterFamily(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-[#fffdf9] px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                  >
                    <option value="all">Todas</option>
                    {familyGroups.map(({ name }) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </label>

                <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  Mesa
                  <select
                    value={filterMesa}
                    onChange={(e) => setFilterMesa(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-[#fffdf9] px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                  >
                    <option value="all">Todas</option>
                    {Array.from({ length: TABLE_COUNT }, (_, index) => (
                      <option key={index + 1} value={String(index + 1)}>
                        Mesa {index + 1}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-[#e0d0b0] bg-[#fffdf9] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  <input
                    type="checkbox"
                    checked={showOnlyConfirmed}
                    onChange={(e) => setShowOnlyConfirmed(e.target.checked)}
                    className="h-4 w-4 accent-[#b08968]"
                  />
                  Confirman
                </label>

                <button
                  type="button"
                  onClick={exportInvitees}
                  className="rounded-full bg-[#2a2418] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#f9f4ee]"
                >
                  Export Excel
                </button>
              </div>
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

            <div className="mb-5 rounded-2xl border border-[#e6d5b8] bg-white p-3">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1 text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                  Crear lista / familia
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="Ej: Familia Pérez"
                    className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-[#fffdf9] px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => assignFamilyToSelection(familyName)}
                  className="rounded-full bg-[#2a2418] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#f9f4ee]"
                >
                  Guardar grupo
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {familyGroups.map(({ name, invitees: groupInvitees }) => {
                  const isActive = selectedFamily === name;
                  return (
                    <div key={name} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedFamily(isActive ? null : name)}
                        className={`rounded-full border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.2em] ${
                          isActive
                            ? 'border-[#b08968] bg-[#f6ebde] text-[#3a3022]'
                            : 'border-[#d4b483]/30 bg-[#f8f0e2] text-[#4d3d2a]'
                        }`}
                      >
                        {name} ({groupInvitees.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => sendFamilyGroup(name)}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-emerald-700"
                        title="Enviar WhatsApp a esta familia"
                      >
                        WA
                      </button>
                    </div>
                  );
                })}
              </div>

              {selectedFamily && (
                <div className="mt-4 rounded-2xl border border-[#eadcc1] bg-[#fffaf2] p-3">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3a3022]">
                      Miembros de {selectedFamily}
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={selectedFamily}
                        onBlur={(e) => renameFamilyGroup(selectedFamily, e.target.value)}
                        className="w-36 rounded-lg border border-[#e0d0b0] bg-white px-2 py-1 text-xs text-[#3a3022] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => deleteFamilyGroup(selectedFamily)}
                        className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-red-700"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-1 text-sm text-[#5d4b3a]">
                    {selectedFamilyMembers.length === 0 ? (
                      <li className="text-[#7c5e3c]">No hay miembros cargados.</li>
                    ) : (
                      selectedFamilyMembers.map((member) => (
                        <li key={member.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-2 py-1.5">
                          <span>{member.nombre}</span>
                          <span className="text-xs text-[#7c5e3c]">Mesa {member.mesa ?? '—'}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {tableGroups.map(({ mesa, invitees: mesaInvitees }) => (
                <div
                  key={mesa}
                  className="rounded-2xl border border-[#d7c6a7] bg-[#fffaf2] p-3 text-center shadow-sm"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c5e3c]">Mesa</p>
                  <p className="mt-2 text-xl font-semibold text-[#2a2418]">{mesa}</p>
                  <p className="mt-1 text-xs text-[#7c5e3c]">{mesaInvitees.length} invitado{mesaInvitees.length === 1 ? '' : 's'}</p>
                </div>
              ))}
            </div>

            {importMessage && (
              <div className="mb-4 rounded-xl border border-[#d4b483]/30 bg-[#fff8ee] px-3 py-2 text-sm text-[#5f4735]">
                {importMessage}
              </div>
            )}

            <div className="max-h-80 overflow-auto rounded-2xl border border-[#e6d5b8] bg-white">
              {isLoading ? (
                <div className="p-4 text-sm text-[#7c5e3c]">Cargando invitados…</div>
              ) : filteredInvitees.length === 0 ? (
                <div className="p-4 text-sm text-[#7c5e3c]">
                  {invitees.length === 0 ? 'Todavía no hay invitados cargados.' : 'No hay invitados con esos filtros.'}
                </div>
              ) : (
                <ul className="divide-y divide-[#f2e7d8]">
                  {filteredInvitees.map((invitee) => {
                    const isSelected = selectedIds.includes(invitee.id);
                    const isEditing = editingId === invitee.id;

                    return (
                      <li key={invitee.id} className="p-3">
                        <div className="flex items-start justify-between gap-3">
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
                              {invitee.mesa ? `Mesa ${invitee.mesa} • ` : 'Sin mesa • '}
                              {invitee.telefono ? invitee.telefono : 'Sin teléfono'}
                              {invitee.email ? ` • ${invitee.email}` : ''}
                            </div>
                          </button>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleInvitee(invitee.id)}
                              className="h-4 w-4 accent-[#b08968]"
                            />
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(invitee)}
                            className="rounded-full border border-[#d4b483]/30 bg-[#f4ebdf] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#4d3d2a]"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteInvitee(invitee.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-red-700"
                          >
                            Borrar
                          </button>
                        </div>

                        {isEditing && (
                          <div className="mt-3 rounded-2xl border border-[#e0d0b0] bg-[#fffdf9] p-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                                Nombre
                                <input
                                  type="text"
                                  value={draftInvitee.nombre}
                                  onChange={(e) => setDraftInvitee((current) => ({ ...current, nombre: e.target.value }))}
                                  className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                                />
                              </label>
                              <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                                Email
                                <input
                                  type="email"
                                  value={draftInvitee.email}
                                  onChange={(e) => setDraftInvitee((current) => ({ ...current, email: e.target.value }))}
                                  className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                                />
                              </label>
                              <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                                Teléfono
                                <input
                                  type="text"
                                  value={draftInvitee.telefono}
                                  onChange={(e) => setDraftInvitee((current) => ({ ...current, telefono: e.target.value }))}
                                  className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                                />
                              </label>
                              <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                                Mesa
                                <select
                                  value={draftInvitee.mesa ?? ''}
                                  onChange={(e) =>
                                    setDraftInvitee((current) => ({
                                      ...current,
                                      mesa: e.target.value === '' ? null : Number(e.target.value),
                                    }))
                                  }
                                  className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                                >
                                  <option value="">Sin mesa</option>
                                  {Array.from({ length: TABLE_COUNT }, (_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                      Mesa {index + 1}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                                Familia / lista
                                <input
                                  type="text"
                                  value={draftInvitee.familia || draftInvitee.lista || ''}
                                  onChange={(e) =>
                                    setDraftInvitee((current) => ({
                                      ...current,
                                      familia: e.target.value,
                                      lista: e.target.value,
                                      grupo: e.target.value,
                                    }))
                                  }
                                  className="mt-1 w-full rounded-xl border border-[#e0d0b0] bg-white px-3 py-2 text-sm text-[#3a3022] outline-none focus:border-[#d4b483]"
                                />
                              </label>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7c5e3c]">
                                <input
                                  type="checkbox"
                                  checked={draftInvitee.asistira}
                                  onChange={(e) =>
                                    setDraftInvitee((current) => ({ ...current, asistira: e.target.checked }))
                                  }
                                  className="h-4 w-4 accent-[#b08968]"
                                />
                                Asiste
                              </label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={saveInvitee}
                                  className="rounded-full bg-[#2a2418] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#f9f4ee]"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-full border border-[#d4b483]/30 bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#4d3d2a]"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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
