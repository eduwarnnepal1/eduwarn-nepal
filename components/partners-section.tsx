'use client';

import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { createBrowserClient } from '@supabase/ssr';
import { Loader } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
}

export function PartnersSection() {
  const context = useContext(LanguageContext);
  const language = context?.language || 'en';

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .eq('status', 'active')
          .limit(12);

        if (data) setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {getText('Our Partners', 'हाम्रा साझेदारहरू')}
          </h2>
          <p className="text-gray-600 text-lg">
            {getText(
              'Trusted by leading organizations and institutions across Nepal',
              'नेपालभर अग्रणी संगठन र संस्थाहरू द्वारा विश्वस्त'
            )}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all flex flex-col items-center justify-center min-h-32"
            >
              {partner.logo_url && (
                <a
                  href={partner.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={partner.logo_url || "/placeholder.svg"}
                    alt={partner.name}
                    className="max-h-24 max-w-full object-contain hover:scale-110 transition-transform"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
