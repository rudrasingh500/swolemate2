-- Create table for rate limiting form analysis API calls
CREATE TABLE public.form_analysis_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    request_count INTEGER DEFAULT 0 NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Add indexes for faster queries
CREATE INDEX idx_form_analysis_rate_limits_user_id ON public.form_analysis_rate_limits(user_id);
CREATE INDEX idx_form_analysis_rate_limits_window_start ON public.form_analysis_rate_limits(window_start);

-- Enable RLS
ALTER TABLE public.form_analysis_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies (only allow service role access for security)
CREATE POLICY "Allow service role full access" ON public.form_analysis_rate_limits
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER form_analysis_rate_limits_updated_at
  BEFORE UPDATE ON public.form_analysis_rate_limits
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_form_analysis_rate_limit(
  p_user_id UUID,
  p_max_requests INTEGER DEFAULT 3,
  p_window_hours INTEGER DEFAULT 24
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_window_start TIMESTAMP WITH TIME ZONE;
  current_count INTEGER;
  remaining_requests INTEGER;
  reset_time TIMESTAMP WITH TIME ZONE;
  rate_limit_record RECORD;
BEGIN
  -- Calculate the current window start (24 hours ago from now)
  current_window_start := NOW() - (p_window_hours || ' hours')::INTERVAL;
  
  -- Get or create rate limit record for user
  SELECT * INTO rate_limit_record
  FROM public.form_analysis_rate_limits
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one
  IF rate_limit_record IS NULL THEN
    INSERT INTO public.form_analysis_rate_limits (user_id, request_count, window_start)
    VALUES (p_user_id, 1, NOW())
    RETURNING * INTO rate_limit_record;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'requests_remaining', p_max_requests - 1,
      'reset_time', rate_limit_record.window_start + (p_window_hours || ' hours')::INTERVAL,
      'window_start', rate_limit_record.window_start
    );
  END IF;
  
  -- Check if we need to reset the window
  IF rate_limit_record.window_start < current_window_start THEN
    -- Reset the window
    UPDATE public.form_analysis_rate_limits
    SET request_count = 1,
        window_start = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO rate_limit_record;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'requests_remaining', p_max_requests - 1,
      'reset_time', rate_limit_record.window_start + (p_window_hours || ' hours')::INTERVAL,
      'window_start', rate_limit_record.window_start
    );
  END IF;
  
  -- Check if we're at the limit
  IF rate_limit_record.request_count >= p_max_requests THEN
    reset_time := rate_limit_record.window_start + (p_window_hours || ' hours')::INTERVAL;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'requests_remaining', 0,
      'reset_time', reset_time,
      'window_start', rate_limit_record.window_start,
      'message', 'Rate limit exceeded. You can analyze ' || p_max_requests || ' videos every ' || p_window_hours || ' hours.'
    );
  END IF;
  
  -- Increment the counter
  UPDATE public.form_analysis_rate_limits
  SET request_count = request_count + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING * INTO rate_limit_record;
  
  remaining_requests := p_max_requests - rate_limit_record.request_count;
  reset_time := rate_limit_record.window_start + (p_window_hours || ' hours')::INTERVAL;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'requests_remaining', remaining_requests,
    'reset_time', reset_time,
    'window_start', rate_limit_record.window_start
  );
END;
$$;

-- Add comments
COMMENT ON TABLE public.form_analysis_rate_limits IS 'Rate limiting table for form analysis API calls';
COMMENT ON FUNCTION public.check_form_analysis_rate_limit(UUID, INTEGER, INTEGER) IS 'Checks and updates rate limits for form analysis API calls. Returns JSON with allowed status and remaining requests.'; 