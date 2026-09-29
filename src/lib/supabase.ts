import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Rsvp = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  asistira: boolean;
  cantidad_acompanantes: number;
  mesa: number | null;
  familia: string | null;
  lista: string | null;
  grupo: string | null;
  mensaje: string | null;
  restriccion_alimentaria: string | null;
  cancion_recomendada: string | null;
  created_at: string;
};
