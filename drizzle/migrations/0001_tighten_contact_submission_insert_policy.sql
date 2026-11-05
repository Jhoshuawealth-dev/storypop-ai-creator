-- Replace the unconstrained anon INSERT policy on contact_submissions with one
-- that mirrors the server-side validation (name 2-100, email <= 255 valid format,
-- subject 1-100, message 10-2000), so the contact form stays open to visitors
-- while the database rejects malformed or oversized submissions.
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_submissions;

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 2 AND 100
    AND char_length(btrim(email)) <= 255
    AND btrim(email) ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND char_length(btrim(subject)) BETWEEN 1 AND 100
    AND char_length(btrim(message)) BETWEEN 10 AND 2000
  );

-- Grants are unchanged; the existing anon INSERT and service_role grants remain valid.