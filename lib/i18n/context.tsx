'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import en, { type TranslationKey } from './en'
import vi from './vi'

type Lang = 'en' | 'vi'

const translations = { en, vi } as const

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => en[key],
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('nucleargo_lang')
    if (stored === 'en' || stored === 'vi') {
      setLangState(stored)
    }
  }, [])

  function setLang(newLang: Lang) {
    localStorage.setItem('nucleargo_lang', newLang)
    setLangState(newLang)
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations.en[key]
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
