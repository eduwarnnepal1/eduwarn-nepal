-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- 'parent' or 'student'
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_user_id ON testimonials(user_id);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  category VARCHAR(100), -- 'educational', 'corporate', 'technology', etc.
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quotes table (for rotating quotes on homepage)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_en TEXT NOT NULL,
  content_ne TEXT NOT NULL,
  author_en VARCHAR(255),
  author_ne VARCHAR(255),
  category VARCHAR(100), -- 'motivation', 'education', 'success', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create learning events table (for carousel)
CREATE TABLE IF NOT EXISTS learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en VARCHAR(255) NOT NULL,
  title_ne VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_ne TEXT,
  image_url TEXT,
  event_date DATE,
  event_type VARCHAR(100), -- 'webinar', 'workshop', 'exam', 'competition', etc.
  registration_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create why_eduwarn table (for Why EduWarn is Best section)
CREATE TABLE IF NOT EXISTS why_eduwarn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en VARCHAR(255) NOT NULL,
  title_ne VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_ne TEXT NOT NULL,
  icon_name VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create partnership applications table
CREATE TABLE IF NOT EXISTS partnership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  company_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  partnership_type VARCHAR(100) NOT NULL,
  company_description TEXT,
  proposal TEXT,
  attachment_url TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partnership_applications_status ON partnership_applications(status);

-- Create volunteer/mentor applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  qualification VARCHAR(255),
  expertise_areas TEXT[],
  experience_years INTEGER,
  availability TEXT,
  motivation TEXT,
  cv_url TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_volunteer_applications_status ON volunteer_applications(status);

-- Enable RLS on all tables
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_eduwarn ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view approved testimonials"
ON testimonials FOR SELECT
USING (status = 'approved');

CREATE POLICY "Users can view their own testimonials"
ON testimonials FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create testimonials"
ON testimonials FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for partners (public read)
CREATE POLICY "Anyone can view active partners"
ON partners FOR SELECT
USING (status = 'active');

-- RLS Policies for quotes (public read)
CREATE POLICY "Anyone can view active quotes"
ON quotes FOR SELECT
USING (is_active = TRUE);

-- RLS Policies for learning_events (public read)
CREATE POLICY "Anyone can view active learning events"
ON learning_events FOR SELECT
USING (is_active = TRUE);

-- RLS Policies for why_eduwarn (public read)
CREATE POLICY "Anyone can view active why_eduwarn content"
ON why_eduwarn FOR SELECT
USING (is_active = TRUE);

-- RLS Policies for partnership_applications
CREATE POLICY "Users can view their own applications"
ON partnership_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create partnership applications"
ON partnership_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for volunteer_applications
CREATE POLICY "Users can view their own applications"
ON volunteer_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create volunteer applications"
ON volunteer_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Seed default why_eduwarn data
INSERT INTO why_eduwarn (title_en, title_ne, description_en, description_ne, icon_name, order_index) VALUES
('Expert Instructors', 'विशेषज्ञ प्रशिक्षकहरू', 'Learn from experienced educators and industry professionals with years of teaching experience', 'वर्षौंको शिक्षण अनुभव सहित अनुभवी शिक्षकहरू र उद्योग पेशेवरहरूबाट सिक्नुहोस्', 'Users', 0),
('Interactive Learning', 'इन्टरएक्टिभ शिक्षण', 'Engage with interactive lessons, quizzes, and real-world projects to enhance understanding', 'इन्टरएक्टिभ पाठ, क्विज, र वास्तविक-विश्व परियोजनाहरूसँग संलग्न हुनुहोस्', 'Zap', 1),
('Affordable Education', 'सस्तो शिक्षा', 'High-quality education at affordable prices, making quality learning accessible to everyone', 'सबैको लागि गुणस्तरीय शिक्षा पहुँचयोग्य बनाउँदै, किफायती मूल्यमा उच्च-गुणस्तरीय शिक्षा', 'DollarSign', 2),
('Flexible Schedule', 'लचकदार समय सारणी', 'Learn at your own pace with flexible scheduling that fits your lifestyle and commitments', 'आपनो जीवनधारा र प्रतिबद्धताहरूसँग फिट हुने लचकदार समय निर्धारणको साथ आपनो गतिमा सिक्नुहोस्', 'Clock', 3),
('Verified Certificates', 'सत्यापित प्रमाणपत्र', 'Earn recognized certificates upon course completion that enhance your professional profile', 'आपनो पेशेवर प्रोफाइल बढाउने पाठ्यक्रम पूर्णताको लागत सत्यापित प्रमाणपत्र अर्जन गर्नुहोस्', 'Award', 4),
('24/7 Support', '24/7 समर्थन', 'Round-the-clock customer support to help you whenever you need assistance', 'जब पनि सहायता चाहिन्छ त्यसबेला तपाईंलाई मद्दत गर्न 24/7 ग्राहक समर्थन', 'Headphones', 5);
