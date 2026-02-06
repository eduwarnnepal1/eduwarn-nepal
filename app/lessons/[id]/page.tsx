import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { LessonViewer } from '@/components/lesson-viewer';
import { redirect } from 'next/navigation';

export default async function LessonPage({ params }: { params: Promise< { id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error('Error setting cookies:', error);
          }
        },
      },
    }
  );

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch lesson details
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', params.id)
    .single();

  if (lessonError || !lesson) {
    redirect('/courses');
  }

  // Fetch MCQs
  const { data: mcqs = [] } = await supabase
    .from('mcqs')
    .select('*')
    .eq('lesson_id', params.id)
    .order('mcq_type', { ascending: false });

  // Fetch lesson resources (PDFs)
  const { data: resources = [] } = await supabase
    .from('lesson_resources')
    .select('*')
    .eq('lesson_id', params.id)
    .eq('resource_type', 'pdf')
    .limit(1);

  const pdfUrl = resources.length > 0 ? resources[0].resource_url : undefined;

  // Update lesson progress if user is logged in
  if (user) {
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', params.id)
      .single();

    if (!existingProgress) {
      await supabase.from('lesson_progress').insert({
        user_id: user.id,
        lesson_id: params.id,
        status: 'in_progress',
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <LessonViewer
        lesson={lesson}
        mcqs={mcqs}
        pdfUrl={pdfUrl}
        isLoggedIn={!!user}
        userId={user?.id}
      />
    </div>
  );
}
