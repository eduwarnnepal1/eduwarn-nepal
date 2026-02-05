'use client';

import React from "react"

import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, Users, BookOpen, Zap, DollarSign, Banknote } from 'lucide-react';

const translations = {
  en: {
    title: 'Make a Donation',
    subtitle: 'Support quality education for every student in Nepal',
    description: 'Your generous contribution helps us provide free and affordable education to underprivileged students across Nepal. Every donation makes a real difference.',
    
    donationAmount: 'Select Donation Amount',
    customAmount: 'Custom Amount',
    paymentMethod: 'Payment Method',
    nepaliBank: 'Nepali Bank Transfer',
    international: 'International (Credit Card, PayPal)',
    
    donorInfo: 'Donor Information',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    isAnonymous: 'Make this donation anonymous',
    
    impactMessage: 'Your Impact',
    donate: 'Donate Now',
    
    impact1: 'Helps 5 students access quality education',
    impact2: 'Supports a teacher\'s monthly salary',
    impact3: 'Provides learning materials for a class',
    impact4: 'Establishes a computer lab in a school',
    
    bankTransferInfo: 'Nepali Bank Transfer Details',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    bankCode: 'Bank Code (SWIFT)',
    referenceNumber: 'Reference/Message',
    copyDetails: 'Copy Bank Details',
    copied: 'Copied to clipboard!',
    
    bankOption1: 'Nabil Bank',
    bankAccount1: '1234567890',
    bankCode1: 'NBLAIN22',
    
    bankOption2: 'Nepal Investment Bank',
    bankAccount2: '9876543210',
    bankCode2: 'NIBLNPKA',
    
    internationalPayment: 'International Payment',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    stripeProcessing: 'Processing via Stripe',
    paypalProcessing: 'Processing via PayPal',
    
    howYouHelp: 'How Your Donation Helps',
    studentsReached: 'Students Reached',
    teachersSupported: 'Teachers Supported',
    resourcesProvided: 'Resources Provided',
    schoolsEquipped: 'Schools Equipped',
    
    taxBenefit: 'Tax Benefits',
    taxBenefitDesc: 'Donations are eligible for tax deductions in Nepal. Keep your receipt for tax filing.',
    
    newsletter: 'Join Our Newsletter',
    newsletterDesc: 'Receive updates on how your donation is making an impact',
    subscribeEmail: 'Your email address',
    subscribe: 'Subscribe',
    
    thankYou: 'Thank You!',
    thankYouMessage: 'Your donation has been received. We\'ll send you a receipt and impact updates.',
    
    faq: 'Frequently Asked Questions',
    q1: 'Is my donation secure?',
    a1: 'Yes, all donations are processed through secure payment gateways (Stripe for international, bank transfer for Nepal).',
    q2: 'Can I get a receipt?',
    a2: 'Absolutely! A receipt will be emailed to you automatically after successful donation.',
    q3: 'Can I make a recurring donation?',
    a3: 'Yes, you can set up monthly donations through your preferred payment method.',
    q4: 'How is my donation used?',
    a4: 'All donations go directly to student scholarships, teacher training, and educational resources in Nepal.',
  },
  ne: {
    title: 'एक दान गर्नुहोस्',
    subtitle: 'नेपालमा प्रत्येक विद्यार्थीको लागि गुणस्तरको शिक्षा समर्थन गर्नुहोस्',
    description: 'तपाईंको उदार योगदान नेपालमा वंचित विद्यार्थीहरूलाई नि: शुल्क र सस्ता शिक्षा प्रदान गर्न हामीलाई मदद गर्दछ। प्रत्येक दान एक वास्तविक अन्तर ल्याउँछ।',
    
    donationAmount: 'दान राशि चयन गर्नुहोस्',
    customAmount: 'कस्टम राशि',
    paymentMethod: 'भुक्तानी विधि',
    nepaliBank: 'नेपाली बैंक हस्तान्तरण',
    international: 'अन्तर्राष्ट्रिय (क्रेडिट कार्ड, PayPal)',
    
    donorInfo: 'दाता जानकारी',
    fullName: 'पूरा नाम',
    email: 'ईमेल ठेगाना',
    phone: 'फोन नम्बर',
    isAnonymous: 'यो दान गुमनाम गर्नुहोस्',
    
    impactMessage: 'तपाईंको प्रभाव',
    donate: 'अब दान गर्नुहोस्',
    
    impact1: '५ विद्यार्थीलाई गुणस्तरको शिक्षामा पहुँच प्रदान गर्दछ',
    impact2: 'एक शिक्षकको मासिक तनख्वा समर्थन गर्दछ',
    impact3: 'एक वर्गको लागि शिक्षण सामग्री प्रदान गर्दछ',
    impact4: 'एक स्कूलमा कम्प्यूटर ल्याब स्थापन गर्दछ',
    
    bankTransferInfo: 'नेपाली बैंक हस्तान्तरण विवरण',
    bankName: 'बैंक को नाम',
    accountNumber: 'खाता नम्बर',
    bankCode: 'बैंक कोड (SWIFT)',
    referenceNumber: 'सन्दर्भ/संदेश',
    copyDetails: 'बैंक विवरण कपी गर्नुहोस्',
    copied: 'क्लिपबोर्डमा कपी गरियो!',
    
    bankOption1: 'नाबिल बैंक',
    bankAccount1: '1234567890',
    bankCode1: 'NBLAIN22',
    
    bankOption2: 'नेपाल बिनियोग बैंक',
    bankAccount2: '9876543210',
    bankCode2: 'NIBLNPKA',
    
    internationalPayment: 'अन्तर्राष्ट्रिय भुक्तानी',
    cardNumber: 'कार्ड नम्बर',
    expiryDate: 'समय सीमा',
    cvv: 'CVV',
    stripeProcessing: 'Stripe को माध्यमबाट प्रसंस्करण',
    paypalProcessing: 'PayPal को माध्यमबाट प्रसंस्करण',
    
    howYouHelp: 'तपाईंको दान कसरी मदद गर्छ',
    studentsReached: 'विद्यार्थीहरू पहुँच गरेको',
    teachersSupported: 'शिक्षक समर्थित',
    resourcesProvided: 'संसाधन प्रदान गरियो',
    schoolsEquipped: 'स्कूल सुसज्जित',
    
    taxBenefit: 'कर लाभ',
    taxBenefitDesc: 'दान नेपालमा कर कटौती के लिए योग्य हैं। कर फाइलिंग के लिए अपनी रसीद रखें।',
    
    newsletter: 'हाम्रो न्यूजलेटर सदस्य बन्नुहोस्',
    newsletterDesc: 'आपका दान कस रहे हैं इसका प्रभाव अपडेट प्राप्त करें',
    subscribeEmail: 'आफ्नो ईमेल ठेगाना',
    subscribe: 'सदस्य बन्नुहोस्',
    
    thankYou: 'धन्यवाद!',
    thankYouMessage: 'आपका दान प्राप्त हुआ है। हम आपको एक रसीद और प्रभाव अपडेट भेजेंगे।',
    
    faq: 'बारम्बार सोधिने प्रश्न',
    q1: 'के मेरो दान सुरक्षित छ?',
    a1: 'हो, सबै दान सुरक्षित भुक्तानी गेटवेहरू (अन्तर्राष्ट्रियका लागि Stripe, नेपालको लागि बैंक हस्तान्तरण) को माध्यमबाट प्रक्रिया गरिन्छ।',
    q2: 'के मैं एक रसीद प्राप्त कर सकता हूँ?',
    a2: 'हाँ, सफल दानके बाद एक रसीद स्वचालित रूप से आपके ईमेल को भेजी जाएगी।',
    q3: 'के मैं आवर्ती दान कर सकता हूँ?',
    a3: 'हाँ, आप अपनी पसंद के भुक्तानी विधि के माध्यमबाट मासिक दान स्थापित कर सकते हैं।',
    q4: 'मेरा दान का उपयोग कैसे किया जाता है?',
    a4: 'सभी दान सीधे छात्र छात्रवृत्ति, शिक्षक प्रशिक्षण, और नेपाल में शैक्षणिक संसाधनों में जाता है।',
  },
};

type DonationOption = {
  amount: number;
  label: string;
};

export default function DonatePage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('nepali-bank');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    isAnonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedBank, setSelectedBank] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const donationOptions: DonationOption[] = [
    { amount: 500, label: '₨ 500' },
    { amount: 1000, label: '₨ 1,000' },
    { amount: 5000, label: '₨ 5,000' },
    { amount: 10000, label: '₨ 10,000' },
  ];

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount || 0;

  const bankDetails = [
    {
      name: t.bankOption1,
      account: t.bankAccount1,
      code: t.bankCode1,
    },
    {
      name: t.bankOption2,
      account: t.bankAccount2,
      code: t.bankCode2,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forms/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: finalAmount,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process donation');
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `${bankDetails[selectedBank].account}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-200" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">{t.title}</h1>
          <p className="text-xl sm:text-2xl mb-8 text-red-50">{t.subtitle}</p>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">{t.description}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-2 border-blue-200">
              {/* Amount Selection */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">{t.donationAmount}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {donationOptions.map((option) => (
                    <button
                      key={option.amount}
                      onClick={() => {
                        setSelectedAmount(option.amount);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all border-2 ${
                        selectedAmount === option.amount && !customAmount
                          ? 'bg-red-600 text-white border-red-600'
                          : 'border-gray-300 hover:border-red-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.customAmount}</label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter custom amount"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8 border-t-2 border-gray-200 pt-8">
                <h3 className="text-2xl font-bold mb-4">{t.paymentMethod}</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nepali-bank"
                      checked={paymentMethod === 'nepali-bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-bold">{t.nepaliBank}</div>
                      <div className="text-sm text-gray-600">Nabil Bank, NIB, etc.</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="international"
                      checked={paymentMethod === 'international'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-bold">{t.international}</div>
                      <div className="text-sm text-gray-600">Stripe, PayPal</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Donor Info */}
              <div className="border-t-2 border-gray-200 pt-8">
                <h3 className="text-2xl font-bold mb-4">{t.donorInfo}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.fullName}</label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
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
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">{t.isAnonymous}</span>
                  </label>
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
                        {t.donate}
                      </>
                    ) : (
                      <>{t.donate} - ₨{finalAmount.toLocaleString() || '0'}</>
                    )}
                  </Button>
                  {submitted && (
                    <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center animate-fadeIn">
                      ✓ {t.thankYouMessage}
                    </div>
                  )}
                </form>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Impact Summary */}
            <Card className="p-6 border-2 border-blue-200 mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                {t.impactMessage}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{t.impact1}</span>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t.impact2}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{t.impact3}</span>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{t.impact4}</span>
                </div>
              </div>
            </Card>

            {/* Bank Details */}
            {paymentMethod === 'nepali-bank' && (
              <Card className="p-6 border-2 border-green-200 mb-8 bg-green-50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-green-600" />
                  {t.bankTransferInfo}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t.bankName}</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                  >
                    {bankDetails.map((bank, index) => (
                      <option key={index} value={index}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <div>
                    <span className="font-semibold">{t.accountNumber}:</span>
                    <div className="font-mono bg-white p-2 rounded border border-green-300 mt-1">
                      {bankDetails[selectedBank].account}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">{t.bankCode}:</span>
                    <div className="font-mono bg-white p-2 rounded border border-green-300 mt-1">
                      {bankDetails[selectedBank].code}
                    </div>
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {copied ? t.copied : t.copyDetails}
                </button>
              </Card>
            )}

            {/* Tax Benefits */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <h3 className="text-lg font-bold mb-2">{t.taxBenefit}</h3>
              <p className="text-sm text-gray-700">{t.taxBenefitDesc}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
