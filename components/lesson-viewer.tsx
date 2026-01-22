'use client';

import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { ChevronDown, Download, BookOpen, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MCQ {
  id: string;
  question_en: string;
  question_ne: string;
  option_a_en: string;
  option_a_ne: string;
  option_b_en: string;
  option_b_ne: string;
  option_c_en: string;
  option_c_ne: string;
  option_d_en: string;
  option_d_ne: string;
  explanation_en: string;
  explanation_ne: string;
  mcq_type: 'introductory' | 'assessment';
}

interface Lesson {
  id: string;
  title_en: string;
  title_ne: string;
  introduction_en: string;
  introduction_ne: string;
  youtube_url: string;
}

interface LessonViewerProps {
  lesson: Lesson;
  mcqs: MCQ[];
  pdfUrl?: string;
  isLoggedIn: boolean;
  userId?: string;
}

const t = {
  prerequisites: { en: 'Prerequisites', ne: 'पूर्वशर्तहरु' },
  introduction: { en: 'Introduction', ne: 'परिचय' },
  video: { en: 'Video Lesson', ne: 'भिडिओ पाठ' },
  introductoryQuestions: { en: 'Introductory Questions', ne: 'प्रारम्भिक प्रश्नहरु' },
  pdfNotes: { en: 'PDF Notes', ne: 'PDF नोट्स' },
  assessmentQuestions: { en: 'Assessment Questions', ne: 'मूल्यांकन प्रश्नहरु' },
  nextLesson: { en: 'Next Lesson', ne: 'अगिलो पाठ' },
  tips: { en: 'Tips & Tricks', ne: 'सुझावहरु र चालहरु' },
  selectAnswer: { en: 'Select Answer', ne: 'जवाफ छान्नुहोस्' },
  submit: { en: 'Submit', ne: 'पेस उपलब्ध' },
  earnedEducoins: { en: 'Earned 5 EduCoins!', ne: '5 एडुकॉइन अर्जन गरेको!' },
  loginToEarnCoins: { en: 'Log in to earn EduCoins', ne: 'एडुकॉइन अर्जन गर्न लगइन गर्नुहोस्' },
  passAssessmentMessage: { en: 'Score 80% or higher to proceed to next lesson', ne: '80% वा उच्च अंक पाएर अगिलो पाठमा जानुहोस्' },
};

export function LessonViewer({ lesson, mcqs, pdfUrl, isLoggedIn, userId }: LessonViewerProps) {
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [showPDF, setShowPDF] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);
  const lang = language === 'ne';

  const introMCQs = mcqs.filter(m => m.mcq_type === 'introductory');
  const assessmentMCQs = mcqs.filter(m => m.mcq_type === 'assessment');

  const handleMCQSubmit = async (mcqId: string) => {
    if (!answers[mcqId]) return;

    setLoading(true);
    try {
      const response = await fetch('/api/lessons/submit-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mcqId,
          selectedAnswer: answers[mcqId],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(prev => ({
          ...prev,
          [mcqId]: data.isCorrect,
        }));

        // Calculate assessment score if all assessment MCQs are answered
        if (assessmentMCQs.length > 0) {
          const answeredAssessments = assessmentMCQs.filter(m => results[m.id] !== undefined).length + 1;
          if (answeredAssessments === assessmentMCQs.length) {
            const correctCount = Object.values(results).filter(v => v).length + (data.isCorrect ? 1 : 0);
            const score = Math.round((correctCount / assessmentMCQs.length) * 100);
            setAssessmentScore(score);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting MCQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (isLoggedIn && userId) {
      try {
        await supabase.from('educoins_transactions').insert({
          user_id: userId,
          amount: 10,
          reason: 'pdf_download',
          reference_id: lesson.id,
        });

        const profile = await supabase
          .from('profiles')
          .select('educoins')
          .eq('id', userId)
          .single();

        if (profile.data) {
          await supabase
            .from('profiles')
            .update({ educoins: (profile.data.educoins || 0) + 10 })
            .eq('id', userId);
        }
      } catch (error) {
        console.error('Error awarding educoins:', error);
      }
    }

    // Trigger PDF download
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold mb-2">{getText(lesson.title_en, lesson.title_ne)}</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Module: Class 10</span>
          <span>•</span>
          <span>Difficulty: Intermediate</span>
        </div>
      </div>

      {/* Introduction */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          {getText(t.introduction.en, t.introduction.ne)}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {getText(lesson.introduction_en, lesson.introduction_ne)}
        </p>
      </section>

      {/* Video */}
      {lesson.youtube_url && (
        <section>
          <h2 className="text-2xl font-bold mb-4">{getText(t.video.en, t.video.ne)}</h2>
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={lesson.youtube_url.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]}
              title="Lesson Video"
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </section>
      )}

      {/* Introductory MCQs */}
      {introMCQs.length > 0 && (
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">{getText(t.introductoryQuestions.en, t.introductoryQuestions.ne)}</h2>
          <div className="space-y-6">
            {introMCQs.map((mcq, idx) => (
              <MCQCard
                key={mcq.id}
                mcq={mcq}
                index={idx + 1}
                selectedAnswer={answers[mcq.id]}
                result={results[mcq.id]}
                language={lang}
                onAnswerChange={(answer) => setAnswers(prev => ({ ...prev, [mcq.id]: answer }))}
                onSubmit={() => handleMCQSubmit(mcq.id)}
                loading={loading}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </section>
      )}

      {/* PDF Notes */}
      {pdfUrl && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{getText(t.pdfNotes.en, t.pdfNotes.ne)}</h2>
            <Button
              onClick={downloadPDF}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {getText('Download', 'डाउनलोड गर्नुहोस्')}
              {isLoggedIn && <span className="text-xs ml-2">+10 EduCoins</span>}
            </Button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 mb-4">PDF flipbook viewer will be embedded here</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              {getText('View Full PDF', 'पूर्ण PDF हेर्नुहोस्')}
            </a>
          </div>
        </section>
      )}

      {/* Assessment MCQs */}
      {assessmentMCQs.length > 0 && (
        <section className="bg-amber-50 p-6 rounded-lg">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{getText(t.assessmentQuestions.en, t.assessmentQuestions.ne)}</h2>
            <p className="text-sm text-gray-600">{getText(t.passAssessmentMessage.en, t.passAssessmentMessage.ne)}</p>
          </div>
          <div className="space-y-6">
            {assessmentMCQs.map((mcq, idx) => (
              <MCQCard
                key={mcq.id}
                mcq={mcq}
                index={idx + 1}
                selectedAnswer={answers[mcq.id]}
                result={results[mcq.id]}
                language={lang}
                onAnswerChange={(answer) => setAnswers(prev => ({ ...prev, [mcq.id]: answer }))}
                onSubmit={() => handleMCQSubmit(mcq.id)}
                loading={loading}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>

          {assessmentScore > 0 && (
            <div className={`mt-6 p-4 rounded-lg ${assessmentScore >= 80 ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                {assessmentScore >= 80 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span className="font-bold text-lg">
                  {getText(`Score: ${assessmentScore}%`, `अंक: ${assessmentScore}%`)}
                </span>
              </div>
              <p className={`text-sm ${assessmentScore >= 80 ? 'text-green-800' : 'text-red-800'}`}>
                {assessmentScore >= 80
                  ? getText('Great! You can proceed to the next lesson.', 'शानदार! तपाई अगिलो पाठमा जान सक्नुहुन्छ।')
                  : getText('Please review and try again to score 80% or higher.', 'कृपया समीक्षा गर्नुहोस् र 80% वा अधिक अंक पाउन प्रयास गर्नुहोस्।')
                }
              </p>
            </div>
          )}
        </section>
      )}

      {/* Tips and Resources */}
      <section className="bg-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{getText(t.tips.en, t.tips.ne)}</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• {getText('Review concepts from prerequisite lessons', 'पूर्वशर्तको पाठ देखि अवधारणा समीक्षा गर्नुहोस्')}</li>
          <li>• {getText('Take notes while watching the video', 'भिडिओ हेर्दा नोट्स लिनुहोस्')}</li>
          <li>• {getText('Practice MCQs multiple times', 'MCQ हरु बहुत दोहोरिएर अभ्यास गर्नुहोस्')}</li>
          <li>• {getText('Download and study the PDF notes', 'PDF नोट्स डाउनलोड गरी अध्ययन गर्नुहोस्')}</li>
        </ul>
      </section>
    </div>
  );
}

function MCQCard({ mcq, index, selectedAnswer, result, language: lang, onAnswerChange, onSubmit, loading, isLoggedIn }: any) {
  const getText = (en: string, ne: string) => (lang ? ne : en);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="mb-4">
        <p className="font-semibold text-lg">
          {index}. {getText(mcq.question_en, mcq.question_ne)}
        </p>
      </div>

      <div className="space-y-3 mb-4">
        {[
          { key: 'a', en: mcq.option_a_en, ne: mcq.option_a_ne },
          { key: 'b', en: mcq.option_b_en, ne: mcq.option_b_ne },
          { key: 'c', en: mcq.option_c_en, ne: mcq.option_c_ne },
          { key: 'd', en: mcq.option_d_en, ne: mcq.option_d_ne },
        ].map(option => (
          <label key={option.key} className="flex items-center gap-3 p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={`mcq-${mcq.id}`}
              value={option.key}
              checked={selectedAnswer === option.key}
              onChange={(e) => onAnswerChange(e.target.value)}
              disabled={result !== undefined}
              className="w-4 h-4"
            />
            <span>{getText(option.en, option.ne)}</span>
          </label>
        ))}
      </div>

      {result === undefined ? (
        <Button
          onClick={onSubmit}
          disabled={!selectedAnswer || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {getText('Submit Answer', 'जवाफ पेस उपलब्ध')}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className={`p-3 rounded flex items-center gap-2 ${result ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            {result ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-semibold">{getText('Correct!', 'सही!')}</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-semibold">{getText('Incorrect', 'गलत')}</span>
              </>
            )}
          </div>
          <details className="p-3 bg-gray-50 rounded border border-gray-200">
            <summary className="cursor-pointer font-semibold">{getText('Explanation', 'व्याख्या')}</summary>
            <p className="mt-2 text-gray-700 text-sm">{getText(mcq.explanation_en, mcq.explanation_ne)}</p>
          </details>
        </div>
      )}
    </div>
  );
}
