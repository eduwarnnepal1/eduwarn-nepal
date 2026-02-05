'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, Zap, Globe, Heart, TrendingUp } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const translations = {
  en: {
    title: 'Partner With Us',
    subtitle: 'Join EduWarn Nepal in transforming education across Nepal',
    description: 'We believe in the power of collaboration. By partnering with us, you can help shape the future of education in Nepal while expanding your organization\'s reach and impact.',
    benefits: 'Partnership Benefits',
    whyPartner: 'Why Partner With EduWarn Nepal?',
    partnerTypes: 'Types of Partnerships',
    getStarted: 'Get Started',
    fullName: 'Full Name',
    email: 'Email Address',
    organization: 'Organization Name',
    partnershipType: 'Partnership Type (Educational Institution, Corporate, NGO, Other)',
    message: 'Message',
    submit: 'Submit Partnership Inquiry',
    submitted: 'Thank you! We\'ll contact you soon.',
    expandReach: 'Expand Your Reach',
    expandReachDesc: 'Access thousands of students and educators across Nepal',
    shareExpertise: 'Share Your Expertise',
    shareExpertiseDesc: 'Contribute your knowledge and resources to benefit learners',
    buildBrand: 'Build Your Brand',
    buildBrandDesc: 'Increase visibility and recognition in the education sector',
    communityImpact: 'Create Community Impact',
    communityImpactDesc: 'Make a meaningful difference in Nepali education',
    institutional: 'Institutional Partnerships',
    institutionalDesc: 'Universities, schools, and training centers collaborating to enhance curriculum and course offerings',
    corporate: 'Corporate Partnerships',
    corporateDesc: 'Companies providing resources, expertise, or internship opportunities for students',
    ngo: 'NGO Partnerships',
    ngoDesc: 'Non-profits working together to promote educational access and quality',
    affiliate: 'Affiliate Program',
    affiliateDesc: 'Earn by promoting EduWarn Nepal courses and resources to your network',
    contactSales: 'Contact Sales Team',
    contactSalesDesc: 'Discuss custom partnership arrangements tailored to your needs',
  },
  ne: {
    title: 'हामीसँग साझेदारी गर्नुहोस्',
    subtitle: 'EduWarn नेपाल सँग नेपालमा शिक्षा परिवर्तनमा संलग्न हुनुहोस्',
    description: 'हामी सहयोगिताको शक्तिमा विश्वास गर्छौं। हामीसँग साझेदारी गरेर, तपाई नेपालको शिक्षाको भविष्य आकार दिन र आफ्नो संस्थाको पहुँच र प्रभाव बढाउन मदद गर्न सक्नुहुन्छ।',
    benefits: 'साझेदारी लाभ',
    whyPartner: 'EduWarn नेपाल सँग किन साझेदारी गर्नुहोस्?',
    partnerTypes: 'साझेदारी को प्रकार',
    getStarted: 'शुरु गर्नुहोस्',
    fullName: 'पूरा नाम',
    email: 'ईमेल ठेगाना',
    organization: 'संस्था को नाम',
    partnershipType: 'साझेदारी को प्रकार (शैक्षणिक संस्था, कर्पोरेट, NGO, अन्य)',
    message: 'संदेश',
    submit: 'साझेदारी अनुरोध जमा गर्नुहोस्',
    submitted: 'धन्यवाद! हामी तपाईंलाई शीघ्रै सम्पर्क गर्नेछौं।',
    expandReach: 'आफ्नो पहुँच विस्तार गर्नुहोस्',
    expandReachDesc: 'नेपाल भरका हजारौं विद्यार्थी र शिक्षकहरूमा पहुँच गर्नुहोस्',
    shareExpertise: 'आफ्नो विशेषज्ञता साझा गर्नुहोस्',
    shareExpertiseDesc: 'सीखनेवालाहरूको लाभको लागि आफ्नो ज्ञान र संसाधनहरूमा योगदान गर्नुहोस्',
    buildBrand: 'आफ्नो ब्र्यान्ड बनाउनुहोस्',
    buildBrandDesc: 'शिक्षा क्षेत्रमा दृश्यमानता र स्वीकृति बढाउनुहोस्',
    communityImpact: 'सामुदायिक प्रभाव सृष्टि गर्नुहोस्',
    communityImpactDesc: 'नेपाली शिक्षामा অর্থপূর्ण फरक ल्याउनुहोस्',
    institutional: 'संस्थागत साझेदारी',
    institutionalDesc: 'विश्वविद्यालयहरू, स्कूलहरू, र प्रशिक्षण केन्द्रहरू पाठ्यक्रम र पाठ्यक्रम अफर सुधार गर्न सहयोग गरिरहेका छन्',
    corporate: 'कर्पोरेट साझेदारी',
    corporateDesc: 'कम्पनीहरूले संसाधन, विशेषज्ञता, वा विद्यार्थीहरूको लागि इन्टर्नशिप अवसरहरू प्रदान गर्दछन्',
    ngo: 'NGO साझेदारी',
    ngoDesc: 'गैर-लाभकारी संस्थाहरू शैक्षणिक पहुँच र गुणस्तर प्रवर्द्धन गर्न सहमति गरिरहेका छन्',
    affiliate: 'संबद्ध कार्यक्रम',
    affiliateDesc: 'आफ्नो नेटवर्कमा EduWarn नेपाल पाठ्यक्रम र संसाधनहरू प्रचार गरेर कमाउनुहोस्',
    contactSales: 'बिक्रय टीमलाई सम्पर्क गर्नुहोस्',
    contactSalesDesc: 'आफ्नो आवश्यकतामा अनुरूप कस्टम साझेदारी व्यवस्था छलफल गर्नुहोस्',
  },
};

export default function PartnerWithUsPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    partnershipType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: session } = await supabase.auth.getSession();

      const { error: submitError } = await supabase
        .from('partnership_applications')
        .insert({
          user_id: session?.user?.id || null,
          company_name: formData.organization,
          contact_email: formData.email,
          partnership_type: formData.partnershipType,
          proposal: formData.message,
          status: 'pending',
        });

      if (submitError) throw submitError;

      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        organization: '',
        partnershipType: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Globe,
      title: t.expandReach,
      description: t.expandReachDesc,
    },
    {
      icon: Zap,
      title: t.shareExpertise,
      description: t.shareExpertiseDesc,
    },
    {
      icon: Heart,
      title: t.buildBrand,
      description: t.buildBrandDesc,
    },
    {
      icon: TrendingUp,
      title: t.communityImpact,
      description: t.communityImpactDesc,
    },
  ];

  const partnerTypes = [
    {
      title: t.institutional,
      description: t.institutionalDesc,
    },
    {
      title: t.corporate,
      description: t.corporateDesc,
    },
    {
      title: t.ngo,
      description: t.ngoDesc,
    },
    {
      title: t.affiliate,
      description: t.affiliateDesc,
    },
    {
      title: t.contactSales,
      description: t.contactSalesDesc,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">{t.title}</h1>
          <p className="text-xl sm:text-2xl mb-8 text-red-50">{t.subtitle}</p>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">{t.description}</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">{t.benefits}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-8 border-2 border-blue-200 hover:border-red-600 transition-colors">
                <Icon className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t.partnerTypes}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((type, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-bold">{type.title}</h3>
                </div>
                <p className="text-gray-600 ml-9">{type.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{t.getStarted}</h2>
        <Card className="p-8 border-2 border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t.fullName}</label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.email}</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.organization}</label>
              <Input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.partnershipType}</label>
              <select
                name="partnershipType"
                value={formData.partnershipType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
              >
                <option value="">Select a type</option>
                <option value="institutional">Educational Institution</option>
                <option value="corporate">Corporate</option>
                <option value="ngo">NGO</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  {t.submit}
                </>
              ) : (
                t.submit
              )}
            </Button>
            {submitted && (
              <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center animate-fadeIn">
                ✓ {t.submitted}
              </div>
            )}
          </form>
        </Card>
      </section>
    </div>
  );
}
