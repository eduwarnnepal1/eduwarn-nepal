'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createBrowserClient } from '@supabase/ssr';
import { Zap, BookOpen, Users, Trophy, ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from '@/components/carousel';
import { YouTubePreview } from '@/components/youtube-preview';
import { WhyEduWarn } from '@/components/why-eduwarn';
import { PartnersSection } from '@/components/partners-section';
import { TestimonialsSection } from '@/components/testimonials-section';

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

export default function Home() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, eventsData, quotesData] = await Promise.all([
          supabase.from('courses').select('*').limit(6),
          supabase.from('learning_events').select('*').eq('is_active', true),
          supabase.from('quotes').select('*').eq('is_active', true),
        ]);

        if (coursesData.data) setCourses(coursesData.data);
        if (eventsData.data) setEvents(eventsData.data);
        if (quotesData.data) setQuotes(quotesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-red-500 to-blue-700 text-white py-20 md:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {getText('Learn. Grow. Succeed.', 'सिक्नुहोस्। बढ्नुहोस्। सफल होनुहोस्।')}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {getText(
                  'Free online learning platform for SEE preparation, science, mathematics, and computer science in Nepal. Join thousands of students on their journey to success.',
                  'नेपालमा SEE तयारी, विज्ञान, गणित, र कम्प्युटर विज्ञानको लागि मुक्त अनलाइन शिक्षण मञ्च। हजारौं विद्यार्थीहरूसँग आपनो सफलताको यात्रामा सामेल हुनुहोस्।'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg"
                >
                  <Link href="/courses">{getText('Explore Courses', 'कोर्सहरू अन्वेषण गर्नुहोस्')}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-bold text-lg bg-transparent"
                >
                  <Link href="/blog">{getText('Read Our Blog', 'हाम्रो ब्लग पढ्नुहोस्')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Rotating Quotes Section */}
        {quotes.length > 0 && (
          <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 md:gap-8">
                <img src="/quote-icon.svg" className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0" />
                <div className="min-h-20 flex flex-col justify-center">
                  <p className="text-lg md:text-2xl font-semibold italic mb-2">
                    "{getText(quotes[currentQuote].content_en, quotes[currentQuote].content_ne)}"
                  </p>
                  {(quotes[currentQuote].author_en || quotes[currentQuote].author_ne) && (
                    <p className="text-blue-100 text-sm">
                      - {getText(quotes[currentQuote].author_en || '', quotes[currentQuote].author_ne || '')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-6 justify-center">
                {quotes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuote(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentQuote ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Users, label: getText('Active Students', 'सक्रिय विद्यार्थीहरू'), value: '10,000+' },
                { icon: BookOpen, label: getText('Courses Available', 'उपलब्ध कोर्सहरू'), value: '50+' },
                { icon: Trophy, label: getText('Success Rate', 'सफलता दर'), value: '95%' },
                { icon: Zap, label: getText('Learning Hours', 'शिक्षण घण्टाहरू'), value: '50,000+' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

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
        <section className="container mx-auto px-4 py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
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
                <Card key={course.id} className="group overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative aspect-video bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center overflow-hidden">
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url || '/placeholder.svg'}
                        alt={getText(course.title_en, course.title_ne)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                  </div>

                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-3">
                      {getText(course.level || 'Beginner', 'शुरुआती')}
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                      {getText(course.title_en, course.title_ne)}
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {getText(course.description_en, course.description_ne)}
                    </p>

                    <Button
                      asChild
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 p-0 h-auto font-semibold flex items-center gap-2"
                    >
                      <Link href={`/courses/${course.id}`}>
                        {getText('Explore', 'अन्वेषण गर्नुहोस्')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              className="bg-gradient-to-r from-red-600 to-blue-600 text-white hover:shadow-lg"
            >
              <Link href="/courses">{getText('View All Courses', 'सबै कोर्सहरू हेर्नुहोस्')}</Link>
            </Button>
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
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {getText('Become a Partner', 'साझेदार बन्नुहोस्')}
                </h3>
                <p className="text-blue-800 mb-6">
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
              <Card className="p-8 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-red-900 mb-4">
                  {getText('Become a Mentor', 'सलाहदाता बन्नुहोस्')}
                </h3>
                <p className="text-red-800 mb-6">
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

        {/* Final CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {getText('Ready to Start Learning?', 'सिक्न तयार हुनुहुन्छ?')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {getText(
                'Join our community of learners and ace your exams. Start for free today!',
                'हाम्रो विद्यार्थीहरूको समुदायमा सामेल हुनुहोस् र आपनो परीक्षा पास गर्नुहोस्। आज मुक्त रूपमा सुरु गर्नुहोस्!'
              )}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 font-bold"
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
