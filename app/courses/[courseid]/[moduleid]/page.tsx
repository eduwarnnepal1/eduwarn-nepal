'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Volume2, BookOpen, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import('@/components/pdf-viewer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="bg-gray-100 h-96 flex items-center justify-center">Loading PDF...</div> }
);

interface Lesson {
  id: string;
  title_en: string;
  title_ne: string;
  introduction_en: string;
  introduction_ne: string;
  youtube_url?: string;
  lesson_number: number;
}

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

interface LessonResource {
  id: string;
  resource_type: string;
  file_url: string;
  title_en?: string;
  title_ne?: string;
}

interface Module {
  title_en: string;
  title_ne: string;
}

interface Course {
  title_en: string;
  title_ne: string;
}

export default function LessonPage() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';
  const params = useParams();
  const courseId = params.courseid as string;
  const moduleId = params.moduleid as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'intro' | 'learn' | 'pdf' | 'assessment'>('intro');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchLessonData = async () => {
      setLoading(true);
      try {
        // Fetch course
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();
        setCourse(courseData);

        // Fetch module
        const { data: moduleData } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();
        setModule(moduleData);

        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', moduleId)
          .order('lesson_number', { ascending: true });

        setLessons(lessonsData || []);
        if (lessonsData && lessonsData.length > 0) {
          setSelectedLesson(lessonsData[0]);

          // Fetch MCQs for first lesson
          const { data: mcqsData } = await supabase
            .from('mcqs')
            .select('*')
            .eq('lesson_id', lessonsData[0].id);
          setMcqs(mcqsData || []);

          // Fetch resources for first lesson
          const { data: resourcesData } = await supabase
            .from('lesson_resources')
            .select('*')
            .eq('lesson_id', lessonsData[0].id);
          setResources(resourcesData || []);
        }
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && moduleId) {
      fetchLessonData();
    }
  }, [courseId, moduleId, supabase]);

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  const handleLessonSelect = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentTab('intro');
    setSelectedAnswers({});
    setSubmitted(false);
    setAssessmentScore(null);

    try {
      const [mcqsResult, resourcesResult] = await Promise.all([
        supabase.from('mcqs').select('*').eq('lesson_id', lesson.id),
        supabase.from('lesson_resources').select('*').eq('lesson_id', lesson.id),
      ]);

      setMcqs(mcqsResult.data || []);
      setResources(resourcesResult.data || []);
    } catch (error) {
      console.error('Error fetching lesson resources:', error);
    }
  };

  const handleSubmitAssessment = () => {
    const assessmentMCQs = mcqs.filter((m) => m.mcq_type === 'assessment');
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">{getText('Loading lesson...', 'पाठ लोड हुँदै...')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const introductoryMCQs = mcqs.filter((m) => m.mcq_type === 'introductory');
  const assessmentMCQs = mcqs.filter((m) => m.mcq_type === 'assessment');
  const pdfResource = resources.find((r) => r.resource_type === 'pdf');

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              {getText('Courses', 'कोर्सहरु')}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-700">
              {getText(course?.title_en || '', course?.title_ne || '')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">
              {getText(module?.title_en || '', module?.title_ne || '')}
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lessons Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 h-fit sticky top-4">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">
                  {getText('Lessons', 'पाठहरु')}
                </h3>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-3 rounded transition-all text-sm font-medium ${
                        selectedLesson?.id === lesson.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-300 px-2 py-1 rounded">
                          {lesson.lesson_number}
                        </span>
                        <span className="line-clamp-2">{getText(lesson.title_en, lesson.title_ne)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {selectedLesson && (
                <>
                  {/* Lesson Header */}
                  <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-lg p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                      {getText(selectedLesson.title_en, selectedLesson.title_ne)}
                    </h1>
                    <p className="text-blue-100">
                      {getText(`Lesson ${selectedLesson.lesson_number}`, `पाठ ${selectedLesson.lesson_number}`)}
                    </p>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex flex-wrap gap-2 bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    {[
                      { id: 'intro', label: getText('Introduction', 'परिचय'), icon: BookOpen },
                      { id: 'pdf', label: getText('Notes & MCQs', 'नोट्स र प्रश्नहरु'), icon: BookOpen, disabled: !pdfResource },
                      { id: 'assessment', label: getText('Assessment', 'मूल्यांकन'), icon: CheckCircle, badge: assessmentMCQs.length },
                    ].map(({ id, label, icon: Icon, badge, disabled }) => (
                      <button
                        key={id}
                        onClick={() => setCurrentTab(id as any)}
                        disabled={disabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                          currentTab === id
                            ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg'
                            : disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {badge && badge > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-1">
                            {badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {currentTab === 'intro' && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        {getText(selectedLesson.introduction_en, selectedLesson.introduction_ne)}
                      </p>

                      {selectedLesson.youtube_url && (
                        <div className="mt-6">
                          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                            <Volume2 className="w-5 h-5" />
                            {getText('Video Lesson', 'भिडिओ पाठ')}
                          </h3>
                          <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                            <iframe
                              width="100%"
                              height="100%"
                              src={selectedLesson.youtube_url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]}
                              title={getText(selectedLesson.title_en, selectedLesson.title_ne)}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}



                  {currentTab === 'pdf' && pdfResource && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">{getText(pdfResource.title_en || 'Study Notes', pdfResource.title_ne || 'अध्ययन नोट्स')}</h3>
                        <a
                          href={pdfResource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          <Download className="w-4 h-4" />
                          {getText('Download', 'डाउनलोड')}
                        </a>
                      </div>
                      <div className="h-96 bg-gray-100 flex items-center justify-center">
                        <PDFViewer url={pdfResource.file_url} />
                      </div>
                    </div>
                  )}

                  {currentTab === 'assessment' && assessmentMCQs.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                          <h3 className="font-bold text-gray-800">{getText('Final Assessment', 'अंतिम मूल्यांकन')}</h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {getText('Score 80% or higher to unlock the next lesson', '80% वा अधिक स्कोर गर्नुहोस् अगिल्लो पाठ खोल्न')}
                        </p>
                      </div>

                      {assessmentMCQs.map((mcq, index) => (
                        <div key={mcq.id} className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${
                          submitted && selectedAnswers[mcq.id]?.toLowerCase() === mcq.correct_answer.toLowerCase()
                            ? 'border-green-500'
                            : submitted ? 'border-red-500' : ''
                        }`}>
                          <h3 className="font-bold text-gray-800 mb-4">
                            {getText(`Question ${index + 1}`, `प्रश्न ${index + 1}`)} - {getText(mcq.question_en, mcq.question_ne)}
                          </h3>
                          <div className="space-y-3">
                            {[
                              { key: 'a', en: mcq.option_a_en, ne: mcq.option_a_ne },
                              { key: 'b', en: mcq.option_b_en, ne: mcq.option_b_ne },
                              { key: 'c', en: mcq.option_c_en, ne: mcq.option_c_ne },
                              { key: 'd', en: mcq.option_d_en, ne: mcq.option_d_ne },
                            ].map(({ key, en, ne }) => (
                              <label key={key} className={`flex items-center p-3 rounded border cursor-pointer ${
                                selectedAnswers[mcq.id] === key
                                  ? submitted
                                    ? key === mcq.correct_answer ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'
                                    : 'border-blue-600 bg-blue-50'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}>
                                <input
                                  type="radio"
                                  name={mcq.id}
                                  value={key}
                                  checked={selectedAnswers[mcq.id] === key}
                                  onChange={(e) => !submitted && setSelectedAnswers({ ...selectedAnswers, [mcq.id]: e.target.value })}
                                  disabled={submitted}
                                  className="w-4 h-4"
                                />
                                <span className="ml-3 text-gray-700">{getText(en, ne)}</span>
                                {submitted && key === mcq.correct_answer && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                              </label>
                            ))}
                          </div>

                          {submitted && (
                            <div className="mt-4 p-4 rounded bg-blue-50 border-l-4 border-blue-600">
                              <p className="font-semibold text-gray-800 mb-2">{getText('Explanation', 'व्याख्या')}</p>
                              <p className="text-gray-700 text-sm">{getText(mcq.explanation_en, mcq.explanation_ne)}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {!submitted ? (
                        <Button
                          onClick={handleSubmitAssessment}
                          className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold py-3 rounded-lg text-lg"
                        >
                          {getText('Submit Assessment', 'मूल्यांकन जमा गर्नुहोस्')}
                        </Button>
                      ) : (
                        <div className={`p-6 rounded-lg ${assessmentScore! >= 80 ? 'bg-green-50 border border-green-500' : 'bg-red-50 border border-red-500'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            {assessmentScore! >= 80 ? (
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                              <AlertCircle className="w-8 h-8 text-red-600" />
                            )}
                            <h3 className="text-2xl font-bold text-gray-800">
                              {getText(`Score: ${Math.round(assessmentScore || 0)}%`, `स्कोर: ${Math.round(assessmentScore || 0)}%`)}
                            </h3>
                          </div>
                          <p className="text-gray-700">
                            {assessmentScore! >= 80
                              ? getText('Great! You can proceed to the next lesson', 'शानदार! तपाईं अगिल्लो पाठमा जान सक्नुहुन्छ')
                              : getText('Try again to score 80% or higher', 'फिर्ता प्रयास गर्नुहोस्')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
