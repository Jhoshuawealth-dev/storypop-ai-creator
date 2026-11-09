ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS thumbnail_path text;
ALTER TABLE public.generation_jobs ADD COLUMN IF NOT EXISTS thumbnail_path text;