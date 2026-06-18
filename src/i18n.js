import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const cachedContent = (()=> {
    try { return JSON.parse(localStorage.getItem('nl_content')) || {} } catch { return {}}
})()

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: cachedContent },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
