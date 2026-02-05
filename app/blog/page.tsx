'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Search, Loader } from 'lucide-react';
import Link from 'next/link';

interface BlogArticle {
  id: string;
  title_en: string;
  title_ne: string;
  excerpt_en: string;
  excerpt_ne: string;
  thumbnail_url: string;
  category: string;
  author_name: string;
  reading_time: number;
  created_at: string;
  slug: string;
}

export default function BlogPage() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (data) {
          setArticles(data);
          const uniqueCategories = [...new Set(data.map((a) => a.category))];
          setCategories(uniqueCategories as string[]);
          setFilteredArticles(data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [supabase]);

  useEffect(() => {
    let filtered = articles;

    if (selectedCategory) {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          getText(a.title_en, a.title_ne).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getText(a.excerpt_en, a.excerpt_ne).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchTerm, articles, language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {getText('EduWarn Blog', 'एडुवर्न ब्लग')}
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              {getText(
                'Latest insights, tips, and resources for your academic journey',
                'तपाईंको शैक्षिक यात्राका लागि नवीनतम अन्तरदृष्टि, सुझाव र संसाधनहरू'
              )}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={getText('Search articles...', 'लेखहरू खोज्नुहोस्...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getText('All', 'सबै')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {getText('No articles found', 'कुनै लेख भेटिएन')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="flex flex-col h-full hover:shadow-xl transition-all group overflow-hidden border-gray-200">
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
                    {article.thumbnail_url && (
                      <img
                        src={article.thumbnail_url || "/placeholder.svg"}
                        alt={getText(article.title_en, article.title_ne)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-600 hover:bg-red-700">{article.category}</Badge>
                    </div>
                  </div>

                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(article.created_at)}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.reading_time} {getText('min', 'मिनेट')}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-red-600 transition-colors mb-3">
                      {getText(article.title_en, article.title_ne)}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {getText(article.excerpt_en, article.excerpt_ne)}
                    </p>
                  </CardHeader>

                  <CardFooter className="p-6 pt-0 mt-auto">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-gray-700">{article.author_name}</span>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-red-600 text-sm font-semibold flex items-center gap-1 group/btn hover:gap-2 transition-all"
                      >
                        {getText('Read', 'पढ्नुहोस्')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
