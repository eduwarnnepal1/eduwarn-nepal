"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ne"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string | { en: string; ne: string }) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.courses": "Courses",
    "nav.forum": "Forum",
    "nav.blog": "Blog",
    "nav.resources": "Resources",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "hero.title": "Empowering Nepali Students for a Brighter Future",
    "hero.subtitle": "Join our community of learners, access premium resources, and get career guidance from experts.",
    "hero.cta": "Get Started",
    "hero.courses": "Browse Courses",
    "stats.students": "Students",
    "stats.courses": "Courses",
    "stats.mentors": "Mentors",
    "footer.rights": "All rights reserved.",
  },
  ne: {
    "nav.home": "गृहपृष्ठ",
    "nav.courses": "कोर्सहरू",
    "nav.forum": "फोरम",
    "nav.blog": "ब्लग",
    "nav.resources": "स्रोतहरू",
    "nav.login": "लगइन",
    "nav.signup": "साइन अप",
    "hero.title": "नेपाली विद्यार्थीहरूलाई उज्ज्वल भविष्यको लागि सशक्त बनाउँदै",
    "hero.subtitle":
      "हाम्रो सिकाउने समुदायमा सामेल हुनुहोस्, प्रिमियम स्रोतहरू प्राप्त गर्नुहोस्, र विशेषज्ञहरूबाट करियर मार्गदर्शन लिनुहोस्।",
    "hero.cta": "सुरु गर्नुहोस्",
    "hero.courses": "कोर्सहरू हेर्नुहोस्",
    "stats.students": "विद्यार्थीहरू",
    "stats.courses": "कोर्सहरू",
    "stats.mentors": "मेन्टरहरू",
    "footer.rights": "सबै अधिकार सुरक्षित।",
  },
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("eduwarn-lang") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ne")) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("eduwarn-lang", lang)
  }

  const t = (key: string | { en: string; ne: string }) => {
    if (typeof key === "object") {
      return key[language] || key.en
    }
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
