'use client';

import React from "react"

import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const translations = {
  en: {
    title: 'Contact Us',
    subtitle: 'We\'d love to hear from you. Get in touch with us today.',
    email: 'Email Address',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    submitted: 'Thank you! We\'ll get back to you soon.',
    ourOffice: 'Our Office',
    getInTouch: 'Get In Touch',
    emailAddress: 'Email',
    phoneNumber: 'Phone',
    address: 'Address',
    supportEmail: 'support@eduwarnnepal.com',
    supportPhone: '+977 (1) 555-0123',
    supportAddress: 'Kathmandu, Nepal',
    sendUsMessage: 'Send us a message',
    fullName: 'Full Name',
    responseTime: 'We typically respond within 24 hours',
  },
  ne: {
    title: 'हामीलाई सम्पर्क गर्नुहोस्',
    subtitle: 'हामी तपाईंको कुरा सुन्न चाहन्छौं। आज नै हामीलाई सम्पर्क गर्नुहोस्।',
    email: 'ईमेल ठेगाना',
    phone: 'फोन नम्बर',
    subject: 'विषय',
    message: 'संदेश',
    sendMessage: 'संदेश पठाउनुहोस्',
    submitted: 'धन्यवाद! हामी तपाईंलाई शीघ्रै उत्तर दिनेछौं।',
    ourOffice: 'हाम्रो कार्यालय',
    getInTouch: 'हामीसँग सम्पर्क गर्नुहोस्',
    emailAddress: 'ईमेल',
    phoneNumber: 'फोन',
    address: 'ठेगाना',
    supportEmail: 'support@eduwarnnepal.com',
    supportPhone: '+977 (1) 555-0123',
    supportAddress: 'काठमाडौं, नेपाल',
    sendUsMessage: 'हामीलाई एक संदेश पठाउनुहोस्',
    fullName: 'पूरा नाम',
    responseTime: 'हामी सामान्यतः २४ घन्टामा उत्तर दिन्छौं',
  },
};

export default function ContactUsPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t.emailAddress,
      value: t.supportEmail,
      link: `mailto:${t.supportEmail}`,
    },
    {
      icon: Phone,
      title: t.phoneNumber,
      value: t.supportPhone,
      link: `tel:${t.supportPhone}`,
    },
    {
      icon: MapPin,
      title: t.address,
      value: t.supportAddress,
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">{t.title}</h1>
          <p className="text-xl sm:text-2xl text-red-50">{t.subtitle}</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">{t.ourOffice}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.link}
                className="block"
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all hover:border-red-600 border-2 border-blue-200">
                  <Icon className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{method.title}</h3>
                  <p className="text-gray-600 break-all">{method.value}</p>
                </Card>
              </a>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.sendUsMessage}</h2>
          <p className="text-center text-gray-600 mb-8">{t.responseTime}</p>
          
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
              <div>
                <label className="block text-sm font-medium mb-2">{t.subject}</label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.message}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
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
                    {t.sendMessage}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t.sendMessage}
                  </>
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

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{t.getInTouch}</h2>
        <div className="rounded-lg overflow-hidden border-2 border-blue-200 h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.6845217588455!2d85.3170639!3d27.7089053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fcb82d7645%3A0x123456789!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
