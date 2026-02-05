-- Forum Categories Table
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ne TEXT NOT NULL,
  description_en TEXT,
  description_ne TEXT,
  icon TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Forum Threads Table
CREATE TABLE IF NOT EXISTS forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ne TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  pinned BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE
);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  is_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_forum_posts_thread FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE
);

-- Forum Post Likes Table
CREATE TABLE IF NOT EXISTS forum_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_user ON forum_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_likes_user ON forum_post_likes(user_id);

-- Insert Sample Categories
INSERT INTO forum_categories (name_en, name_ne, description_en, description_ne, icon, order_index) 
VALUES
('General Discussion', 'सामान्य छलफल', 'General discussions and announcements', 'सामान्य छलफल र घोषणाहरू', '💬', 1),
('Career Guidance', 'करियर मार्गदर्शन', 'Career guidance and opportunities', 'करियर मार्गदर्शन र अवसरहरू', '💼', 2),
('Study Resources', 'अध्ययन स्रोतहरू', 'Share and discuss study resources', 'अध्ययन स्रोतहरू साझा गरें र छलफल गरें', '📚', 3),
('Exam Preparation', 'परीक्षा तयारी', 'SEE and other exam preparation', 'SEE र अन्य परीक्षा तयारी', '📝', 4),
('Doubt Resolution', 'संदेह समाधान', 'Ask and resolve academic doubts', 'शैक्षिक संदेह सोध्नुहोस् र समाधान गरें', '❓', 5),
('Success Stories', 'सफलता कथाहरू', 'Share your success stories', 'आपनो सफलता कथाहरू साझा गर्नुहोस्', '⭐', 6)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_post_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories (Public Read)
CREATE POLICY "Categories are publicly readable"
  ON forum_categories FOR SELECT
  USING (TRUE);

-- RLS Policies for Threads
CREATE POLICY "Threads are publicly readable"
  ON forum_threads FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create threads"
  ON forum_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads"
  ON forum_threads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own threads"
  ON forum_threads FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Posts
CREATE POLICY "Posts are publicly readable"
  ON forum_posts FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create posts"
  ON forum_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Likes
CREATE POLICY "Likes are publicly readable"
  ON forum_post_likes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can like posts"
  ON forum_post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON forum_post_likes FOR DELETE
  USING (auth.uid() = user_id);
