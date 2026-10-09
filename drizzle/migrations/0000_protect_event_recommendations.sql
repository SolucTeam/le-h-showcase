CREATE TABLE public.ai_gateway_state (id text PRIMARY KEY, blocked boolean NOT NULL DEFAULT false, message text, status integer, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_gateway_state TO service_role;
ALTER TABLE public.ai_gateway_state ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.ai_request_windows (id text PRIMARY KEY, started_at timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 0);
GRANT ALL ON public.ai_request_windows TO service_role;
ALTER TABLE public.ai_request_windows ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.claim_event_recommendation() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE claimed integer;
BEGIN
INSERT INTO public.ai_request_windows(id, requests) VALUES ('event_recommendation', 1)
ON CONFLICT(id) DO UPDATE SET requests = CASE WHEN ai_request_windows.started_at < now() - interval '1 minute' THEN 1 ELSE ai_request_windows.requests + 1 END, started_at = CASE WHEN ai_request_windows.started_at < now() - interval '1 minute' THEN now() ELSE ai_request_windows.started_at END
RETURNING requests INTO claimed;
RETURN claimed <= 20;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_event_recommendation() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_event_recommendation() TO service_role;