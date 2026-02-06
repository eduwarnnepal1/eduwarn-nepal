-- Create statistics table for storing system-wide metrics
CREATE TABLE IF NOT EXISTS public.statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_students INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  total_success_rate INTEGER DEFAULT 95,
  total_learning_hours INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert initial statistics
INSERT INTO public.statistics (total_students, total_courses, total_success_rate, total_learning_hours)
VALUES (10000, 50, 95, 50000)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Statistics are readable by everyone"
  ON public.statistics FOR SELECT
  USING (true);

-- Create index
CREATE INDEX idx_statistics_updated_at ON public.statistics(updated_at);
