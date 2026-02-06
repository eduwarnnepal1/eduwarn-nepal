'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { ForumCategories } from '@/components/forum-categories';

export default function ForumPage() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600"></span>
                <span className="text-sm font-semibold text-red-600">
                  {getText('Active Community', 'सक्रिय समुदाय')}
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                {getText('Community Forum', 'सामुदायिक फोरम')}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                {getText(
                  'Connect with thousands of students, share knowledge, ask questions, and grow together in our vibrant learning community.',
                  'हजारौं विद्यार्थीहरूसँग जोडिनुहोस्, ज्ञान साझा गर्नुहोस्, प्रश्न सोध्नुहोस्, र हाम्रो जीवन्त सिक्ने समुदायमा सँगै बढ्नुहोस्।'
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold rounded-lg transition-all"
                >
                  <Link href="/forum/new-thread">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {getText('Start a Discussion', 'छलफल सुरु गर्नुहोस्')}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:border-red-600 hover:text-red-600 px-8 py-3 font-semibold rounded-lg transition-all bg-transparent"
                >
                  <Link href="#categories">
                    {getText('Browse Categories', 'श्रेणीहरू ब्राउज गर्नुहोस्')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">1.2K+</div>
                <p className="text-gray-600 text-sm">{getText('Active Discussions', 'सक्रिय छलफलहरू')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">8K+</div>
                <p className="text-gray-600 text-sm">{getText('Community Posts', 'समुदाय पोस्टहरू')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">5K+</div>
                <p className="text-gray-600 text-sm">{getText('Active Members', 'सक्रिय सदस्यहरू')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20" id="categories">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
                <h2 className="text-4xl font-bold text-gray-900">
                  {getText('Forum Categories', 'फोरम श्रेणीहरू')}
                </h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">
                {getText(
                  'Choose a category that interests you and start connecting with like-minded students.',
                  'तपाईंलाई रुचाउने श्रेणी चुनुहोस् र समान विचारधारा भएका विद्यार्थीहरूसँग जोडिन सुरु गर्नुहोस्।'
                )}
              </p>
            </div>

            <ForumCategories />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              {getText('Why Join Our Forum?', 'हाम्रो फोरममा किन जोडिने?')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getText('Real Experts', 'वास्तविक विशेषज्ञहरू')}
                </h3>
                <p className="text-gray-600">
                  {getText(
                    'Get help from experienced students and verified mentors',
                    'अनुभवी विद्यार्थी र प्रमाणित सलाहदाताहरूबाट सहायता पाउनुहोस्'
                  )}
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getText('Fast Answers', 'द्रुत उत्तरहरू')}
                </h3>
                <p className="text-gray-600">
                  {getText(
                    'Get responses to your questions within minutes',
                    'मिनेटहरू भित्र आपनो प्रश्नहरूको जवाफ पाउनुहोस्'
                  )}
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getText('Safe Space', 'सुरक्षित स्थान')}
                </h3>
                <p className="text-gray-600">
                  {getText(
                    'Ask anything without judgment in our welcoming community',
                    'हाम्रो स्वागत समुदायमा कुनै फैसलाको बिना कुनै पनी कुरा सोध्नुहोस्'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {getText('Ready to Join the Conversation?', 'छलफलमा जोडिन तयार?')}
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {getText(
                  'Start asking questions, sharing knowledge, and connecting with students from across Nepal.',
                  'प्रश्न सोध्न, ज्ञान साझा गर्न, र नेपालभरि विद्यार्थीहरूसँग जोडिन सुरु गर्नुहोस्।'
                )}
              </p>
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold rounded-lg"
              >
                <Link href="/forum/new-thread">
                  {getText('Create Your First Post', 'आपनो पहिलो पोस्ट सिर्जना गर्नुहोस्')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
