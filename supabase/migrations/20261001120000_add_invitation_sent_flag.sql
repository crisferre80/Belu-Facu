ALTER TABLE public.rsvp
  ADD COLUMN IF NOT EXISTS invitacion_enviada boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS rsvp_invitacion_enviada_idx
  ON public.rsvp (invitacion_enviada);

DROP POLICY IF EXISTS "anon_update_rsvp" ON public.rsvp;
CREATE POLICY "anon_update_rsvp" ON public.rsvp
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_rsvp" ON public.rsvp;
CREATE POLICY "anon_delete_rsvp" ON public.rsvp
  FOR DELETE TO anon, authenticated
  USING (true);
