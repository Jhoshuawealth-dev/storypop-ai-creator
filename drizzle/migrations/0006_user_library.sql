CREATE TABLE public.user_library (
  user_id uuid PRIMARY KEY,
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  characters jsonb NOT NULL DEFAULT '[]'::jsonb,
  posts jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_library TO authenticated;
GRANT ALL ON public.user_library TO service_role;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own library" ON public.user_library FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);