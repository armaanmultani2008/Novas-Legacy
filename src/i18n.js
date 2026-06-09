import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import it from './locales/it.json'
import en from './locales/en.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      it: { translation: it },
      en: { translation: en },
    },
    lng: 'it',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export const detectLocationAndLanguage = async () => {
  try {
    const res = await fetch('https://ipai.co/json/')
    const data = await res.json()
    i18n.changeLanguage(data.country_code === 'IT' ? 'it' : 'en')
  } catch {
    // fallback: keep default language
  }
}

export default i18n
