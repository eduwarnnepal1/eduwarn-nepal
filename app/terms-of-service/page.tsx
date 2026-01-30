'use client';

import { useLanguage } from '@/context/language-context';
import { Card } from '@/components/ui/card';
import { FileText, Scale, AlertCircle } from 'lucide-react';

const translations = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: January 2024',
    introduction: 'Welcome to EduWarn Nepal. These Terms of Service govern your use of our platform and services. By accessing and using EduWarn Nepal, you accept and agree to be bound by these terms.',
    
    section1: 'Use License',
    section1Content: 'Permission is granted to temporarily download one copy of the materials (information or software) on EduWarn Nepal\'s platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
    section1Items: [
      'Modify or copy the materials',
      'Use the materials for any commercial purpose or for any public display',
      'Attempt to decompile or reverse engineer any software contained on the platform',
      'Remove any copyright or other proprietary notations from the materials',
      'Transfer the materials to another person or "mirror" the materials on any other server',
      'Violate any applicable laws or regulations',
    ],
    
    section2: 'User Conduct',
    section2Content: 'You agree that you will not:',
    section2Items: [
      'Engage in any conduct that restricts or inhibits anyone\'s use or enjoyment of the platform',
      'Post or transmit any harmful, abusive, or obscene material',
      'Attempt to gain unauthorized access to our systems or networks',
      'Interfere with the proper functioning of the platform',
      'Upload or transmit viruses or any other malicious code',
      'Impersonate any person or entity',
      'Violate any intellectual property rights',
    ],
    
    section3: 'Intellectual Property',
    section3Content: 'All content on EduWarn Nepal, including but not limited to text, graphics, logos, images, and software, is the property of EduWarn Nepal or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or transmit any content without our permission.',
    
    section4: 'User Accounts',
    section4Content: 'When you create an account, you are responsible for maintaining the confidentiality of your password and account information. You agree to accept responsibility for all activities that occur under your account. You must provide accurate and complete information during registration.',
    
    section5: 'Educational Content',
    section5Content: 'EduWarn Nepal provides educational content for personal learning purposes. While we strive to provide accurate information, we do not guarantee the accuracy, completeness, or applicability of the content. Educational decisions should be made with professional guidance.',
    
    section6: 'Limitation of Liability',
    section6Content: 'In no event shall EduWarn Nepal be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform, even if we have been advised of the possibility of such damages.',
    
    section7: 'Indemnification',
    section7Content: 'You agree to indemnify and hold harmless EduWarn Nepal, its officers, directors, and employees from any claims, damages, or costs arising from your violation of these terms or any applicable laws.',
    
    section8: 'Termination',
    section8Content: 'EduWarn Nepal reserves the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users.',
    
    section9: 'Changes to Terms',
    section9Content: 'EduWarn Nepal may modify these Terms of Service at any time. Continued use of the platform following the posting of revised Terms means you accept and agree to the changes.',
    
    section10: 'Governing Law',
    section10Content: 'These Terms of Service and all related agreements are governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.',
    
    section11: 'Contact',
    section11Content: 'If you have questions about these Terms of Service, please contact us at:',
    email: 'legal@eduwarnnepal.com',
    
    disclaimer: 'Important Disclaimer',
    disclaimerContent: 'The information provided on EduWarn Nepal is for educational purposes only. It is not intended as a substitute for professional advice. Always consult with qualified professionals for important decisions.',
  },
  ne: {
    title: 'सेवा की शर्तें',
    lastUpdated: 'अन्तिम अपडेट: जनवरी २०२४',
    introduction: 'EduWarn नेपालमा स्वागत छ। यी सेवा की शर्तें हाम्रो प्ल्याटफर्म र सेवा का उपयोग को नियन्त्रण गर्छन्। EduWarn नेपाल पहुँच गरेर र उपयोग गरेर, आप स्वीकार गर्नु भएको छ र यी शर्तहरु द्वारा बाध्य हुन सहमत हुनु भएको छ।',
    
    section1: 'उपयोग लाइसेंस',
    section1Content: 'EduWarn नेपाल को प्ल्याटफर्ममा सामग्री (जानकारी वा सफ्टवेयर) को अस्थायी डाउनलोड गर्न एक प्रतिलिपि ব्यक्तिगत, गैर-व्यावसायिक क्षणिक देखने को लागी अनुमति दी गई छ। यह एक लाइसेंस का अनुदान है, शीर्षक का हस्तांतरण नहीं है, और इस लाइसेंस के तहत आप नहीं कर सकते:',
    section1Items: [
      'सामग्री को संशोधित वा प्रतिलिपि गर्नु',
      'किसी भी व्यावसायिक उद्देश्य के लिए या किसी सार्वजनिक प्रदर्शन के लिए सामग्री का उपयोग गर्नु',
      'प्ल्याटफार्म पर निहित किसी भी सॉफ़्टवेयर को विघटित करने या रिवर्स इंजीनियर करने का प्रयास गर्नु',
      'सामग्री से किसी भी कॉपीराइट या अन्य मालिकाना नोटेशन को हटाउनु',
      'सामग्री को किसी अन्य व्यक्ति को हस्तांतरित गर्नु वा सामग्री को किसी अन्य सर्वर पर "मिरर" गर्नु',
      'कोई भी लागू कानून या नियम को उल्लंघन गर्नु',
    ],
    
    section2: 'उपयोगकर्ता आचरण',
    section2Content: 'आप सहमत हुनु भएको छ कि आप नहीं गर्नु भएको:',
    section2Items: [
      'किसी भी आचरण में संलग्न होना जो किसी का प्ल्याटफार्म का उपयोग या आनंद को प्रतिबंधित या बाधित करे',
      'कोई भी हानिकारक, अपमानजनक, वा अश्लील सामग्री पोस्ट वा ट्रांसमिट गर्नु',
      'हाम्रो सिस्टम वा नेटवर्क को अनधिकृत पहुँच प्राप्त करने का प्रयास गर्नु',
      'प्ल्याटफार्म के सही कार्यप्रवाह में हस्तक्षेप गर्नु',
      'वायरस वा कोई अन्य दुर्भावनापूर्ण कोड अपलोड वा ट्रांसमिट गर्नु',
      'किसी भी व्यक्ति वा इकाई का प्रतिरूप गर्नु',
      'किसी भी बौद्धिक संपत्ति अधिकार का उल्लंघन गर्नु',
    ],
    
    section3: 'बौद्धिक संपत्ति',
    section3Content: 'EduWarn नेपाल पर सभी सामग्री, पाठ, ग्राफिक्स, लोगो, छवि, और सॉफ़्टवेयर सहित, EduWarn नेपाल या उसके सामग्री आपूर्तिकर्ता की संपत्ति है और कॉपीराइट कानूनों द्वारा संरक्षित है। आप हमारी अनुमति के बिना कोई भी सामग्री को पुनरुत्पादित, वितरित, या ट्रांसमिट नहीं कर सकते।',
    
    section4: 'उपयोगकर्ता खाते',
    section4Content: 'जब आप एक खाता बनाते हैं, तो आप अपने पासवर्ड और खाता जानकारी की गोपनीयता बनाए रखने के लिए जिम्मेदार होते हैं। आप अपने खाते के तहत होने वाली सभी गतिविधियों की जिम्मेदारी स्वीकार करने के लिए सहमत हैं। पंजीकरण के दौरान आप सटीक और पूर्ण जानकारी प्रदान गर्नु को सहमत हुनु भएको छ।',
    
    section5: 'शैक्षणिक सामग्री',
    section5Content: 'EduWarn नेपाल व्यक्तिगत शिक्षण उद्देश्यों के लिए शैक्षणिक सामग्री प्रदान करता है। जबकि हम सटीक जानकारी प्रदान करने का प्रयास करते हैं, हम सामग्री की सटीकता, पूर्णता, या प्रयोज्यता की गारंटी नहीं देते। शैक्षणिक निर्णय व्यावसायिक मार्गदर्शन के साथ किए जाने चाहिए।',
    
    section6: 'दायित्व की सीमा',
    section6Content: 'किसी भी परिस्थिति में EduWarn नेपाल प्ल्याटफार्म के उपयोग या उपयोग में असमर्थता से उत्पन्न किसी भी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी, या दंडात्मक क्षति के लिए जिम्मेदार नहीं होगा, भले ही हमें इस तरह के नुकसान की संभावना से अवगत कराया गया हो।',
    
    section7: 'क्षतिपूर्ति',
    section7Content: 'आप EduWarn नेपाल, इसके अधिकारियों, निदेशकों, और कर्मचारियों को इन शर्तों के उल्लंघन या किसी भी लागू कानूनों के उल्लंघन से उत्पन्न होने वाले किसी भी दावे, नुकसान, या लागत से बचाने के लिए सहमत हुनु भएको छ।',
    
    section8: 'समाप्ति',
    section8Content: 'EduWarn नेपाल ऐसी आचरण के लिए तुरंत, पूर्व नोटिस के बिना, आपके खाते को समाप्त या निलंबित करने का अधिकार सुरक्षित रखता है जो हम मानते हैं कि ये शर्तें हैं या अन्य उपयोगकर्ताओं को हानिकारक है।',
    
    section9: 'शर्तों में परिवर्तन',
    section9Content: 'EduWarn नेपाल किसी भी समय इन सेवा की शर्तों को संशोधित कर सकता है। संशोधित शर्तों के पोस्टिंग के बाद प्ल्याटफार्म का जारी उपयोग मतलब है कि आप परिवर्तनों को स्वीकार और सहमत हैं।',
    
    section10: 'लागू कानून',
    section10Content: 'ये सेवा की शर्तें और सभी संबंधित समझौते नेपाल के कानूनों द्वारा शासित और निर्मित हैं, इसके संघर्ष कानून प्रावधानों के बिना।',
    
    section11: 'संपर्क',
    section11Content: 'यदि आपको इन सेवा की शर्तों के बारे में प्रश्न हैं, तो कृपया हमसे संपर्क करें:',
    email: 'legal@eduwarnnepal.com',
    
    disclaimer: 'महत्वपूर्ण अस्वीकरण',
    disclaimerContent: 'EduWarn नेपाल पर दी गई जानकारी केवल शैक्षणिक उद्देश्यों के लिए है। यह व्यावसायिक सलाह के लिए एक विकल्प के रूप में नहीं माना जाता है। महत्वपूर्ण निर्णयों के लिए हमेशा योग्य व्यावसायिकों से परामर्श लें।',
  },
};

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Scale className="w-16 h-16 mx-auto mb-4 text-red-200" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">{t.title}</h1>
          <p className="text-lg text-red-100">{t.lastUpdated}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <p className="text-lg mb-12 text-gray-700 leading-relaxed">{t.introduction}</p>

        {/* Section 1 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section1}</h2>
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
            <FileText className="w-6 h-6 text-red-600" />
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
          <p className="text-gray-700">{t.section5Content}</p>
        </Card>

        {/* Section 6 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section6}</h2>
          <p className="text-gray-700">{t.section6Content}</p>
        </Card>

        {/* Section 7 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section7}</h2>
          <p className="text-gray-700">{t.section7Content}</p>
        </Card>

        {/* Section 8 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section8}</h2>
          <p className="text-gray-700">{t.section8Content}</p>
        </Card>

        {/* Section 9 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section9}</h2>
          <p className="text-gray-700">{t.section9Content}</p>
        </Card>

        {/* Section 10 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section10}</h2>
          <p className="text-gray-700">{t.section10Content}</p>
        </Card>

        {/* Section 11 */}
        <Card className="p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4">{t.section11}</h2>
          <p className="text-gray-700 mb-2">{t.section11Content}</p>
          <a href={`mailto:${t.email}`} className="text-red-600 font-bold hover:underline">
            {t.email}
          </a>
        </Card>

        {/* Disclaimer */}
        <Card className="p-8 border-2 border-yellow-300 bg-yellow-50">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            {t.disclaimer}
          </h2>
          <p className="text-gray-700">{t.disclaimerContent}</p>
        </Card>
      </section>
    </div>
  );
}
