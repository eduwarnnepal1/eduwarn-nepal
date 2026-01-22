-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ne TEXT NOT NULL,
  description_en TEXT,
  description_ne TEXT,
  thumbnail_url TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category_id UUID REFERENCES public.categories(id),
  instructor_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules/chapters table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ne TEXT NOT NULL,
  description_en TEXT,
  description_ne TEXT,
  module_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, module_number)
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ne TEXT NOT NULL,
  introduction_en TEXT,
  introduction_ne TEXT,
  youtube_url TEXT,
  lesson_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lesson resources table (PDFs, cheat sheets, etc.)
CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  resource_type TEXT CHECK (resource_type IN ('pdf', 'cheatsheet', 'tip', 'formula', 'related_topic')),
  title_en TEXT NOT NULL,
  title_ne TEXT NOT NULL,
  resource_url TEXT,
  content_en TEXT,
  content_ne TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create MCQs table
CREATE TABLE IF NOT EXISTS public.mcqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_en TEXT NOT NULL,
  question_ne TEXT NOT NULL,
  option_a_en TEXT NOT NULL,
  option_a_ne TEXT NOT NULL,
  option_b_en TEXT NOT NULL,
  option_b_ne TEXT NOT NULL,
  option_c_en TEXT NOT NULL,
  option_c_ne TEXT NOT NULL,
  option_d_en TEXT NOT NULL,
  option_d_ne TEXT NOT NULL,
  correct_answer TEXT CHECK (correct_answer IN ('a', 'b', 'c', 'd')) NOT NULL,
  explanation_en TEXT,
  explanation_ne TEXT,
  mcq_type TEXT CHECK (mcq_type IN ('introductory', 'assessment')) DEFAULT 'introductory',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lesson prerequisites table
CREATE TABLE IF NOT EXISTS public.lesson_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  prerequisite_lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lesson_id, prerequisite_lesson_id)
);

-- Create lesson progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  assessment_score INTEGER,
  assessment_passed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create MCQ answers table
CREATE TABLE IF NOT EXISTS public.mcq_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mcq_id UUID NOT NULL REFERENCES public.mcqs(id) ON DELETE CASCADE,
  selected_answer TEXT CHECK (selected_answer IN ('a', 'b', 'c', 'd')),
  is_correct BOOLEAN,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create educoins transactions table
CREATE TABLE IF NOT EXISTS public.educoins_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT CHECK (reason IN ('lesson_completion', 'mcq_correct', 'pdf_download', 'cheatsheet_download', 'course_completion')),
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_mcqs_lesson_id ON public.mcqs(lesson_id);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_mcq_answers_user_id ON public.mcq_answers(user_id);
CREATE INDEX idx_mcq_answers_mcq_id ON public.mcq_answers(mcq_id);
CREATE INDEX idx_educoins_transactions_user_id ON public.educoins_transactions(user_id);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educoins_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read)
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Instructors can insert courses" ON public.courses FOR INSERT WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "Instructors can update own courses" ON public.courses FOR UPDATE USING (instructor_id = auth.uid());

-- RLS Policies for modules
CREATE POLICY "Modules are viewable by everyone" ON public.modules FOR SELECT USING (true);

-- RLS Policies for lessons
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);

-- RLS Policies for MCQs
CREATE POLICY "MCQs are viewable by everyone" ON public.mcqs FOR SELECT USING (true);

-- RLS Policies for lesson resources
CREATE POLICY "Resources are viewable by everyone" ON public.lesson_resources FOR SELECT USING (true);

-- RLS Policies for lesson progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for MCQ answers
CREATE POLICY "Users can view own answers" ON public.mcq_answers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert answers" ON public.mcq_answers FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for educoins transactions
CREATE POLICY "Users can view own transactions" ON public.educoins_transactions FOR SELECT USING (user_id = auth.uid());
