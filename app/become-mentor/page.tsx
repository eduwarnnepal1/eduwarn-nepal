'use client';

import React from "react"

import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Users, Award, BookOpen, Heart, Lightbulb, TrendingUp } from 'lucide-react';

const translations = {
  en: {
    title: 'Become a Mentor',
    subtitle: 'Guide the next generation of learners and make a lasting impact',
    description: 'Join our community of experienced mentors helping students navigate their educational journey. Share your expertise, inspire others, and help shape Nepal\'s future.',
    whyBecomeMentor: 'Why Become a Mentor?',
    mentorBenefits: 'Mentor Benefits',
    requirements: 'Mentor Requirements',
    applicationProcess: 'Application Process',
    applyNow: 'Apply to Become a Mentor',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    expertise: 'Area of Expertise',
    experience: 'Years of Experience',
    bio: 'Tell us about yourself',
    submit: 'Submit Application',
    submitted: 'Thank you! We\'ll review your application soon.',
    
    shareKnowledge: 'Share Your Knowledge',
    shareKnowledgeDesc: 'Help students overcome challenges and achieve their goals',
    buildNetwork: 'Build Your Network',
    buildNetworkDesc: 'Connect with like-minded educators and professionals',
    earnRecognition: 'Earn Recognition',
    earnRecognitionDesc: 'Become a recognized expert in your field within our community',
    makeDifference: 'Make a Difference',
    makeDifferenceDesc: 'Help bridge the education gap and empower underprivileged students',
    
    subject: 'Subject',
    minimumQualification: 'Minimum Qualification (Bachelor\'s Degree or higher)',
    oneYear: '1+ year of experience in your field',
    passion: 'Passion for teaching and mentoring',
    english: 'Fluency in English or Nepali',
    commitment: 'Commitment to spending 5+ hours per week',
    
    step1: 'Submit Application',
    step1Desc: 'Fill out the form with your qualifications and experience',
    step2: 'Verification',
    step2Desc: 'Our team will review and verify your credentials',
    step3: 'Interview',
    step3Desc: 'Participate in a brief interview to discuss your mentoring goals',
    step4: 'Training',
    step4Desc: 'Complete mentor training and onboarding',
    step5: 'Start Mentoring',
    step5Desc: 'Begin mentoring students in your area of expertise',
  },
  ne: {
    title: 'एक मेन्टर बन्नुहोस्',
    subtitle: 'अगली पीढीको शिक्षार्थीहरूलाई मार्गदर्शन गर्नुहोस् र स्थायी प्रभाव छोड्नुहोस्',
    description: 'विद्यार्थीहरूलाई आफ्नो शैक्षणिक यात्रामा मार्गदर्शन गर्न अनुभवी मेन्टरहरूको हाम्रो समुदायमा संलग्न हुनुहोस्। आफ्नो विशेषज्ञता साझा गर्नुहोस्, अन्यहरूलाई प्रेरणा दिनुहोस्, र नेपालको भविष्य आकार दिन मदद गर्नुहोस्।',
    whyBecomeMentor: 'एक मेन्टर किन बन्नु?',
    mentorBenefits: 'मेन्टर लाभ',
    requirements: 'मेन्टर आवश्यकताहरू',
    applicationProcess: 'आवेदन प्रक्रिया',
    applyNow: 'एक मेन्टर बनमा आवेदन गर्नुहोस्',
    fullName: 'पूरा नाम',
    email: 'ईमेल ठेगाना',
    phone: 'फोन नम्बर',
    expertise: 'विशेषज्ञता को क्षेत्र',
    experience: 'अनुभवको वर्ष',
    bio: 'आफ्नो बारेमा हामीलाई बताउनुहोस्',
    submit: 'आवेदन जमा गर्नुहोस्',
    submitted: 'धन्यवाद! हामी तपाईंको आवेदन शीघ्रै समीक्षा गर्नेछौं।',
    
    shareKnowledge: 'आफ्नो ज्ञान साझा गर्नुहोस्',
    shareKnowledgeDesc: 'विद्यार्थीहरूलाई चुनौतीहरू पार गर्न र लक्ष्य हासिल गर्न मदद गर्नुहोस्',
    buildNetwork: 'आफ्नो नेटवर्क बनाउनुहोस्',
    buildNetworkDesc: 'समान विचारको शिक्षकहरू र व्यावसायिकहरूसँग जोडिनुहोस्',
    earnRecognition: 'स्वीकृति अर्जन गर्नुहोस्',
    earnRecognitionDesc: 'हाम्रो समुदायमा आफ्नो क्षेत्रमा एक स्वीकृत विशेषज्ञ बन्नुहोस्',
    makeDifference: 'फरक ल्याउनुहोस्',
    makeDifferenceDesc: 'शिक्षा अन्तराल पूरा गर्न र वंचित विद्यार्थीहरूलाई सशक्त बनाउन मदद गर्नुहोस्',
    
    subject: 'विषय',
    minimumQualification: 'न्यूनतम योग्यता (स्नातक डिग्री वा उच्चतर)',
    oneYear: 'आफ्नो क्षेत्रमा १ + वर्षको अनुभव',
    passion: 'शिक्षण र मेन्टोरिङको लागि जुनून',
    english: 'अंग्रेजी वा नेपाली मा प्रवाहिता',
    commitment: 'प्रति सप्ताह ५ + घन्टा खर्च गर्न प्रतिबद्धता',
    
    step1: 'आवेदन जमा गर्नुहोस्',
    step1Desc: 'आफ्नो योग्यता र अनुभवको साथ फार्ममा भर्नुहोस्',
    step2: 'प्रमाणीकरण',
    step2Desc: 'हाम्रो टीम आफ्नो साख्यताहरू समीक्षा र सत्यापन गर्नेछ',
    step3: 'अन्तरवार्ता',
    step3Desc: 'आफ्नो मेन्टोरिङ लक्ष्यहरू छलफल गर्न एक छोटो अन्तरवार्तामा भाग लिनुहोस्',
    step4: 'प्रशिक्षण',
    step4Desc: 'मेन्टर प्रशिक्षण र अनबोर्डिङ पूरा गर्नुहोस्',
    step5: 'मेन्टरिङ शुरु गर्नुहोस्',
    step5Desc: 'आफ्नो विशेषज्ञताको क्षेत्रमा विद्यार्थीहरूलाई मेन्टरिङ शुरु गर्नुहोस्',
  },
};

export default function BecomeMentorPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    bio: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forms/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        expertise: '',
        experience: '',
        bio: '',
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
      icon: Lightbulb,
      title: t.shareKnowledge,
      description: t.shareKnowledgeDesc,
    },
    {
      icon: Users,
      title: t.buildNetwork,
      description: t.buildNetworkDesc,
    },
    {
      icon: Award,
      title: t.earnRecognition,
      description: t.earnRecognitionDesc,
    },
    {
      icon: Heart,
      title: t.makeDifference,
      description: t.makeDifferenceDesc,
    },
  ];

  const requirements = [
    t.minimumQualification,
    t.oneYear,
    t.passion,
    t.english,
    t.commitment,
  ];

  const steps = [
    { title: t.step1, description: t.step1Desc },
    { title: t.step2, description: t.step2Desc },
    { title: t.step3, description: t.step3Desc },
    { title: t.step4, description: t.step4Desc },
    { title: t.step5, description: t.step5Desc },
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
        <h2 className="text-3xl font-bold mb-12 text-center">{t.mentorBenefits}</h2>
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

      {/* Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t.requirements}</h2>
          <Card className="p-8 border-2 border-blue-200">
            <ul className="space-y-4">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-lg">{req}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">{t.applicationProcess}</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 text-center border-2 border-blue-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 -right-2 w-4 h-0.5 bg-red-600" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.applyNow}</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-2">{t.phone}</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.expertise}</label>
                  <Input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.experience}</label>
                  <Input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.bio}</label>
                <textarea
                  name="bio"
                  value={formData.bio}
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
        </div>
      </section>
    </div>
  );
}
