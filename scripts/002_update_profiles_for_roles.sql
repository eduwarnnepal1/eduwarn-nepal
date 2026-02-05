-- Added educoins (aliased to points), role_approved flag, and enrollment table
ALTER TABLE public.profiles 
RENAME COLUMN points TO educoins;

ALTER TABLE public.profiles
ADD COLUMN role_approved BOOLEAN DEFAULT false;

-- Table for tracking course enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments." ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Update trigger to handle initial points and role approval
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, educoins, role_approved)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    100, -- Welcome educoins
    CASE WHEN (new.raw_user_meta_data->>'role' = 'student' OR new.raw_user_meta_data->>'role' IS NULL) THEN true ELSE false END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
