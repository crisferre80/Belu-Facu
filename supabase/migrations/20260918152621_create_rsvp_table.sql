/*
# Tabla RSVP para confirmación de asistencia de boda

1. Nueva Tabla
- `rsvp`: guarda las confirmaciones de asistencia de los invitados.
- `id` (uuid, primary key)
- `nombre` (text, nombre del invitado)
- `email` (text, contacto)
- `telefono` (text, teléfono opcional)
- `asistira` (boolean, si confirma asistencia)
- `cantidad_acompanantes` (integer, número de acompañantes, default 0)
- `mensaje` (text, mensaje opcional para los novios)
- `restriccion_alimentaria` (text, restricción dietaria opcional)
- `cancion_recomendada` (text, canción sugerida para la fiesta, opcional)
- `created_at` (timestamptz, fecha de confirmación)

2. Seguridad
- RLS habilitado en `rsvp`.
- Política pública (anon + authenticated) para INSERT: cualquier invitado puede enviar su confirmación.
- Política pública para SELECT: los novios pueden ver las confirmaciones (datos compartidos/intencionalmente públicos en este contexto de invitación abierta).
- UPDATE y DELETE no se exponen desde el frontend.
*/

CREATE TABLE IF NOT EXISTS rsvp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  asistira boolean NOT NULL,
  cantidad_acompanantes integer NOT NULL DEFAULT 0,
  mensaje text,
  restriccion_alimentaria text,
  cancion_recomendada text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rsvp" ON rsvp;
CREATE POLICY "anon_select_rsvp" ON rsvp FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_rsvp" ON rsvp;
CREATE POLICY "anon_insert_rsvp" ON rsvp FOR INSERT
  TO anon, authenticated WITH CHECK (true);
