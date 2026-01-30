import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { mcqId, selectedAnswer } = await request.json();

    if (!mcqId || !selectedAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the MCQ to verify the correct answer
    const { data: mcq, error: mcqError } = await supabase
      .from('mcqs')
      .select('correct_answer, lesson_id')
      .eq('id', mcqId)
      .single();

    if (mcqError || !mcq) {
      return NextResponse.json(
        { error: 'MCQ not found' },
        { status: 404 }
      );
    }

    const isCorrect = mcq.correct_answer === selectedAnswer;

    // Save the MCQ answer
    const { error: answerError } = await supabase
      .from('mcq_answers')
      .insert({
        user_id: user.id,
        mcq_id: mcqId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      });

    if (answerError) {
      throw answerError;
    }

    // Award educoins for correct answer (if logged in)
    if (isCorrect) {
      const { error: transactionError } = await supabase
        .from('educoins_transactions')
        .insert({
          user_id: user.id,
          amount: 5,
          reason: 'mcq_correct',
          reference_id: mcqId,
        });

      if (!transactionError) {
        // Update user's educoins
        const { data: profile } = await supabase
          .from('profiles')
          .select('educoins')
          .eq('id', user.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ educoins: (profile.educoins || 0) + 5 })
            .eq('id', user.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      earnedEducoins: isCorrect ? 5 : 0,
    });
  } catch (error) {
    console.error('Error submitting MCQ:', error);
    return NextResponse.json(
      { error: 'Failed to submit MCQ' },
      { status: 500 }
    );
  }
}
