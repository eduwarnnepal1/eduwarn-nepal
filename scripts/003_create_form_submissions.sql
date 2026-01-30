-- Create Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Partner Inquiry Submissions Table
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  partnership_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Mentor Applications Table
CREATE TABLE IF NOT EXISTS public.mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  expertise TEXT NOT NULL,
  experience TEXT NOT NULL,
  bio TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Donation Records Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Contact submissions - anyone can insert, only admins can read/update
CREATE POLICY "contact_submissions_insert" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_read" ON public.contact_submissions
  FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM public.profiles WHERE role = 'admin'
  ));

-- Partner inquiries - anyone can insert, only admins can read/update
CREATE POLICY "partner_inquiries_insert" ON public.partner_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "partner_inquiries_admin_read" ON public.partner_inquiries
  FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM public.profiles WHERE role = 'admin'
  ));

-- Mentor applications - anyone can insert, only admins can read/update
CREATE POLICY "mentor_applications_insert" ON public.mentor_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "mentor_applications_admin_read" ON public.mentor_applications
  FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM public.profiles WHERE role = 'admin'
  ));

-- Donations - anyone can insert, only admins can read
CREATE POLICY "donations_insert" ON public.donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "donations_admin_read" ON public.donations
  FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM public.profiles WHERE role = 'admin'
  ));

-- Newsletter subscriptions - anyone can insert/update
CREATE POLICY "newsletter_subscriptions_insert" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_subscriptions_upsert" ON public.newsletter_subscriptions
  FOR UPDATE USING (true);

COMMIT;
