-- Add prerequisites_description fields to lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS prerequisites_en TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS prerequisites_ne TEXT;

-- Create index on prerequisites for faster lookups
CREATE INDEX IF NOT EXISTS idx_lesson_prerequisites_lesson ON public.lesson_prerequisites(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_prerequisites_prereq ON public.lesson_prerequisites(prerequisite_lesson_id);

-- Add comment
COMMENT ON COLUMN public.lessons.prerequisites_en IS 'Comma-separated IDs of prerequisite lessons (admin managed)';
COMMENT ON COLUMN public.lessons.prerequisites_ne IS 'Comma-separated IDs of prerequisite lessons (admin managed)';
