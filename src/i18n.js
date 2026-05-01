import ar from './locales/ar.json'
import en from './locales/en.json'

export const LANGUAGE_STORAGE_KEY = 'chocolux-language'

export const dictionaries = { ar, en }

export const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

  return savedLanguage === 'ar' || savedLanguage === 'en' ? savedLanguage : 'ar'
}

export const translate = (language, key, values = {}) => {
  const dictionary = dictionaries[language] || dictionaries.en
  const fallbackDictionary = dictionaries.en
  const value = key.split('.').reduce((current, part) => current?.[part], dictionary)
  const fallback = key.split('.').reduce((current, part) => current?.[part], fallbackDictionary)
  const template = typeof value === 'string' ? value : fallback || key

  return Object.entries(values).reduce(
    (text, [name, replacement]) => text.replaceAll(`{{${name}}}`, String(replacement)),
    template,
  )
}
