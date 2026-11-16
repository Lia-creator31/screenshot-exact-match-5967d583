CREATE TABLE public.wedding_wishes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 80), message text NOT NULL CHECK (char_length(trim(message)) BETWEEN 5 AND 1000), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT ON public.wedding_wishes TO anon, authenticated;
GRANT ALL ON public.wedding_wishes TO service_role;
ALTER TABLE public.wedding_wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests read wedding wishes" ON public.wedding_wishes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Guests submit wedding wishes" ON public.wedding_wishes FOR INSERT TO anon, authenticated WITH CHECK (char_length(trim(name)) BETWEEN 2 AND 80 AND char_length(trim(message)) BETWEEN 5 AND 1000);
CREATE INDEX wedding_wishes_created_idx ON public.wedding_wishes (created_at DESC);