'use client';

import React from "react";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronDown, Search, HelpCircle, BookOpen, MessageSquare, Settings } from 'lucide-react';

const translations = {
  en: {
    title: 'Help & Support Center',
    subtitle: 'Find answers and get support for your questions',
    searchPlaceholder: 'Search for help articles...',
    
    categories: {
      getting_started: 'Getting Started',
      courses: 'Courses & Learning',
      account: 'Account & Profile',
      technical: 'Technical Issues',
      donations: 'Donations',
      community: 'Community',
    },
    
    faqTitle: 'Frequently Asked Questions',
    contactSupport: 'Contact Support',
    contactSupportDesc: 'Didn\'t find what you\'re looking for? Reach out to our support team.',
    sendMessage: 'Send Message',
    
    faqs: [
      {
        category: 'getting_started',
        question: 'How do I create an account?',
        answer: 'Click on the "Sign Up" button in the top right corner. Fill in your email, create a password, and follow the verification steps. You can also sign up with your Google account.'
      },
      {
        category: 'getting_started',
        question: 'What do I need to get started?',
        answer: 'You only need a valid email address and an internet connection. Create an account and start exploring courses immediately.'
      },
      {
        category: 'courses',
        question: 'Can I access courses offline?',
        answer: 'Some courses offer downloadable materials for offline access. Check the course details for availability.'
      },
      {
        category: 'courses',
        question: 'How do I enroll in a course?',
        answer: 'Browse the courses section, click on a course, and click "Enroll Now". Most courses are free, but some may require payment or prerequisites.'
      },
      {
        category: 'courses',
        question: 'Can I get a certificate?',
        answer: 'Yes! Upon completing a course, you\'ll receive a certificate of completion that you can share on your profile.'
      },
      {
        category: 'account',
        question: 'How do I update my profile?',
        answer: 'Go to your profile page, click "Edit Profile", update your information, and save changes.'
      },
      {
        category: 'account',
        question: 'How do I change my password?',
        answer: 'Go to Settings > Account Security, click "Change Password", enter your current password, and create a new one.'
      },
      {
        category: 'account',
        question: 'How do I become a teacher or mentor?',
        answer: 'Visit the "Become a Mentor" page, fill out the application form with your qualifications, and our team will review your application.'
      },
      {
        category: 'technical',
        question: 'The website is running slow. What should I do?',
        answer: 'Try clearing your browser cache, disabling browser extensions, or using a different browser. If the issue persists, contact our support team.'
      },
      {
        category: 'technical',
        question: 'I forgot my password. What should I do?',
        answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.'
      },
      {
        category: 'technical',
        question: 'Why can\'t I log in?',
        answer: 'Check that you\'re using the correct email and password. If you still can\'t log in, reset your password or contact support.'
      },
      {
        category: 'donations',
        question: 'Are donations tax deductible?',
        answer: 'Yes, donations to EduWarn Nepal may be eligible for tax deductions in Nepal. Keep your receipt for tax filing purposes.'
      },
      {
        category: 'donations',
        question: 'How is my donation used?',
        answer: 'All donations go directly to student scholarships, teacher training, learning materials, and platform infrastructure improvements.'
      },
      {
        category: 'donations',
        question: 'Can I make a recurring donation?',
        answer: 'Yes! You can set up monthly donations through your preferred payment method on the donation page.'
      },
      {
        category: 'community',
        question: 'How do I participate in the forum?',
        answer: 'Visit the Forum section, browse categories, and post your questions or discussions. Be respectful and follow community guidelines.'
      },
      {
        category: 'community',
        question: 'Can I report inappropriate content?',
        answer: 'Yes, you can report any inappropriate content using the report button. Our moderation team will review it within 24 hours.'
      },
    ],
    
    emailLabel: 'Your Email',
    messageLabel: 'Your Message',
    submitted: 'Thank you! We\'ll get back to you soon.',
    browseAll: 'Browse All Articles',
    viewMore: 'View More',
    noResults: 'No articles found. Try different keywords.',
  },
  ne: {
    title: 'सहायता र समर्थन केन्द्र',
    subtitle: 'आपके प्रश्नों के उत्तर खोजें और समर्थन प्राप्त करें',
    searchPlaceholder: 'सहायता लेख खोजें...',
    
    categories: {
      getting_started: 'शुरु गर्दै',
      courses: 'पाठ्यक्रम र शिक्षण',
      account: 'खाता और प्रोफाइल',
      technical: 'तकनीकी समस्या',
      donations: 'दान',
      community: 'समुदाय',
    },
    
    faqTitle: 'बारम्बार सोधिने प्रश्न',
    contactSupport: 'समर्थन से संपर्क करें',
    contactSupportDesc: 'वह नहीं मिला जो आप ढूंढ रहे हैं? हमारी सहायता टीम तक पहुंचें।',
    sendMessage: 'संदेश भेजें',
    
    faqs: [
      {
        category: 'getting_started',
        question: 'मैं एक खाता कैसे बनाऊं?',
        answer: 'ऊपरी दाईं ओर "साइन अप" बटन पर क्लिक करें। अपना ईमेल दर्ज करें, एक पासवर्ड बनाएं, और सत्यापन चरणों का पालन करें। आप अपने Google खाते के साथ भी साइन अप कर सकते हैं।'
      },
      {
        category: 'getting_started',
        question: 'शुरु करने के लिए मुझे क्या चाहिए?',
        answer: 'आपको केवल एक वैध ईमेल पता और एक इंटरनेट कनेक्शन की आवश्यकता है। एक खाता बनाएं और तुरंत पाठ्यक्रम का अन्वेषण शुरू करें।'
      },
      {
        category: 'courses',
        question: 'क्या मैं पाठ्यक्रमों को ऑफलाइन एक्सेस कर सकता हूं?',
        answer: 'कुछ पाठ्यक्रम ऑफलाइन पहुंच के लिए डाउनलोड करने योग्य सामग्री प्रदान करते हैं। उपलब्धता के लिए पाठ्यक्रम विवरण देखें।'
      },
      {
        category: 'courses',
        question: 'मैं एक पाठ्यक्रम में कैसे नामांकित होऊं?',
        answer: 'पाठ्यक्रम अनुभाग ब्राउज़ करें, एक पाठ्यक्रम पर क्लिक करें, और "अभी नामांकित करें" पर क्लिक करें। अधिकांश पाठ्यक्रम मुफ़्त हैं, लेकिन कुछ में भुगतान या आवश्यकताएं हो सकती हैं।'
      },
      {
        category: 'courses',
        question: 'क्या मुझे एक प्रमाणपत्र मिल सकता है?',
        answer: 'हाँ! एक पाठ्यक्रम पूरा करने पर, आप एक समापन प्रमाणपत्र प्राप्त करेंगे जिसे आप अपनी प्रोफाइल पर साझा कर सकते हैं।'
      },
      {
        category: 'account',
        question: 'मैं अपनी प्रोफाइल कैसे अपडेट करूं?',
        answer: 'अपने प्रोफाइल पृष्ठ पर जाएं, "प्रोफाइल संपादित करें" पर क्लिक करें, अपनी जानकारी अपडेट करें, और परिवर्तन सहेजें।'
      },
      {
        category: 'account',
        question: 'मैं अपना पासवर्ड कैसे बदलूं?',
        answer: 'सेटिंग्स> खाता सुरक्षा पर जाएं, "पासवर्ड बदलें" पर क्लिक करें, अपना वर्तमान पासवर्ड दर्ज करें, और एक नया बनाएं।'
      },
      {
        category: 'account',
        question: 'मैं एक शिक्षक या मेंटर कैसे बनूं?',
        answer: '"मेंटर बनें" पृष्ठ पर जाएं, अपनी योग्यता के साथ आवेदन फॉर्म भरें, और हमारी टीम आपके आवेदन की समीक्षा करेगी।'
      },
      {
        category: 'technical',
        question: 'वेबसाइट धीरे चल रही है। मुझे क्या करना चाहिए?',
        answer: 'अपने ब्राउजर कैश को साफ़ करने का प्रयास करें, ब्राउजर एक्सटेंशन को अक्षम करें, या एक अलग ब्राउजर का उपयोग करें। यदि समस्या बनी रहती है, तो हमारी सहायता टीम से संपर्क करें।'
      },
      {
        category: 'technical',
        question: 'मुझे अपना पासवर्ड भूल गया। मुझे क्या करना चाहिए?',
        answer: 'लॉगिन पृष्ठ पर "पासवर्ड भूल गए" पर क्लिक करें, अपना ईमेल दर्ज करें, और अपने इनबॉक्स में भेजे गए निर्देशों का पालन करें।'
      },
      {
        category: 'technical',
        question: 'मैं लॉगिन क्यों नहीं कर सकता?',
        answer: 'जांचें कि आप सही ईमेल और पासवर्ड का उपयोग कर रहे हैं। यदि आप अभी भी लॉगिन नहीं कर सकते, तो अपना पासवर्ड रीसेट करें या समर्थन से संपर्क करें।'
      },
      {
        category: 'donations',
        question: 'क्या दान कर योग्य है?',
        answer: 'हाँ, EduWarn नेपाल को दान नेपाल में कर कटौती के लिए योग्य हो सकते हैं। कर फाइलिंग उद्देश्यों के लिए अपनी रसीद रखें।'
      },
      {
        category: 'donations',
        question: 'मेरे दान का उपयोग कैसे किया जाता है?',
        answer: 'सभी दान सीधे छात्र छात्रवृत्ति, शिक्षक प्रशिक्षण, सीखने की सामग्री, और प्लेटफॉर्म बुनियादी ढांचे सुधार के लिए जाते हैं।'
      },
      {
        category: 'donations',
        question: 'क्या मैं आवर्ती दान कर सकता हूं?',
        answer: 'हाँ! आप दान पृष्ठ पर अपनी पसंद के भुगतान विधि के माध्यमबाट मासिक दान स्थापित कर सकते हैं।'
      },
      {
        category: 'community',
        question: 'मैं फोरम में कैसे भाग लूं?',
        answer: 'फोरम अनुभाग पर जाएं, श्रेणियां ब्राउज़ करें, और अपने प्रश्न या चर्चा पोस्ट करें। सम्मानपूर्वक हो और सामुदायिक दिशानिर्देशों का पालन करें।'
      },
      {
        category: 'community',
        question: 'क्या मैं अनुचित सामग्री की रिपोर्ट कर सकता हूं?',
        answer: 'हाँ, आप रिपोर्ट बटन का उपयोग करके किसी भी अनुचित सामग्री की रिपोर्ट कर सकते हैं। हमारी संयोजन टीम २४ घंटे के भीतर इसकी समीक्षा करेगी।'
      },
    ],
    
    emailLabel: 'आपका ईमेल',
    messageLabel: 'आपका संदेश',
    submitted: 'धन्यवाद! हम जल्द ही आपके पास वापस आएंगे।',
    browseAll: 'सभी लेख ब्राउज़ करें',
    viewMore: 'और देखें',
    noResults: 'कोई लेख नहीं मिला। विभिन्न कीवर्ड आजमाएं।',
  },
};

type FAQ = {
  category: string;
  question: string;
  answer: string;
};

const Loading = () => null;

export default function HelpPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = t.faqs as FAQ[];
  
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setContactForm({ email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-red-200" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">{t.title}</h1>
            <p className="text-xl text-red-50 mb-8">{t.subtitle}</p>
            
            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b-2 border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                  !selectedCategory
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {t.browseAll}
              </button>
              {Object.entries(t.categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    selectedCategory === key
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t.faqTitle}</h2>
          
          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center border-2 border-blue-200">
              <p className="text-gray-600 text-lg">{t.noResults}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-2 border-blue-200 overflow-hidden hover:border-red-600 transition-colors"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-left font-semibold text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-red-600 transition-transform ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedIndex === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Contact Support */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold">{t.contactSupport}</h2>
              </div>
              <p className="text-gray-600 mb-6">{t.contactSupportDesc}</p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.emailLabel}</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.messageLabel}</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t.sendMessage}
                </Button>
                {submitted && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">
                    {t.submitted}
                  </div>
                )}
              </form>
            </Card>
          </div>
        </section>
      </div>
    </Suspense>
  );
}
