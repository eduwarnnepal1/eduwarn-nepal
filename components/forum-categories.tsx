'use client';

import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { MessageSquare, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Category {
  id: string;
  name_en: string;
  name_ne: string;
  description_en: string;
  description_ne: string;
  thread_count: number;
  post_count: number;
  latest_activity: string | null;
}

export function ForumCategories() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('forum_categories')
          .select(`
            id,
            name_en,
            name_ne,
            description_en,
            description_ne,
            thread_count,
            post_count,
            latest_activity
          `)
          .order('order_index', { ascending: true });

        if (data) setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [supabase]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/forum/category/${category.id}`}>
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getText(category.name_en, category.name_ne)}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {getText(category.description_en, category.description_ne)}
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {category.thread_count} {getText('threads', 'थ्रेडहरू')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {category.post_count} {getText('posts', 'पोस्टहरू')}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
