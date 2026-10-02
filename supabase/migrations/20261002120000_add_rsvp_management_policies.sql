ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rsvp" ON public.rsvp;
CREATE POLICY "anon_select_rsvp" ON public.rsvp
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_rsvp" ON public.rsvp;
CREATE POLICY "anon_insert_rsvp" ON public.rsvp
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_rsvp" ON public.rsvp;
CREATE POLICY "anon_update_rsvp" ON public.rsvp
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_rsvp" ON public.rsvp;
CREATE POLICY "anon_delete_rsvp" ON public.rsvp
  FOR DELETE TO anon, authenticated
  USING (true);
