'use client';

import React, { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { MessageSquare, Users, Zap, BookOpen, Code, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export function ForumCategories() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  const categories = [
    {
      id: 'general',
      icon: MessageSquare,
      name_en: 'General Discussion',
      name_ne: 'सामान्य छलफल',
      description_en: 'Share your thoughts and ideas with the community',
      description_ne: 'समुदायसँग आपनो विचार र विचार साझा गर्नुहोस्',
      threads: 245,
      posts: 892,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      id: 'see-prep',
      icon: BookOpen,
      name_en: 'SEE Preparation',
      name_ne: 'SEE तयारी',
      description_en: 'Tips, strategies, and resources for SEE exams',
      description_ne: 'SEE परीक्षाका लागि सुझाव, रणनीति र संसाधनहरू',
      threads: 156,
      posts: 634,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      id: 'science',
      icon: Zap,
      name_en: 'Science & Math',
      name_ne: 'विज्ञान र गणित',
      description_en: 'Study help for physics, chemistry, biology, and mathematics',
      description_ne: 'भौतिकी, रसायन विज्ञान, जीवविज्ञान र गणितको लागि अध्ययन सहायता',
      threads: 189,
      posts: 756,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      id: 'coding',
      icon: Code,
      name_en: 'Computer Science',
      name_ne: 'कम्प्युटर विज्ञान',
      description_en: 'Programming, coding challenges, and tech questions',
      description_ne: 'प्रोग्रामिङ, कोडिङ चुनौतीहरू र प्रविधि प्रश्नहरू',
      threads: 128,
      posts: 512,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      id: 'careers',
      icon: Users,
      name_en: 'Career Guidance',
      name_ne: 'करियर मार्गदर्शन',
      description_en: 'Discuss career paths, colleges, and opportunities',
      description_ne: 'करियर मार्ग, कलेज र अवसरहरूको बारेमा छलफल गर्नुहोस्',
      threads: 98,
      posts: 425,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
    },
    {
      id: 'faq',
      icon: HelpCircle,
      name_en: 'FAQs & Help',
      name_ne: 'सामान्य प्रश्नहरू र सहायता',
      description_en: 'Answers to common questions and platform guidance',
      description_ne: 'सामान्य प्रश्नहरूको उत्तर र मञ्च मार्गदर्शन',
      threads: 45,
      posts: 189,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.id} href={`/forum/category/${category.id}`}>
            <Card className={`h-full p-6 ${category.color} hover:shadow-lg transition-all cursor-pointer border-2`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${category.color.split(' ')[0]} bg-opacity-100`}>
                  <Icon className={`w-6 h-6 ${category.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {getText(category.name_en, category.name_ne)}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {getText(category.description_en, category.description_ne)}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold">{category.threads}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{category.posts}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-red-600 hover:text-red-700">
                  {getText('View', 'हेर्नुहोस्')} →
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
