-- Bucket para guardar comprobantes de pago
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprobantes', 'comprobantes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Campo para guardar la URL pública del comprobante en la tabla RSVP
ALTER TABLE rsvp
  ADD COLUMN IF NOT EXISTS comprobante_url text;

-- Permitir lectura pública de los comprobantes
DROP POLICY IF EXISTS "comprobantes_public_select" ON storage.objects;
CREATE POLICY "comprobantes_public_select"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'comprobantes');

-- Permitir subida pública desde el frontend (ajustar más adelante si querés restringirlo)
DROP POLICY IF EXISTS "comprobantes_public_insert" ON storage.objects;
CREATE POLICY "comprobantes_public_insert"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'comprobantes');
