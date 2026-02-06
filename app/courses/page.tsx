'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

interface Course {
  id: string;
  title_en: string;
  title_ne: string;
  description_en: string;
  description_ne: string;
  category_en?: string;
  category_ne?: string;
  thumbnail_url?: string;
  difficulty_level?: string;
}

const COURSE_CATEGORIES = [
  { en: 'All Courses', ne: 'सबै कोर्सहरु' },
  { en: 'Science', ne: 'विज्ञान' },
  { en: 'Mathematics', ne: 'गणित' },
  { en: 'Technology', ne: 'प्रविधि' },
  { en: 'Languages', ne: 'भाषाहरु' },
  { en: 'Career', ne: 'करियर' },
];

export default function CoursesPage() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        setCourses(data || []);
        setFilteredCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [supabase]);

  useEffect(() => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter((c) =>
        (language === 'ne' ? c.title_ne : c.title_en)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (c) =>
          (language === 'ne' ? c.category_ne : c.category_en)
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategory, courses, language]);

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-4">{getText('Explore Courses', 'कोर्सहरु अन्वेषण गर्नुहोस्')}</h1>
            <p className="text-lg opacity-90">
              {getText(
                'Choose from hundreds of courses and start learning today',
                'हजारहरु कोर्सहरु मध्ये चुनेर आज सिक्न सुरु गर्नुहोस्'
              )}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder={getText('Search courses...', 'कोर्सहरु खोज्नुहोस्...')}
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              {getText('Filter', 'फिल्टर')}
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-200">
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.en}
                onClick={() => setSelectedCategory(cat.en.toLowerCase().replace(' ', '-'))}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.en.toLowerCase().replace(' ', '-')
                    ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-red-600'
                }`}
              >
                {getText(cat.en, cat.ne)}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">
              {getText('Loading courses...', 'कोर्सहरु लोड हुँदै...')}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow h-full overflow-hidden border border-gray-200 cursor-pointer group">
                    <div className="bg-gradient-to-r from-red-600 to-blue-600 h-32 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {getText(course.title_en, course.title_ne)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getText(course.description_en, course.description_ne)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          {getText(course.category_en || 'Course', course.category_ne || 'पाठ्यक्रम')}
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {getText('No courses found', 'कोर्सहरु फेला परेन')}
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                {getText('Clear Filters', 'फिल्टरहरु हटाउनुहोस्')}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
