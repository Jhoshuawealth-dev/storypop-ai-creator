ALTER TABLE public.user_library ADD COLUMN social_accounts jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.user_library ADD COLUMN applied_mutations jsonb NOT NULL DEFAULT '{}'::jsonb;
CREATE OR REPLACE FUNCTION public.sync_user_library(operations jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE owner_id uuid := auth.uid(); library public.user_library%ROWTYPE; op jsonb; items jsonb; existing jsonb; target text; op_id text; item_id text;
BEGIN
 IF owner_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 IF jsonb_typeof(operations) <> 'array' OR jsonb_array_length(operations) > 200 THEN RAISE EXCEPTION 'Invalid operations'; END IF;
 INSERT INTO public.user_library(user_id) VALUES(owner_id) ON CONFLICT(user_id) DO NOTHING;
 SELECT * INTO library FROM public.user_library WHERE user_id = owner_id FOR UPDATE;
 FOR op IN SELECT value FROM jsonb_array_elements(operations) LOOP
  target := op->>'collection'; op_id := op->>'operationId'; item_id := op->>'id';
  IF target NOT IN ('projects','characters','posts','social_accounts') OR op_id IS NULL OR length(op_id) > 100 OR item_id IS NULL OR length(item_id) > 200 OR op->>'kind' NOT IN ('add','patch','remove') THEN RAISE EXCEPTION 'Invalid operation'; END IF;
  IF library.applied_mutations ? op_id THEN CONTINUE; END IF;
  items := CASE target WHEN 'projects' THEN library.projects WHEN 'characters' THEN library.characters WHEN 'posts' THEN library.posts ELSE library.social_accounts END;
  SELECT value INTO existing FROM jsonb_array_elements(items) WHERE value->>'id' = item_id LIMIT 1;
  IF op->>'kind' = 'remove' THEN
   SELECT COALESCE(jsonb_agg(value), '[]'::jsonb) INTO items FROM jsonb_array_elements(items) WHERE value->>'id' <> item_id;
  ELSE
   IF jsonb_typeof(op->'value') <> 'object' THEN RAISE EXCEPTION 'Invalid value'; END IF;
   IF existing IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(CASE WHEN value->>'id' = item_id THEN value || (op->'value') || jsonb_build_object('id',item_id) ELSE value END),'[]'::jsonb) INTO items FROM jsonb_array_elements(items);
   ELSIF op->>'kind' = 'add' THEN
    items := jsonb_build_array((op->'value') || jsonb_build_object('id',item_id)) || items;
   END IF;
  END IF;
  CASE target WHEN 'projects' THEN library.projects := items; WHEN 'characters' THEN library.characters := items; WHEN 'posts' THEN library.posts := items; ELSE library.social_accounts := items; END CASE;
  library.applied_mutations := library.applied_mutations || jsonb_build_object(op_id,true);
 END LOOP;
 IF jsonb_array_length(operations) > 0 THEN
  UPDATE public.user_library SET projects=library.projects, characters=library.characters, posts=library.posts, social_accounts=library.social_accounts, applied_mutations=library.applied_mutations, updated_at=now() WHERE user_id=owner_id;
 END IF;
 RETURN jsonb_build_object('projects',library.projects,'characters',library.characters,'posts',library.posts,'socialAccounts',library.social_accounts);
END $$;
REVOKE ALL ON FUNCTION public.sync_user_library(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_user_library(jsonb) TO authenticated;
COMMENT ON FUNCTION public.sync_user_library(jsonb) IS 'Atomic per-item, idempotent mutations; auth.uid scopes every read and write.';