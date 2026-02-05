'use client';

import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { MessageCircle, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Thread {
  id: string;
  title: string;
  excerpt: string;
  user_id: string;
  user: { full_name: string; avatar_url?: string };
  post_count: number;
  created_at: string;
  updated_at: string;
}

export function ForumThreads({ categoryId }: { categoryId: string }) {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { data } = await supabase
          .from('forum_threads')
          .select(
            `
            id,
            title,
            excerpt,
            user_id,
            post_count,
            created_at,
            updated_at,
            user:profiles(full_name, avatar_url)
          `
          )
          .eq('category_id', categoryId)
          .order('updated_at', { ascending: false });

        if (data) setThreads(data);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [categoryId, supabase]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading threads...</div>;
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{getText('No threads yet. Be the first to start a discussion!', 'अहिले कुनै थ्रेड छैन। पहिलो छलफल सुरु गर्नुहोस्!')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <Link key={thread.id} href={`/forum/thread/${thread.id}`}>
          <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors mb-2">
                  {thread.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">{thread.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {thread.user?.full_name || 'Anonymous'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(thread.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-semibold text-gray-900">{thread.post_count}</div>
                <div className="text-xs text-gray-500">{getText('replies', 'जवाफहरू')}</div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
