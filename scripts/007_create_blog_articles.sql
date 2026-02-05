-- Create blog articles table (same structure as courses/modules/lessons for consistency)
CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ne TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt_en TEXT,
  excerpt_ne TEXT,
  content_en TEXT,
  content_ne TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT,
  reading_time INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create blog comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.blog_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  comment_text TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Create blog article tags junction table
CREATE TABLE IF NOT EXISTS public.blog_article_tags (
  article_id UUID NOT NULL REFERENCES public.blog_articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Create indexes for performance
CREATE INDEX idx_blog_articles_category ON public.blog_articles(category);
CREATE INDEX idx_blog_articles_status ON public.blog_articles(status);
CREATE INDEX idx_blog_articles_featured ON public.blog_articles(featured);
CREATE INDEX idx_blog_articles_created_at ON public.blog_articles(created_at DESC);
CREATE INDEX idx_blog_comments_article_id ON public.blog_comments(article_id);
CREATE INDEX idx_blog_article_tags_article_id ON public.blog_article_tags(article_id);
CREATE INDEX idx_blog_article_tags_tag_id ON public.blog_article_tags(tag_id);

-- Enable RLS
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_article_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles (published visible to all)
CREATE POLICY "Published articles are viewable by everyone" ON public.blog_articles 
  FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view their own drafts" ON public.blog_articles 
  FOR SELECT USING (author_id = auth.uid() AND status = 'draft');
CREATE POLICY "Authors can insert articles" ON public.blog_articles 
  FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update own articles" ON public.blog_articles 
  FOR UPDATE USING (author_id = auth.uid());

-- RLS Policies for comments
CREATE POLICY "Approved comments are viewable by everyone" ON public.blog_comments 
  FOR SELECT USING (approved = TRUE);
CREATE POLICY "Users can view own comments" ON public.blog_comments 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Authenticated users can insert comments" ON public.blog_comments 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone" ON public.blog_tags FOR SELECT USING (true);

-- RLS Policies for article tags
CREATE POLICY "Article tags are viewable by everyone" ON public.blog_article_tags FOR SELECT USING (true);
