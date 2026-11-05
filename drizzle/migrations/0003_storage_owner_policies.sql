CREATE POLICY "Users read own videos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'generated-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own references" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'character-references' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users upload own references" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'character-references' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own references" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'character-references' AND (storage.foldername(name))[1] = auth.uid()::text);