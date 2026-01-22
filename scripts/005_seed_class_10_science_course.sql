-- Insert Class 10 Science Course
INSERT INTO public.courses (title_en, title_ne, description_en, description_ne, level, created_at, updated_at)
VALUES (
  'Class 10 Science',
  'कक्षा १० विज्ञान',
  'Comprehensive Science curriculum for Class 10 covering Physics, Chemistry, and Biology',
  'कक्षा १० को लागि व्यापक विज्ञान पाठ्यक्रम जसमा भौतिकी, रसायन विज्ञान र जीवविज्ञान समावेश छ',
  'intermediate',
  NOW(),
  NOW()
) RETURNING id AS course_id \gset

-- Insert 17 Modules/Chapters
INSERT INTO public.modules (course_id, title_en, title_ne, description_en, description_ne, module_number, created_at, updated_at)
VALUES
  (:'course_id', 'Heat and Temperature', 'ताप र तापमान', 'Understanding thermal energy and temperature concepts', 'ताप र तापमान अवधारणा बुझ्न', 1, NOW(), NOW()),
  (:'course_id', 'Sound', 'ध्वनि', 'Properties and behavior of sound waves', 'ध्वनि तरंगहरूको गुण र व्यवहार', 2, NOW(), NOW()),
  (:'course_id', 'Light and Optics', 'प्रकाश र प्रकाशिकी', 'Reflection, refraction, and optics fundamentals', 'परावर्तन, अपवर्तन र प्रकाशिकी मूलभूत', 3, NOW(), NOW()),
  (:'course_id', 'Electricity', 'विद्युत', 'Current, resistance, and electrical circuits', 'विद्युत प्रवाह, प्रतिरोध र विद्युत परिपथ', 4, NOW(), NOW()),
  (:'course_id', 'Magnetism', 'चुम्बकत्व', 'Magnetic fields and electromagnetic induction', 'चुम्बकीय क्षेत्र र विद्युतचुम्बकीय प्रेरण', 5, NOW(), NOW()),
  (:'course_id', 'Matter and Atoms', 'पदार्थ र परमाणु', 'Structure of atoms and periodic table', 'परमाणुको संरचना र आवर्त सारणी', 6, NOW(), NOW()),
  (:'course_id', 'Chemical Reactions', 'रासायनिक प्रतिक्रिया', 'Types of chemical reactions and equations', 'रासायनिक प्रतिक्रियाका प्रकार र समीकरण', 7, NOW(), NOW()),
  (:'course_id', 'Acids, Bases, and Salts', 'अम्ल, क्षार र लवण', 'Properties and reactions of acids, bases and salts', 'अम्ल, क्षार र लवणका गुण र प्रतिक्रिया', 8, NOW(), NOW()),
  (:'course_id', 'Carbon and Its Compounds', 'कार्बन र यसका यौगिकहरु', 'Organic chemistry fundamentals', 'जैविक रसायन विज्ञान मूलभूत', 9, NOW(), NOW()),
  (:'course_id', 'Cell Biology', 'कोशिका जीवविज्ञान', 'Cell structure and functions', 'कोशिकाको संरचना र कार्य', 10, NOW(), NOW()),
  (:'course_id', 'Reproduction', 'प्रजनन', 'Sexual and asexual reproduction', 'लैंगिक र अलैंगिक प्रजनन', 11, NOW(), NOW()),
  (:'course_id', 'Heredity and Evolution', 'आनुवंशिकता र विकास', 'Mendelian genetics and evolution', 'मेन्डेलीय आनुवंशिकता र विकास', 12, NOW(), NOW()),
  (:'course_id', 'Ecology', 'पारिस्थितिकी', 'Ecosystems and food chains', 'पारिस्थितिकी तंत्र र खाद्य श्रृंखला', 13, NOW(), NOW()),
  (:'course_id', 'Human Body Systems', 'मानव शरीर प्रणाली', 'Anatomy and physiology', 'शरीरविज्ञान र अंगविन्यास', 14, NOW(), NOW()),
  (:'course_id', 'Nutrition and Health', 'पोषण र स्वास्थ्य', 'Balanced diet and diseases', 'संतुलित आहार र रोग', 15, NOW(), NOW()),
  (:'course_id', 'Astronomy', 'खगोल विज्ञान', 'Solar system and celestial bodies', 'सौर मण्डल र आकाशीय पिण्ड', 16, NOW(), NOW()),
  (:'course_id', 'Energy and Resources', 'ऊर्जा र संसाधनहरु', 'Renewable and non-renewable resources', 'नवीकरणीय र गैर-नवीकरणीय संसाधन', 17, NOW(), NOW());

-- Get the first module ID for inserting the test lesson
SELECT id FROM public.modules WHERE course_id = :'course_id' ORDER BY module_number LIMIT 1 \gset first_module_id

-- Insert "Tips for SEE" lesson in the first module
INSERT INTO public.lessons (module_id, course_id, title_en, title_ne, introduction_en, introduction_ne, youtube_url, lesson_number, created_at, updated_at)
VALUES (
  :'first_module_id',
  :'course_id',
  'Tips for SEE',
  'SEE को लागि सुझावहरु',
  'Learn essential tips and strategies for succeeding in your Secondary Education Examination (SEE). This lesson covers preparation techniques, time management, and exam-taking strategies.',
  'माध्यमिक शिक्षा परीक्षा (SEE) मा सफल हुनको लागि आवश्यक सुझावहरु र कौशलहरु जानुहोस्। यो पाठले तयारीको विधि, समय व्यवस्थापन र परीक्षा लेखन कौशल समेट्छ।',
  'https://youtu.be/ODW6_swSO1Y?si=lzcESGULOX8wnQXz',
  1,
  NOW(),
  NOW()
) RETURNING id AS lesson_id \gset

-- Insert lesson resources (PDF notes)
INSERT INTO public.lesson_resources (lesson_id, resource_type, title_en, title_ne, resource_url, created_at)
VALUES (
  :'lesson_id',
  'pdf',
  'SEE Preparation Notes',
  'SEE तयारी नोट्स',
  'https://drive.google.com/file/d/16k6-WfsG-caY7MUX-DXOFkjRgfIeQPKT/view?usp=drivesdk',
  NOW()
);

-- Insert sample MCQs for the Tips for SEE lesson (introductory)
INSERT INTO public.mcqs (lesson_id, question_en, question_ne, option_a_en, option_a_ne, option_b_en, option_b_ne, option_c_en, option_c_ne, option_d_en, option_d_ne, correct_answer, explanation_en, explanation_ne, mcq_type)
VALUES
  (
    :'lesson_id',
    'What is the recommended daily study time for SEE preparation?',
    'SEE तयारीको लागि अनुसिद्ध दैनिक अध्ययन समय कति हो?',
    '1-2 hours', '१-२ घंटा',
    '3-4 hours', '३-४ घंटा',
    '5-6 hours', '५-६ घंटा',
    'As much as possible', 'जति सक्किन्छ',
    'b',
    'A study time of 3-4 hours daily is optimal for retaining information without burnout.',
    'दैनिक ३-४ घंटाको अध्ययन जानकारी राख्न र मानसिक दबाब नदिई इष्टतम हो।',
    'introductory'
  ),
  (
    :'lesson_id',
    'Which is NOT an effective study technique?',
    'कौन सा अध्ययन तरीका प्रभावकारी नहोइन?',
    'Active recall', 'सक्रिय स्मरण',
    'Spaced repetition', 'दूरी छोडेर दोहोरिँदा',
    'Passive reading', 'निष्क्रिय पठन',
    'Mind mapping', 'मन नक्सा',
    'c',
    'Passive reading without engagement leads to poor retention. Active learning is more effective.',
    'लगाव बिना निष्क्रिय पठनले कमजोर स्मरण गर्दछ। सक्रिय अध्ययन अधिक प्रभावकारी छ।',
    'introductory'
  ),
  (
    :'lesson_id',
    'What should be your approach on the exam day?',
    'परीक्षा दिनमा तपाईंको दृष्टिकोण के हुनुपर्छ?',
    'Answer all questions quickly', 'सबै प्रश्न छिट्टै जवाफ दिनुहोस्',
    'Read all questions first, then answer methodically', 'पहिले सबै प्रश्न पढ्नुहोस्, त्यसपछि व्यवस्थित तरिकामा जवाफ दिनुहोस्',
    'Focus only on difficult questions', 'केवल कठिन प्रश्नमा ध्यान दिनुहोस्',
    'Leave blank answers and move on', 'खाली जवाफ छोडेर आगामी जानुहोस्',
    'b',
    'Reading all questions first helps you manage time better and avoid mistakes.',
    'पहिले सबै प्रश्न पढ्नु समय ब्यवस्थापन र त्रुटि बचाउन मद्दत गर्छ।',
    'introductory'
  );

-- Insert assessment MCQs (these must score 80% to pass)
INSERT INTO public.mcqs (lesson_id, question_en, question_ne, option_a_en, option_a_ne, option_b_en, option_b_ne, option_c_en, option_c_ne, option_d_en, option_d_ne, correct_answer, explanation_en, explanation_ne, mcq_type)
VALUES
  (
    :'lesson_id',
    'How many days before the exam should major revision start?',
    'परीक्षाको कति दिन अगाडि मुख्य संशोधन सुरु हुनुपर्छ?',
    '1 day before', 'परीक्षाको १ दिन अगाडि',
    '1 week before', 'परीक्षाको १ हप्ता अगाडि',
    '2-3 weeks before', 'परीक्षाको २-३ हप्ता अगाडि',
    '1 month before', 'परीक्षाको १ महिना अगाडि',
    'c',
    '2-3 weeks gives adequate time for thorough revision without last-minute stress.',
    '२-३ हप्ताले आखिरी समयको दबाब बिना गहिरो संशोधनको पर्याप्त समय दिन्छ।',
    'assessment'
  ),
  (
    :'lesson_id',
    'Which resource is most important for exam success?',
    'परीक्षा सफलताको लागि कौन सो संसाधन सबै गुरुत्वपूर्ण छ?',
    'Past year papers', 'गत वर्षको प्रश्नपत्र',
    'Class notes only', 'कक्षा नोट्स मात्र',
    'Textbooks only', 'पाठ्यपुस्तक मात्र',
    'Coaching classes', 'कोचिङ कक्षा',
    'a',
    'Past year papers provide insight into exam patterns and frequently asked topics.',
    'गत वर्षको प्रश्नपत्रले परीक्षा पैटर्न र बारम्बार सोधिने विषय हेरफेर गर्दछ।',
    'assessment'
  ),
  (
    :'lesson_id',
    'What should be your approach to time management during exam?',
    'परीक्षा समयमा समय व्यवस्थापन गर्नको लागि कस्तो दृष्टिकोण हुनुपर्छ?',
    'Spend equal time on all questions', 'सबै प्रश्नमा बराबर समय बिताउनुहोस्',
    'Allocate time proportionally and skip difficult questions initially', 'समय आनुपातिक रुपमा बाँट्नुहोस् र सुरुमा कठिन प्रश्न छोडिदिनुहोस्',
    'Answer only the easy questions', 'केवल सहज प्रश्नको जवाफ दिनुहोस्',
    'Use all time on first few questions', 'पहिलो केही प्रश्नमा सबै समय प्रयोग गर्नुहोस्',
    'b',
    'Smart time allocation ensures you attempt all questions and maximize your score.',
    'बुद्धिमान समय बाँडाई सबै प्रश्नको प्रयास गर्न र अंक बढाउन सुनिश्चित गर्दछ।',
    'assessment'
  ),
  (
    :'lesson_id',
    'What is the most effective stress management technique during exams?',
    'परीक्षाको समयमा तनाव व्यवस्थापनको सबै प्रभावकारी विधि कस्तो हो?',
    'Worry about the results', 'परिणामको चिन्ता गर्नुहोस्',
    'Take deep breaths and focus on the present question', 'गहिरो सासेसास लिनुहोस् र वर्तमान प्रश्नमा ध्यान केन्द्रित गर्नुहोस्',
    'Discuss with other students', 'अन्य विद्यार्थीसँग कुरा गर्नुहोस्',
    'Check your watch frequently', 'बारम्बार घडी हेर्नुहोस्',
    'b',
    'Deep breathing and mindfulness help manage anxiety and improve focus.',
    'गहिरो सासेसास र मनोयोग चिन्ताको ब्यवस्थापन गर्न र ध्यान सुधार गर्दछ।',
    'assessment'
  ),
  (
    :'lesson_id',
    'When should students start their SEE preparation?',
    'विद्यार्थीले SEE तयारी कहिले सुरु गर्नुपर्छ?',
    'One month before exam', 'परीक्षाको १ महिना अगाडि',
    'Right from the beginning of the academic year', 'शैक्षणिक वर्षको शुरुआत देखै',
    'One week before exam', 'परीक्षाको १ हप्ता अगाडि',
    'After mid-term exams', 'मध्यकालीन परीक्षा पछि',
    'b',
    'Starting early allows consistent learning and reduces last-minute cramming stress.',
    'शुरुआत गरी सांत अध्ययन गर्न र आखिरी समयको दबाब कम गर्दछ।',
    'assessment'
  );
