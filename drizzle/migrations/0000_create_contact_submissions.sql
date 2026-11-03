CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_submissions TO anon;
GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);