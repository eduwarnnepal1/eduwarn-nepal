# EduWarn Nepal - Admin Setup & Configuration Guide

## Prerequisites
- Access to Supabase dashboard
- Your EduWarn project URL and API keys already configured
- Admin account with database access

## Step-by-Step Setup

### 1. Database Tables Verification ✅
The following tables have been automatically created via migration script 008:

```
✓ testimonials - User-submitted testimonials (pending approval workflow)
✓ partners - Partner organization logos and details
✓ quotes - Rotating motivational quotes
✓ learning_events - Upcoming learning events
✓ why_eduwarn - Core value propositions
✓ partnership_applications - Partnership inquiries
✓ volunteer_applications - Mentor/volunteer applications
```

**Action**: Log into Supabase and verify all tables exist in your database.

---

### 2. Configure Partner Logos & Details

**Location**: Supabase → `partners` table

**Add Your Partners**:
```
Table Structure:
- id (UUID, auto)
- name_en (Text) - Partner name in English
- name_ne (Text) - Partner name in Nepali
- logo_url (Text) - URL to partner logo image
- website_url (Text) - Partner website URL
- description_en (Text) - Brief description in English
- description_ne (Text) - Brief description in Nepali
- is_active (Boolean) - Toggle to show/hide on homepage
- order_index (Integer) - Display order (1, 2, 3...)
- created_at (Timestamp, auto)
```

**Example Entry**:
```json
{
  "name_en": "Tech Institute Nepal",
  "name_ne": "टेक संस्थान नेपाल",
  "logo_url": "https://example.com/logo.png",
  "website_url": "https://tech-institute-nepal.edu.np",
  "description_en": "Leading technology education provider",
  "description_ne": "प्रमुख प्रविधि शिक्षा प्रदायक",
  "is_active": true,
  "order_index": 1
}
```

---

### 3. Add Inspirational Quotes

**Location**: Supabase → `quotes` table

**Table Structure**:
```
- id (UUID, auto)
- content_en (Text) - Quote in English
- content_ne (Text) - Quote in Nepali
- author_en (Text, nullable) - Author name in English
- author_ne (Text, nullable) - Author name in Nepali
- is_active (Boolean) - Toggle active/inactive
- created_at (Timestamp, auto)
```

**Example Entry**:
```json
{
  "content_en": "Education is the most powerful weapon which you can use to change the world.",
  "content_ne": "शिक्षा विश्वलाई परिवर्तन गर्न सक्ने सबैभन्दा शक्तिशाली हतियार हो।",
  "author_en": "Nelson Mandela",
  "author_ne": "नेल्सन म्यान्डेला",
  "is_active": true
}
```

**Tips**:
- Add 5-10 quotes for rotation
- They rotate every 8 seconds on homepage
- Disable quotes with `is_active: false` without deleting

---

### 4. Configure Learning Events

**Location**: Supabase → `learning_events` table

**Table Structure**:
```
- id (UUID, auto)
- title_en (Text) - Event title in English
- title_ne (Text) - Event title in Nepali
- description_en (Text, nullable) - Detailed description in English
- description_ne (Text, nullable) - Detailed description in Nepali
- image_url (Text, nullable) - Event banner/poster image
- event_date (Date, nullable) - Event date
- is_active (Boolean) - Show/hide on carousel
- created_at (Timestamp, auto)
```

**Example Entry**:
```json
{
  "title_en": "Live SEE Preparation Webinar",
  "title_ne": "लाइभ SEE तयारी वेबिनार",
  "description_en": "Free webinar covering key SEE exam topics with expert mentors",
  "description_ne": "विशेषज्ञ सलाहदाताहरूसँग मुख्य SEE परीक्षा विषयहरू समेट्ने मुक्त वेबिनार",
  "image_url": "https://example.com/webinar-banner.jpg",
  "event_date": "2026-02-15",
  "is_active": true
}
```

**Tips**:
- Events display in rotating carousel on homepage
- Auto-rotates every 6 seconds
- Add high-quality banner images (1200x600px recommended)

---

### 5. Setup "Why EduWarn" Values

**Location**: Supabase → `why_eduwarn` table

**Table Structure**:
```
- id (UUID, auto)
- title_en (Text) - Value title in English
- title_ne (Text) - Value title in Nepali
- description_en (Text) - Description in English
- description_ne (Text) - Description in Nepali
- icon_name (Text) - Lucide icon name (e.g., "BookOpen", "Users", "Trophy")
- is_active (Boolean) - Show/hide on homepage
- order_index (Integer) - Display order
- created_at (Timestamp, auto)
```

**Example Entry**:
```json
{
  "title_en": "Expert Mentors",
  "title_ne": "विशेषज्ञ सलाहदाताहरू",
  "description_en": "Learn from experienced educators and industry professionals dedicated to your success.",
  "description_ne": "तपाईंको सफलताको लागि समर्पित अनुभवी शिक्षकहरू र उद्योग पेशेवरहरूबाट सिक्नुहोस्।",
  "icon_name": "Users",
  "is_active": true,
  "order_index": 1
}
```

**Available Icons** (from Lucide):
- BookOpen, Users, Trophy, Zap, Target, Lightbulb, Award, Heart, TrendingUp, CheckCircle, Star, Sparkles, Rocket, etc.

---

### 6. Manage User Testimonials

**Location**: Supabase → `testimonials` table

**Workflow**:
1. Users submit testimonials via "Share Your Story" button on homepage
2. Testimonials appear with `status: 'pending'`
3. Admin reviews and sets `status: 'approved'` or `status: 'rejected'`
4. Only approved testimonials display on homepage

**Table Structure**:
```
- id (UUID, auto)
- user_id (UUID) - User who submitted
- name (Text) - Testimonial author name
- role (Text) - 'student' or 'parent'
- content (Text) - Testimonial text
- rating (Integer) - 1-5 star rating
- image_url (Text, nullable) - User avatar/photo
- status (Text) - 'pending' | 'approved' | 'rejected'
- created_at (Timestamp, auto)
```

**Admin Actions**:
```sql
-- Approve a testimonial
UPDATE testimonials 
SET status = 'approved' 
WHERE id = 'testimonial-uuid';

-- Reject a testimonial
UPDATE testimonials 
SET status = 'rejected' 
WHERE id = 'testimonial-uuid';

-- View pending testimonials
SELECT * FROM testimonials WHERE status = 'pending' ORDER BY created_at DESC;
```

---

### 7. Review Partnership Applications

**Location**: Supabase → `partnership_applications` table

**Table Structure**:
```
- id (UUID, auto)
- user_id (UUID, nullable) - Applicant user
- company_name (Text) - Company/organization name
- contact_email (Text) - Contact email
- partnership_type (Text) - Type of partnership
- proposal (Text) - Detailed proposal
- status (Text) - 'pending' | 'approved' | 'rejected'
- created_at (Timestamp, auto)
```

**Admin Actions**:
```sql
-- View all pending applications
SELECT * FROM partnership_applications 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Approve application
UPDATE partnership_applications 
SET status = 'approved' 
WHERE id = 'app-uuid';

-- Reject application
UPDATE partnership_applications 
SET status = 'rejected' 
WHERE id = 'app-uuid';
```

---

### 8. Review Mentor/Volunteer Applications

**Location**: Supabase → `volunteer_applications` table

**Table Structure**:
```
- id (UUID, auto)
- user_id (UUID, nullable) - Applicant user
- full_name (Text) - Applicant name
- email (Text) - Contact email
- phone (Text) - Contact phone
- expertise_areas (JSON Array) - Areas of expertise
- experience_years (Integer) - Years of experience
- motivation (Text) - Why they want to volunteer
- status (Text) - 'pending' | 'approved' | 'rejected'
- created_at (Timestamp, auto)
```

**Admin Actions**:
```sql
-- View pending mentor applications
SELECT * FROM volunteer_applications 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Approve mentor
UPDATE volunteer_applications 
SET status = 'approved' 
WHERE id = 'app-uuid';

-- Reject mentor
UPDATE volunteer_applications 
SET status = 'rejected' 
WHERE id = 'app-uuid';
```

---

### 9. Homepage Configuration Options

**YouTube Channel**:
- Location: `/components/youtube-preview.tsx`
- Current: @EduWarnNepal
- To update: Edit the YouTube channel URL in the Button component (line 46)

**Blog Integration**:
- Blog articles are managed in `blog_articles` table (created via script 007)
- Add blog content through Supabase dashboard
- Blog page (`/app/blog/page.tsx`) automatically displays published articles

**Learning Events Carousel**:
- Configured in `/app/page.tsx`
- Auto-rotates every 6 seconds
- Height: 384px (h-96)

**Rotating Quotes**:
- Duration: 8 seconds per quote
- Automatically cycles through all active quotes
- Disable quotes by setting `is_active: false`

---

## Quick Admin Tasks Checklist

### Weekly Tasks:
- [ ] Review pending testimonials → Approve/Reject
- [ ] Review new partnership applications
- [ ] Review new mentor applications
- [ ] Update learning events (add new/archive old)

### Monthly Tasks:
- [ ] Update "Why EduWarn" section if needed
- [ ] Add new inspirational quotes
- [ ] Review and refresh partner logos if any partnerships changed
- [ ] Analyze testimonial feedback for improvements
- [ ] Monitor blog article engagement

### As Needed:
- [ ] Add/remove partners from partners table
- [ ] Update partner logos and descriptions
- [ ] Toggle events, quotes, and why_eduwarn items active/inactive
- [ ] Update YouTube videos display (manual in component)

---

## Troubleshooting

### Testimonials Not Appearing
**Solution**: Check that:
1. Testimonials have `status: 'approved'`
2. User has authenticated when submitting
3. RLS policies allow public read access

### Quotes Not Rotating
**Solution**: Check that:
1. At least 2 quotes have `is_active: true`
2. Quotes table has data
3. Browser console for errors (F12 → Console)

### Events Carousel Empty
**Solution**: Check that:
1. `learning_events` table has entries with `is_active: true`
2. Image URLs are valid and accessible
3. Event dates might be in the past (still displays)

### Forms Not Submitting
**Solution**: Check that:
1. User is authenticated (logged in)
2. Supabase environment variables are set
3. RLS policies allow insert on partnership_applications and volunteer_applications
4. Browser console for specific error messages

---

## Security Notes

- All user submission tables have RLS policies enabled
- Users can only read/edit their own submissions (pending)
- Admins can view and manage all submissions
- All data is encrypted at rest in Supabase
- Row Level Security prevents unauthorized access

---

## Performance Optimization Tips

1. **Image Optimization**:
   - Keep image file sizes under 500KB
   - Use WebP format where possible
   - Provide appropriate dimensions (logos: 200x100px, banners: 1200x600px)

2. **Database**:
   - Regular backups enabled
   - Indexes created on frequently queried fields
   - RLS policies minimize unnecessary queries

3. **Content**:
   - Keep quotes concise (under 150 characters)
   - Event descriptions under 200 characters
   - Title under 60 characters for better display

---

## Support

For issues or questions:
1. Check Supabase logs (Logs → Recent)
2. Review browser console errors (F12)
3. Test RLS policies in Supabase editor
4. Verify all required fields have data

---

## Seed Data

The migration script (008) includes sample seed data:
- 3 sample testimonials
- 5 sample quotes
- 2 sample learning events
- 3 sample why_eduwarn items
- 2 sample partners

**Action**: You can keep these as examples or delete them after reviewing the table structure.
