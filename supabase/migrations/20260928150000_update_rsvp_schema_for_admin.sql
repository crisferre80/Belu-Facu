ALTER TABLE public.rsvp
  ALTER COLUMN email DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS mesa integer,
  ADD COLUMN IF NOT EXISTS familia text,
  ADD COLUMN IF NOT EXISTS lista text,
  ADD COLUMN IF NOT EXISTS grupo text;

CREATE INDEX IF NOT EXISTS rsvp_mesa_idx ON public.rsvp (mesa);
CREATE INDEX IF NOT EXISTS rsvp_familia_idx ON public.rsvp (familia);
CREATE INDEX IF NOT EXISTS rsvp_lista_idx ON public.rsvp (lista);
CREATE INDEX IF NOT EXISTS rsvp_grupo_idx ON public.rsvp (grupo);
