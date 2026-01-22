'use client';

import React, { useState, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Zap,
  FileText,
  Volume2,
} from 'lucide-react';

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
  correct_answer: string;
  explanation_en: string;
  explanation_ne: string;
  mcq_type: 'introductory' | 'assessment';
}

interface LessonViewerProps {
  lesson: {
    id: string;
    title_en: string;
    title_ne: string;
    introduction_en: string;
    introduction_ne: string;
    youtube_url?: string;
  };
  mcqs?: MCQ[];
  pdfUrl?: string;
  isLoggedIn?: boolean;
}

export function LessonViewer({
  lesson,
  mcqs = [],
  pdfUrl,
  isLoggedIn = false,
}: LessonViewerProps) {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState<'intro' | 'mcq' | 'assessment' | 'resources'>('intro');
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const introductoryMCQs = mcqs.filter((m) => m.mcq_type === 'introductory');
  const assessmentMCQs = mcqs.filter((m) => m.mcq_type === 'assessment');

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  const handleAnswerChange = (mcqId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: answer }));
  };

  const handleSubmitAssessment = () => {
    let correctCount = 0;
    assessmentMCQs.forEach((mcq) => {
      if (selectedAnswers[mcq.id]?.toLowerCase() === mcq.correct_answer.toLowerCase()) {
        correctCount++;
      }
    });
    const percentage = (correctCount / assessmentMCQs.length) * 100;
    setAssessmentScore(percentage);
    setSubmitted(true);
  };

  const canProceedToNextLesson = assessmentScore !== null && assessmentScore >= 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">{getText(lesson.title_en, lesson.title_ne)}</h1>
          <p className="text-blue-100 text-lg">{getText('Learn at your own pace', 'आफ्नो गतिमा सिक्नुहोस्')}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white rounded-lg p-4 shadow-md border border-gray-200">
          {[
            { id: 'intro', label: getText('Introduction', 'परिचय'), icon: BookOpen },
            { id: 'mcq', label: getText('Learn', 'सिक्नुहोस्'), icon: Zap },
            { id: 'assessment', label: getText('Assessment', 'मूल्यांकन'), icon: CheckCircle },
            { id: 'resources', label: getText('Resources', 'संसाधनहरु'), icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentSection(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                currentSection === id
                  ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Introduction Section */}
        {currentSection === 'intro' && (
          <Card className="p-8 border-2 border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{getText('Introduction', 'परिचय')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              {getText(lesson.introduction_en, lesson.introduction_ne)}
            </p>
            {lesson.youtube_url && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  {getText('Video Lesson', 'भिडिओ पाठ')}
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={lesson.youtube_url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]}
                    title={getText(lesson.title_en, lesson.title_ne)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Learning MCQs Section */}
        {currentSection === 'mcq' && introductoryMCQs.length > 0 && (
          <div className="space-y-6">
            <Card className="p-8 border-2 border-blue-200 bg-blue-50 shadow-lg">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{getText('Learn with Questions', 'प्रश्नहरु संग सिक्नुहोस्')}</h2>
              <p className="text-gray-600">{getText('Test your understanding as you learn', 'तपाईंको बुझाइ परीक्षण गर्नुहोस्')}</p>
            </Card>

            {introductoryMCQs.map((mcq, index) => (
              <Card key={mcq.id} className="p-6 border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {getText(`Question ${index + 1}`, `प्रश्न ${index + 1}`)}
                </h3>
                <p className="text-gray-700 mb-6 text-lg">{getText(mcq.question_en, mcq.question_ne)}</p>

                <div className="space-y-3">
                  {[
                    { key: 'a', en: mcq.option_a_en, ne: mcq.option_a_ne },
                    { key: 'b', en: mcq.option_b_en, ne: mcq.option_b_ne },
                    { key: 'c', en: mcq.option_c_en, ne: mcq.option_c_ne },
                    { key: 'd', en: mcq.option_d_en, ne: mcq.option_d_ne },
                  ].map(({ key, en, ne }) => (
                    <label
                      key={key}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAnswers[mcq.id] === key
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-300 bg-white hover:border-blue-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={mcq.id}
                        value={key}
                        checked={selectedAnswers[mcq.id] === key}
                        onChange={(e) => handleAnswerChange(mcq.id, e.target.value)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="ml-3 font-medium text-gray-700">{getText(en, ne)}</span>
                    </label>
                  ))}
                </div>

                {selectedAnswers[mcq.id] && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      selectedAnswers[mcq.id]?.toLowerCase() === mcq.correct_answer.toLowerCase()
                        ? 'bg-green-50 border-l-4 border-green-600'
                        : 'bg-yellow-50 border-l-4 border-yellow-600'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 mb-2">
                      {selectedAnswers[mcq.id]?.toLowerCase() === mcq.correct_answer.toLowerCase()
                        ? getText('Correct!', 'सही!')
                        : getText('Not quite right', 'बिल्कुल सही होइन')}
                    </p>
                    <p className="text-gray-700">{getText(mcq.explanation_en, mcq.explanation_ne)}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Assessment Section */}
        {currentSection === 'assessment' && assessmentMCQs.length > 0 && (
          <div className="space-y-6">
            <Card className="p-8 border-2 border-orange-200 bg-orange-50 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">{getText('Final Assessment', 'अंतिम मूल्यांकन')}</h2>
              </div>
              <p className="text-gray-600">
                {getText('Score 80% or higher to unlock the next lesson', '80% वा अधिक स्कोर गर्नुहोस् अगिल्लो पाठ खोल्न')}
              </p>
              {!isLoggedIn && (
                <p className="text-red-600 mt-2 font-semibold">
                  {getText('Log in to earn EduCoins for correct answers', 'सही जवाफको लागि EduCoins अर्जन गर्न लगइन गर्नुहोस्')}
                </p>
              )}
            </Card>

            {assessmentMCQs.map((mcq, index) => (
              <Card
                key={mcq.id}
                className={`p-6 border shadow-md transition-all ${
                  submitted
                    ? selectedAnswers[mcq.id]?.toLowerCase() === mcq.correct_answer.toLowerCase()
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {getText(`Question ${index + 1}`, `प्रश्न ${index + 1}`)}
                </h3>
                <p className="text-gray-700 mb-6 text-lg">{getText(mcq.question_en, mcq.question_ne)}</p>

                <div className="space-y-3">
                  {[
                    { key: 'a', en: mcq.option_a_en, ne: mcq.option_a_ne },
                    { key: 'b', en: mcq.option_b_en, ne: mcq.option_b_ne },
                    { key: 'c', en: mcq.option_c_en, ne: mcq.option_c_ne },
                    { key: 'd', en: mcq.option_d_en, ne: mcq.option_d_ne },
                  ].map(({ key, en, ne }) => (
                    <label
                      key={key}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAnswers[mcq.id] === key
                          ? submitted
                            ? key === mcq.correct_answer
                              ? 'border-green-600 bg-green-100'
                              : 'border-red-600 bg-red-100'
                            : 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={mcq.id}
                        value={key}
                        checked={selectedAnswers[mcq.id] === key}
                        onChange={(e) => !submitted && handleAnswerChange(mcq.id, e.target.value)}
                        disabled={submitted}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="ml-3 font-medium text-gray-700">{getText(en, ne)}</span>
                      {submitted && key === mcq.correct_answer && (
                        <CheckCircle className="ml-auto w-5 h-5 text-green-600" />
                      )}
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-600">
                    <p className="font-semibold text-gray-800 mb-2">{getText('Explanation', 'व्याख्या')}</p>
                    <p className="text-gray-700">{getText(mcq.explanation_en, mcq.explanation_ne)}</p>
                  </div>
                )}
              </Card>
            ))}

            {!submitted ? (
              <Button
                onClick={handleSubmitAssessment}
                className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:shadow-lg transition-shadow"
              >
                {getText('Submit Assessment', 'मूल्यांकन जमा गर्नुहोस्')}
              </Button>
            ) : (
              <Card
                className={`p-6 border-2 ${
                  canProceedToNextLesson
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {canProceedToNextLesson ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  )}
                  <h3 className="text-2xl font-bold text-gray-800">
                    {getText(`Score: ${Math.round(assessmentScore || 0)}%`, `स्कोर: ${Math.round(assessmentScore || 0)}%`)}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  {canProceedToNextLesson
                    ? getText(
                        'Great! You can now proceed to the next lesson',
                        'शानदार! अब तपाईं अगिल्लो पाठमा जान सक्नुहुन्छ'
                      )
                    : getText(
                        'Try again to score 80% or higher to unlock the next lesson',
                        'अगिल्लो पाठ खोल्न 80% वा अधिक स्कोर गर्न फिर्ता प्रयास गर्नुहोस्'
                      )}
                </p>
                {isLoggedIn && (
                  <p className="text-sm text-gray-600">
                    {getText(
                      `You earned ${Math.round((assessmentScore || 0) / 20)} EduCoins for this assessment`,
                      `तपाईंले यो मूल्यांकनको लागि ${Math.round((assessmentScore || 0) / 20)} EduCoins अर्जन गरे`
                    )}
                  </p>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Resources Section */}
        {currentSection === 'resources' && (
          <div className="space-y-6">
            {pdfUrl && (
              <Card className="p-6 border-2 border-green-200 bg-green-50 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{getText('Study Notes PDF', 'अध्ययन नोट्स PDF')}</h3>
                    <p className="text-gray-600 mb-4">
                      {getText(
                        'Download and review comprehensive study notes for this lesson',
                        'यस पाठको लागि व्यापक अध्ययन नोट्स डाउनलोड गर्नुहोस् र समीक्षा गर्नुहोस्'
                      )}
                    </p>
                    {isLoggedIn && (
                      <p className="text-sm text-green-600 font-semibold">
                        {getText('Download to earn 10 EduCoins', 'डाउनलोड गर्न 10 EduCoins अर्जन गर्नुहोस्')}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                  >
                    <Download className="w-5 h-5" />
                    {getText('Download', 'डाउनलोड')}
                  </Button>
                </div>
              </Card>
            )}

            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{getText('Key Formulas', 'मुख्य सूत्रहरु')}</h3>
              <div className="space-y-3 text-gray-700">
                <p>{getText('Formula content coming soon', 'सूत्र सामग्री शीघ्र आउँदैछ')}</p>
              </div>
            </Card>

            <Card className="p-6 border-2 border-purple-200 bg-purple-50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{getText('Related Topics', 'सम्बन्धित विषयहरु')}</h3>
              <div className="space-y-2 text-gray-700">
                <p>{getText('Related content coming soon', 'सम्बन्धित सामग्री शीघ्र आउँदैछ')}</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
