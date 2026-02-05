'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { MessageCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { ForumCategories } from '@/components/forum-categories';

export default function ForumPage() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <section className="py-16 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-block mb-4">
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-full">
                  {getText('Community', 'समुदाय')}
                </span>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 mb-3">
                    {getText('Discussion Forum', 'छलफल फोरम')}
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    {getText(
                      'Connect with fellow students, share ideas, ask questions, and learn together in our vibrant community.',
                      'साथी विद्यार्थीहरूसँग जोडिनुहोस्, विचार साझा गर्नुहोस्, प्रश्न सोध्नुहोस्, र हाम्रो जीवन्त समुदायमा सँगै सिक्नुहोस्।'
                    )}
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold whitespace-nowrap"
                >
                  <Link href="/forum/new-thread">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {getText('Start Discussion', 'छलफल सुरु गर्नुहोस्')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-red-600" />
                {getText('Forum Categories', 'फोरम श्रेणीहरू')}
              </h2>
              <p className="text-gray-600">
                {getText(
                  'Select a category to view or start discussions',
                  'छलफल हेर्न वा सुरु गर्न श्रेणी चयन गर्नुहोस्'
                )}
              </p>
            </div>

            <ForumCategories />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getText('Have a Question?', 'कोई प्रश्न छ?')}
            </h2>
            <p className="text-gray-600 mb-8">
              {getText(
                'Our community is here to help. Ask anything and get answers from experienced students and mentors.',
                'हाम्रो समुदाय मद्दत गर्न यहाँ छ। अनुभवी विद्यार्थी र सलाहदाताहरूबाट कुनै पनि कुरा सोध्नुहोस् र जवाफ पाउनुहोस्।'
              )}
            </p>
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold"
            >
              <Link href="/forum/new-thread">
                {getText('Ask Now', 'अहिले सोध्नुहोस्')}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
