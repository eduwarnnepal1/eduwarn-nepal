'use client';

import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Plus, Loader } from 'lucide-react';
import { useState as useStateDialog } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: 'student' | 'parent';
  content: string;
  rating: number;
  image_url?: string;
}

export function TestimonialsSection() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(10);

        if (data) setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [supabase]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSubmitTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        alert(getText('Please log in to submit a testimonial', 'प्रशंसापत्र जमा गर्न कृपया लगइन गर्नुहोस्'));
        return;
      }

      const { error } = await supabase.from('testimonials').insert({
        user_id: session.session.user.id,
        name: formData.get('name'),
        role: formData.get('role'),
        content: formData.get('content'),
        rating: parseInt(formData.get('rating') as string) || 5,
        status: 'pending',
      });

      if (error) throw error;

      alert(getText('Thank you! Your testimonial has been submitted for review', 'धन्यवाद! तपाईंको प्रशंसापत्र समीक्षाको लागि जमा गरिएको छ'));
      setIsAddingTestimonial(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert(getText('Error submitting testimonial', 'प्रशंसापत्र जमा गर्न त्रुटि'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{getText('No testimonials yet', 'अझै कुनै प्रशंसापत्र छैन')}</p>
      </div>
    );
  }

  const testimonial = testimonials[currentIndex];

  return (
    <div className="w-full">
      {/* Main Testimonial Display */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-red-50 border-2 border-gray-200">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Avatar */}
          {testimonial.image_url && (
            <div className="flex-shrink-0">
              <img
                src={testimonial.image_url || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-red-600"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-lg text-gray-800 mb-4 italic">"{testimonial.content}"</p>

            {/* Author Info */}
            <div>
              <p className="font-bold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">
                {getText(
                  testimonial.role === 'student' ? 'Student' : 'Parent',
                  testimonial.role === 'student' ? 'विद्यार्थी' : 'अभिभावक'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-red-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </Card>

      {/* Add Testimonial CTA */}
      <div className="mt-8 text-center">
        {isAddingTestimonial ? (
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-6">
              {getText('Share Your Experience', 'आपनो अनुभव साझा गर्नुहोस्')}
            </h3>
            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {getText('Your Name', 'तपाईंको नाम')}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {getText('I am a', 'म एक हूँ')}
                </label>
                <select
                  name="role"
                  defaultValue="student"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="student">{getText('Student', 'विद्यार्थी')}</option>
                  <option value="parent">{getText('Parent', 'अभिभावक')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {getText('Rating', 'दर')}
                </label>
                <select
                  name="rating"
                  defaultValue="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>
                      {val} {getText('Stars', 'तारकाहरू')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {getText('Your Testimonial', 'तपाईंको प्रशंसापत्र')}
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder={getText('Share your experience with EduWarn...', 'EduWarn सँग आपनो अनुभव साझा गर्नुहोस्...')}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6">
                  {getText('Submit', 'जमा गर्नुहोस्')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingTestimonial(false)}
                  className="px-6"
                >
                  {getText('Cancel', 'रद्द गर्नुहोस्')}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button
            onClick={() => setIsAddingTestimonial(true)}
            className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            {getText('Share Your Story', 'आपनो कहानी साझा गर्नुहोस्')}
          </Button>
        )}
      </div>
    </div>
  );
}
