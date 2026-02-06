'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createBrowserClient } from '@supabase/ssr';
import { Zap, BookOpen, Users, Trophy, ArrowRight, Loader, Quote } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from '@/components/carousel';
import { YouTubePreview } from '@/components/youtube-preview';
import { WhyEduWarn } from '@/components/why-eduwarn';
import { PartnersSection } from '@/components/partners-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { Hero } from '@/components/hero';
interface Course {
  id: string;
  title_en: string;
  title_ne: string;
  description_en: string;
  description_ne: string;
  thumbnail_url: string;
  level: string;
}

interface LearningEvent {
  id: string;
  title_en: string;
  title_ne: string;
  description_en?: string;
  description_ne?: string;
  image_url?: string;
  event_date?: string;
}

interface Statistics {
  total_students: number;
  total_courses: number;
  total_success_rate: number;
  total_learning_hours: number;
}

export default function Home() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, eventsData, quotesData, statsData] = await Promise.all([
          supabase.from('courses').select('*').limit(6),
          supabase.from('learning_events').select('*').eq('is_active', true),
          supabase.from('quotes').select('*').eq('is_active', true),
          supabase.from('statistics').select('*').single(),
        ]);

        if (coursesData.data) setCourses(coursesData.data);
        if (eventsData.data) setEvents(eventsData.data);
        if (quotesData.data) setQuotes(quotesData.data);
        if (statsData.data) setStatistics(statsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback stats if table doesn't exist
        setStatistics({
          total_students: 0,
          total_courses: 0,
          total_success_rate: 0,
          total_learning_hours: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Rotate quotes
  useEffect(() => {
    if (quotes.length === 0) return;
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Modern Clean Design */}
        <Hero />

        {/* Rotating Quotes Section - Clean Modern */}
        {quotes.length > 0 && (
          <section className="bg-gray-50 py-16 border-y border-gray-200">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-4 md:gap-6">
                  <Quote className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg md:text-xl font-semibold text-gray-900 mb-3 italic">
                      "{getText(quotes[currentQuote].content_en, quotes[currentQuote].content_ne)}"
                    </p>
                    {(quotes[currentQuote].author_en || quotes[currentQuote].author_ne) && (
                      <p className="text-gray-600 text-sm font-medium">
                        — {getText(quotes[currentQuote].author_en || '', quotes[currentQuote].author_ne || '')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-8 justify-center">
                  {quotes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuote(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentQuote ? 'bg-red-600 w-8' : 'bg-gray-300 hover:bg-gray-400 w-2'
                      }`}
                      aria-label={`Quote ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stats Section - Clean Cards */}
        {statistics && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Users, label: getText('Active Students', 'सक्रिय विद्यार्थीहरू'), value: statistics.total_students || 0, suffix: '+' },
                  { icon: BookOpen, label: getText('Courses Available', 'उपलब्ध कोर्सहरू'), value: statistics.total_courses || 0, suffix: '+' },
                  { icon: Trophy, label: getText('Success Rate', 'सफलता दर'), value: statistics.total_success_rate || 0, suffix: '%' },
                  { icon: Zap, label: getText('Learning Hours', 'शिक्षण घण्टाहरू'), value: statistics.total_learning_hours || 0, suffix: '+' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:border-red-200 hover:shadow-md transition-all">
                      <Icon className="w-10 h-10 text-red-600 mb-4" />
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value.toLocaleString()}{stat.suffix}</p>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Learning Events Carousel */}
        {events.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {getText('Upcoming Learning Events', 'आसन्न शिक्षण घटनाहरू')}
              </h2>
            </div>
            <div className="container mx-auto px-4">
              <div className="h-96 rounded-xl overflow-hidden">
                <Carousel items={events} autoPlay={true} interval={6000} language={language as 'en' | 'ne'} />
              </div>
            </div>
          </section>
        )}

        {/* Featured Courses Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {getText('Featured Courses', 'मुख्य कोर्सहरू')}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                {getText(
                  'Start learning with our most popular courses designed for SEE, Science, Math, and Computer Science students',
                  'SEE, विज्ञान, गणित, र कम्प्युटर विज्ञान विद्यार्थीहरूको लागि डिजाइन गरिएका हाम्रो सबैभन्दा लोकप्रिय कोर्सहरूसँग सिक्न सुरु गर्नुहोस्'
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <Card key={course.id} className="group overflow-hidden hover:shadow-lg transition-all border-gray-200 hover:border-red-200">
                    <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                      {course.thumbnail_url && (
                        <img
                          src={course.thumbnail_url || '/placeholder.svg'}
                          alt={getText(course.title_en, course.title_ne)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>

                    <div className="p-6">
                      <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold mb-3">
                        {getText(course.level || 'Beginner', 'शुरुआती')}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {getText(course.title_en, course.title_ne)}
                      </h3>

                      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                        {getText(course.description_en, course.description_ne)}
                      </p>

                      <Button
                        asChild
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 p-0 h-auto font-semibold text-sm flex items-center gap-1"
                      >
                        <Link href={`/courses/${course.id}`}>
                          {getText('Explore', 'अन्वेषण गर्नुहोस्')}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-red-600 text-white hover:bg-red-700 px-8 font-semibold"
              >
                <Link href="/courses">{getText('View All Courses', 'सबै कोर्सहरू हेर्नुहोस्')}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why EduWarn Section */}
        <WhyEduWarn />

        {/* YouTube Preview Section */}
        <YouTubePreview />

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {getText('Student & Parent Testimonials', 'विद्यार्थी र अभिभावक प्रशंसापत्र')}
              </h2>
              <p className="text-gray-600 text-lg">
                {getText(
                  'Hear from our community about their learning experience',
                  'हाम्रो समुदायबाट उनीहरूको शिक्षा अनुभव बारे सुनुहोस्'
                )}
              </p>
            </div>
            <TestimonialsSection />
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />

        {/* Partnership & Volunteer CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Partnership Card */}
              <Card className="p-8 bg-white border-2 border-blue-200 hover:shadow-lg hover:border-blue-400 transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-xl">🤝</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {getText('Become a Partner', 'साझेदार बन्नुहोस्')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getText(
                    'Partner with EduWarn to reach thousands of students and expand your impact',
                    'EduWarn सँग साझेदारी गर्नुहोस् र हजारौं विद्यार्थीहरूमा पहुँच गर्नुहोस्'
                  )}
                </p>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <Link href="/partner-with-us">
                    {getText('Learn More', 'थप जानुहोस्')}
                  </Link>
                </Button>
              </Card>

              {/* Volunteer Card */}
              <Card className="p-8 bg-white border-2 border-red-200 hover:shadow-lg hover:border-red-400 transition-all">
                <div className="w-12 h-12 bg-red-50 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-xl">👨‍🏫</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {getText('Become a Mentor', 'सलाहदाता बन्नुहोस्')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getText(
                    'Help students succeed by sharing your knowledge and experience',
                    'आपनो ज्ञान र अनुभव साझा गरेर विद्यार्थीहरूलाई सफल हुन मद्दत गर्नुहोस्'
                  )}
                </p>
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white px-6"
                >
                  <Link href="/become-mentor">
                    {getText('Join Us', 'हामीसँग जोडिनुहोस्')}
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Clean Modern */}
        <section className="bg-gray-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {getText('Ready to Start Learning?', 'सिक्न तयार हुनुहुन्छ?')}
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              {getText(
                'Join thousands of students and ace your exams. Start your free learning journey today!',
                'हजारौं विद्यार्थीहरूसँग जोडिनुहोस् र आपनो परीक्षा पास गर्नुहोस्। आज मुक्त रूपमा सुरु गर्नुहोस्!'
              )}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 px-8 font-semibold text-base"
            >
              <Link href="/auth/register">{getText('Sign Up Free', 'मुक्त साइन अप गर्नुहोस्')}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
