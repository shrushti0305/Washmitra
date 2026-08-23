import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'MR' | 'HI';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    training: 'Training',
    impact: 'Impact',
    contact: 'Contact',
    tagline: 'Supporting Rural Resilience',
    heroTitleLine1: 'Real people,',
    heroTitleLine2: 'real skills,',
    heroTitleLine3: 'real impact.',
    heroDesc: 'We train and deploy local technicians to maintain critical water and sanitation infrastructure across India\'s villages.',
    contactUs: 'Contact Us',
    exploreTraining: 'Explore Training',
    becomeMitra: 'Become a WASH Mitra',
    downloadBrief: 'Download Impact Brief (PDF)',
    getInTouch: 'Get in Touch',
    callHelpline: 'Call Helpline',
    chatWhatsapp: 'Chat on WhatsApp',
    whoWeAre: 'Who We Are',
    ourImpact: 'Our Impact',
    leadership: 'Leadership',
  },
  MR: {
    home: 'मुख्यपृष्ठ',
    about: 'आमच्याबद्दल',
    services: 'सेवा',
    training: 'प्रशिक्षण',
    impact: 'प्रभाव',
    contact: 'संपर्क',
    tagline: 'ग्रामीण विकास आणि सक्षमीकरण',
    heroTitleLine1: 'खरे लोक,',
    heroTitleLine2: 'खरी कौशल्ये,',
    heroTitleLine3: 'खरा प्रभाव.',
    heroDesc: 'आम्ही भारतातील गावांमध्ये पाणी व स्वच्छता पायाभूत सुविधांच्या देखभालीसाठी स्थानिक तंत्रज्ञांना प्रशिक्षित व तैनात करतो.',
    contactUs: 'आमच्याशी संपर्क साधा',
    exploreTraining: 'प्रशिक्षण पहा',
    becomeMitra: 'वाश मित्र बना',
    downloadBrief: 'प्रभाव अहवाल डाऊनलोड करा (PDF)',
    getInTouch: 'संपर्क साधा',
    callHelpline: 'हेल्पलाइनवर कॉल करा',
    chatWhatsapp: 'व्हॉट्सॲपवर चॅट करा',
    whoWeAre: 'आम्ही कोण आहोत',
    ourImpact: 'आमचा प्रभाव',
    leadership: 'नेतृत्व टीम',
  },
  HI: {
    home: 'मुख्यपृष्ठ',
    about: 'हमारे बारे में',
    services: 'सेवाएं',
    training: 'प्रशिक्षण',
    impact: 'प्रभाव',
    contact: 'संपर्क',
    tagline: 'ग्रामीण विकास और सशक्तिकरण',
    heroTitleLine1: 'सच्चे लोग,',
    heroTitleLine2: 'सच्चे कौशल,',
    heroTitleLine3: 'सच्चा प्रभाव।',
    heroDesc: 'हम भारत के गांवों में जल और स्वच्छता बुनियादी ढांचे के रखरखाव के लिए स्थानीय तकनीशियनों को प्रशिक्षित और तैनात करते हैं।',
    contactUs: 'हमसे संपर्क करें',
    exploreTraining: 'प्रशिक्षण देखें',
    becomeMitra: 'वाश मित्र बनें',
    downloadBrief: 'प्रभाव रिपोर्ट डाउनलोड करें (PDF)',
    getInTouch: 'संपर्क करें',
    callHelpline: 'हेल्पलाइन पर कॉल करें',
    chatWhatsapp: 'व्हाट्सएप पर चैट करें',
    whoWeAre: 'हम कौन हैं',
    ourImpact: 'हमारा प्रभाव',
    leadership: 'नेतृत्व टीम',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('washmitra_lang') as Language) || 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('washmitra_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
