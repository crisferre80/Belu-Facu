import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Rsvp = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  asistira: boolean;
  cantidad_acompanantes: number;
  mensaje: string | null;
  restriccion_alimentaria: string | null;
  cancion_recomendada: string | null;
  created_at: string;
};
