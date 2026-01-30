'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, BarChart3, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';

interface Module {
  id: string;
  title_en: string;
  title_ne: string;
  module_number: number;
  description_en?: string;
  description_ne?: string;
}

interface Course {
  id: string;
  title_en: string;
  title_ne: string;
  description_en: string;
  description_ne: string;
  category_en?: string;
  category_ne?: string;
}

export default function CourseDetailPage() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';
  const params = useParams();
  const courseId = params.courseid as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Fetch course
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        setCourse(courseData);

        // Fetch modules
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('module_number', { ascending: true });

        setModules(modulesData || []);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, supabase]);

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">{getText('Loading...', 'लोड हुँदै...')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">{getText('Course not found', 'कोर्स फेला परेन')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center gap-2">
            <Link href="/courses" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" />
              {getText('Courses', 'कोर्सहरु')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{getText(course.title_en, course.title_ne)}</span>
          </div>
        </div>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-12 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-4">{getText(course.title_en, course.title_ne)}</h1>
            <p className="text-lg opacity-90 mb-6">
              {getText(course.description_en, course.description_ne)}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{modules.length} {getText('Chapters', 'अध्याय')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{getText('5,234 Students', '5,234 विद्यार्थीहरु')}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span>{getText(course.category_en || 'Course', course.category_ne || 'पाठ्यक्रम')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            {getText('Course Modules', 'पाठ्यक्रम मोड्यूलहरु')}
          </h2>

          <div className="space-y-4">
            {modules.length > 0 ? (
              modules.map((module, index) => (
                <Link key={module.id} href={`/courses/${courseId}/${module.id}`}>
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-red-400 transition-all p-6 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            {module.module_number}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {getText(`Chapter ${module.module_number}: ${module.title_en}`, `अध्याय ${module.module_number}: ${module.title_ne}`)}
                          </h3>
                        </div>
                        {module.description_en && (
                          <p className="text-gray-600 ml-13">
                            {getText(module.description_en, module.description_ne || '')}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" className="text-red-600 hover:text-red-700">
                        {getText('Start →', 'सुरु गर्नुहोस् →')}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">
                  {getText('No modules found', 'मोड्यूलहरु फेला परेन')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
