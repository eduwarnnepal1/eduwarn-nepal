'use client';

import { useLanguage } from '@/context/language-context';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Eye } from 'lucide-react';

const translations = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: January 2024',
    introduction: 'At EduWarn Nepal, we are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.',
    
    section1: 'Information We Collect',
    section1Content: 'We collect information you provide directly to us, such as when you create an account, take a course, make a donation, or contact us. This includes:',
    section1Items: [
      'Personal identification information (name, email, phone number)',
      'Educational information (courses taken, progress, achievements)',
      'Account preferences and settings',
      'Communication history and support tickets',
      'Payment information (processed securely through third-party processors)',
      'Device information and usage analytics',
    ],
    
    section2: 'How We Use Your Information',
    section2Content: 'We use the information we collect to:',
    section2Items: [
      'Provide, maintain, and improve our platform and services',
      'Personalize your learning experience',
      'Send educational updates and course recommendations',
      'Process transactions and send related information',
      'Comply with legal obligations',
      'Detect and prevent fraudulent activities',
      'Send promotional communications (with your consent)',
    ],
    
    section3: 'Data Security',
    section3Content: 'We implement comprehensive security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. All data transmissions are encrypted using SSL/TLS protocols, and sensitive information is stored securely.',
    
    section4: 'Data Retention',
    section4Content: 'We retain your personal information for as long as your account is active or as needed to provide our services. You may request deletion of your data at any time, subject to legal retention requirements.',
    
    section5: 'Sharing Your Information',
    section5Content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with:',
    section5Items: [
      'Service providers who assist in operating our website',
      'Educational partners for course delivery',
      'Legal authorities when required by law',
      'Third-party analytics providers (anonymized data only)',
    ],
    
    section6: 'Cookies',
    section6Content: 'Our website uses cookies to enhance your experience. You can control cookie settings through your browser preferences.',
    
    section7: 'Your Rights',
    section7Content: 'You have the right to:',
    section7Items: [
      'Access your personal information',
      'Correct inaccurate data',
      'Request deletion of your account and data',
      'Opt-out of marketing communications',
      'Data portability',
    ],
    
    section8: 'Contact Us',
    section8Content: 'If you have questions about this Privacy Policy or our privacy practices, please contact us at:',
    email: 'privacy@eduwarnnepal.com',
    
    changes: 'Changes to This Policy',
    changesContent: 'We may update this Privacy Policy from time to time. We will notify you of material changes via email or by prominently displaying a notice on our website.',
  },
  ne: {
    title: 'गोपनीयता नीति',
    lastUpdated: 'अन्तिम अपडेट: जनवरी २०२४',
    introduction: 'EduWarn नेपालमा, हामी आपका गोपनीयताको सुरक्षा गर्न र हाम्रो प्ल्याटफर्ममा सकारात्मक अनुभव सुनिश्चित गर्न प्रतिबद्ध छौं। यो गोपनीयता नीति बताउँछ कि हामी कसरी आपका जानकारी एकत्र, उपयोग, प्रकट र सुरक्षित गर्छौं।',
    
    section1: 'हामीले एकत्र गरेको जानकारी',
    section1Content: 'हामी सीधे आपको प्रदान गर्नु भएको जानकारी एकत्र गर्छौं, जस्तो कि जब आप एक खाता बनाउनु भएको, पाठ्यक्रम लिनु भएको, दान गर्नु भएको वा हामीलाई सम्पर्क गर्नु भएको। यसमा समावेश छ:',
    section1Items: [
      'व्यक्तिगत पहचान जानकारी (नाम, ईमेल, फोन नम्बर)',
      'शैक्षणिक जानकारी (पाठ्यक्रम लिएको, प्रगति, उपलब्धि)',
      'खाता प्राथमिकताहरु र सेटिङ्गहरु',
      'संचार इतिहास र सहायता टिकिट',
      'भुक्तानी जानकारी (तीसरो पक्ष प्रोसेसरहरु माध्यमबाट सुरक्षित रूपमा प्रसंस्कृत)',
      'उपकरण जानकारी र उपयोग विश्लेषण',
    ],
    
    section2: 'हामीले आपका जानकारी कसरी उपयोग गर्छौं',
    section2Content: 'हामी एकत्र गरेको जानकारी उपयोग गर्छौं:',
    section2Items: [
      'हाम्रो प्ल्याटफर्म र सेवाहरु प्रदान, अनुरक्षण र सुधार गर्न',
      'आपको शिक्षण अनुभव व्यक्तिगत गर्न',
      'शैक्षणिक अपडेट र पाठ्यक्रम सुझाव पठाउन',
      'लेनदेन प्रक्रिया गर्न र संबंधित जानकारी पठाउन',
      'कानूनी दायित्व पूरा गर्न',
      'धोखाधड़ी गतिविधि पहचान र रोकथाम गर्न',
      'प्रचारक संचार पठाउन (आपको सहमति सहित)',
    ],
    
    section3: 'डेटा सुरक्षा',
    section3Content: 'हामी आपका ব्যক्তিगत डेटा गैर-अधिकृत पहुँच, परिवर्तन, प्रकटीकरण वा विनाश गर्न व्यापक सुरक्षा उपाय लागू गर्छौं। सबै डेटा ट्रान्समिशन SSL/TLS प्रोटोकल उपयोग गरी एनक्रिप्ट गरिन्छ, र संवेदनशील जानकारी सुरक्षित रूपमा भण्डार गरिन्छ।',
    
    section4: 'डेटा धारण',
    section4Content: 'हामी आपका व्यक्तिगत जानकारी जब सम्म आपको खाता सक्रिय छ वा हाम्रो सेवाहरु प्रदान गर्न आवश्यक छ तब सम्म राख्छौं। आप कानूनी धारण आवश्यकताहरु को अधीन कुनै पनि समय आपका डेटा मिटाउन अनुरोध गर्न सक्नु हुन्छ।',
    
    section5: 'आपका जानकारी साझा गर्दै',
    section5Content: 'हामी आपका व्यक्तिगत जानकारी तीसरे पक्ष को लागी बेच्न, व्यापार वा किराए गर्दैनौ। हामी जानकारी साझा गर्न सक्छौं:',
    section5Items: [
      'सेवा प्रदानकर्ताहरु जो हाम्रो वेबसाइट संचालनमा सहायता गर्छन्',
      'पाठ्यक्रम डिलिभरी को लागी शैक्षणिक साझेदार',
      'कानूनद्वारा आवश्यक होले कानूनी अधिकारी',
      'तीसरे पक्षको विश्लेषण प्रदानकर्ता (गुमनाम डेटा मात्र)',
    ],
    
    section6: 'कुकीहरु',
    section6Content: 'हाम्रो वेबसाइट आपको अनुभव बढाउन कुकीहरु उपयोग गर्दछ। आप आपको ब्राउजर प्राथमिकताहरु को माध्यमबाट कुकी सेटिङ्गहरु नियन्त्रण गर्न सक्नु हुन्छ।',
    
    section7: 'आपका अधिकार',
    section7Content: 'आपको अधिकार छ:',
    section7Items: [
      'आपका व्यक्तिगत जानकारी पहुँच गर्न',
      'अचुक डेटा सुधार गर्न',
      'आपको खाता र डेटा मिटाउन अनुरोध गर्न',
      'विपणन संचार को बाहिर निकल्न',
      'डेटा पोर्टेबिलिटी',
    ],
    
    section8: 'हामीलाई सम्पर्क गर्नुहोस्',
    section8Content: 'यदि आपको यो गोपनीयता नीति वा हाम्रो गोपनीयता अभ्यास बारे प्रश्न छ भने, कृपया हामीलाई सम्पर्क गर्नुहोस्:',
    email: 'privacy@eduwarnnepal.com',
    
    changes: 'यो नीति को परिवर्तन',
    changesContent: 'हामी समय-समय मा यो गोपनीयता नीति अपडेट गर्न सक्छौं। हामी सामग्री परिवर्तन को बारे मा ईमेल वा हाम्रो वेबसाइटमा एक नोटिस प्रदर्शन गरेर तपाइलाई सूचित गर्नेछौं।',
  },
};

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-200" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">{t.title}</h1>
          <p className="text-lg text-red-100">{t.lastUpdated}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <p className="text-lg mb-12 text-gray-700 leading-relaxed">{t.introduction}</p>

        {/* Section 1 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-red-600" />
            {t.section1}
          </h2>
          <p className="text-gray-700 mb-4">{t.section1Content}</p>
          <ul className="space-y-2">
            {t.section1Items.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Section 2 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section2}</h2>
          <p className="text-gray-700 mb-4">{t.section2Content}</p>
          <ul className="space-y-2">
            {t.section2Items.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Section 3 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Lock className="w-6 h-6 text-red-600" />
            {t.section3}
          </h2>
          <p className="text-gray-700">{t.section3Content}</p>
        </Card>

        {/* Section 4 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section4}</h2>
          <p className="text-gray-700">{t.section4Content}</p>
        </Card>

        {/* Section 5 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section5}</h2>
          <p className="text-gray-700 mb-4">{t.section5Content}</p>
          <ul className="space-y-2">
            {t.section5Items.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Section 6 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section6}</h2>
          <p className="text-gray-700">{t.section6Content}</p>
        </Card>

        {/* Section 7 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section7}</h2>
          <p className="text-gray-700 mb-4">{t.section7Content}</p>
          <ul className="space-y-2">
            {t.section7Items.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Section 8 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section8}</h2>
          <p className="text-gray-700 mb-2">{t.section8Content}</p>
          <a href={`mailto:${t.email}`} className="text-red-600 font-bold hover:underline">
            {t.email}
          </a>
        </Card>

        {/* Changes Section */}
        <Card className="p-8 border-2 border-green-200 bg-green-50">
          <h2 className="text-2xl font-bold mb-4">{t.changes}</h2>
          <p className="text-gray-700">{t.changesContent}</p>
        </Card>
      </section>
    </div>
  );
}
