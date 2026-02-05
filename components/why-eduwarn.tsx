'use client';

import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { Loader } from 'lucide-react';
import { Icon as Icons } from 'lucide-react';

interface WhyEduwarnItem {
  id: string;
  title_en: string;
  title_ne: string;
  description_en: string;
  description_ne: string;
  icon_name: string;
  order_index: number;
}

export function WhyEduWarn() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [items, setItems] = useState<WhyEduwarnItem[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await supabase
          .from('why_eduwarn')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (data) setItems(data);
      } catch (error) {
        console.error('Error fetching why_eduwarn items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [supabase]);

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Users: Icons.Users,
      Zap: Icons.Zap,
      DollarSign: Icons.DollarSign,
      Clock: Icons.Clock,
      Award: Icons.Award,
      Headphones: Icons.Headphones,
    };
    return iconMap[iconName] || Icons.Star;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {getText('Why EduWarn is the Best', 'एडुवर्न सबैभन्दा राम्रो किन हो')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {getText(
              'Discover what makes us the preferred choice for thousands of learners across Nepal',
              'नेपालभर हजारौं शिक्षार्थीहरूको लागि हामीलाई पसंदको विकल्प बनाउने कुरा जानुहोस्'
            )}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const IconComponent = getIcon(item.icon_name);
            return (
              <div
                key={item.id}
                className="bg-gradient-to-br from-blue-50 to-red-50 p-8 rounded-xl border-2 border-gray-200 hover:border-red-600 hover:shadow-lg transition-all group"
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-red-600 to-blue-600 rounded-lg p-4 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {getText(item.title_en, item.title_ne)}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {getText(item.description_en, item.description_ne)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
