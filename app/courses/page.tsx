'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

interface Module {
  id: string;
  course_id: string;
  title_en: string;
  title_ne: string;
  module_number: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title_en: string;
  title_ne: string;
  lesson_number: number;
}

const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    title_ne: "कम्प्युटर विज्ञानको परिचय",
    description: "Learn the fundamentals of computing and algorithms in this comprehensive course.",
    description_ne: "यस व्यापक पाठ्यक्रममा कम्प्युटिङ र एल्गोरिदमको आधारभूत कुराहरू सिक्नुहोस्।",
    thumbnail_url: "/computer-science.jpg",
    difficulty_level: "beginner",
    category: "Technology",
    estimated_duration: 120,
    points_reward: 200,
  },
  {
    id: "2",
    title: "Mastering Mathematics for SEE",
    title_ne: "SEE का लागि गणितमा महारत",
    description: "Key concepts and problem-solving techniques for the Secondary Education Examination.",
    description_ne: "माध्यमिक शिक्षा परीक्षाका लागि प्रमुख अवधारणाहरू र समस्या समाधान गर्ने प्रविधिहरू।",
    thumbnail_url: "/math-education.jpg",
    difficulty_level: "intermediate",
    category: "Academics",
    estimated_duration: 180,
    points_reward: 300,
  },
  {
    id: "3",
    title: "Career Paths in Nepal",
    title_ne: "नेपालमा करियर मार्गहरू",
    description: "Explore various career opportunities and educational pathways in the Nepali market.",
    description_ne: "नेपाली बजारमा विभिन्न करियर अवसरहरू र शैक्षिक मार्गहरू अन्वेषण गर्नुहोस्।",
    thumbnail_url: "/career-nepal.jpg",
    difficulty_level: "beginner",
    category: "Career",
    estimated_duration: 60,
    points_reward: 100,
  },
]

const useLanguage = () => {
  const { language } = useContext(LanguageContext);
  const t = (key: string) => key; // Placeholder for translation function
  return { language, t };
};

export default function CoursesPage() {
  const { language } = useContext(LanguageContext);
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<Record<string, Module[]>>({});
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch all courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (coursesData) {
          setCourses(coursesData);

          // Fetch modules for each course
          for (const course of coursesData) {
            const { data: modulesData } = await supabase
              .from('modules')
              .select('*')
              .eq('course_id', course.id)
              .order('module_number', { ascending: true });

            if (modulesData) {
              setModules(prev => ({ ...prev, [course.id]: modulesData }));

              // Fetch lessons for each module
              for (const module of modulesData) {
                const { data: lessonsData } = await supabase
                  .from('lessons')
                  .select('*')
                  .eq('module_id', module.id)
                  .order('lesson_number', { ascending: true });

                if (lessonsData) {
                  setLessons(prev => ({ ...prev, [module.id]: lessonsData }));
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [supabase]);

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">{getText('Loading courses...', 'कोर्स लोड हुँदै...')}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {getText('Our Courses', 'हाम्रा कोर्सहरू')}
            </h1>
            <p className="text-muted-foreground">
              {getText('Start learning something new today', 'नयाँ कुरा सिक्न सुरु गर्नुहोस्')}
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder={getText('Search courses...', 'खोज्नुहोस्...')} />
          </div>
        </div>

        {/* Show database courses with lessons */}
        {courses.length > 0 ? (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-red-600 to-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {getText(course.title_en, course.title_ne)}
                  </h2>
                  <p className="text-sm opacity-90">
                    {getText(course.description_en, course.description_ne)}
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  {modules[course.id]?.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          setExpandedModule(expandedModule === module.id ? null : module.id)
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-800">
                          {getText(`Chapter ${module.module_number}: ${module.title_en}`, `अध्याय ${module.module_number}: ${module.title_ne}`)}
                        </span>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            expandedModule === module.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {expandedModule === module.id && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-2">
                          {lessons[module.id]?.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/lessons/${lesson.id}`}
                              className="block p-3 rounded bg-white hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-400"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-800">
                                  {getText(
                                    `Lesson ${lesson.lesson_number}: ${lesson.title_en}`,
                                    `पाठ ${lesson.lesson_number}: ${lesson.title_ne}`
                                  )}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} language={language} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
