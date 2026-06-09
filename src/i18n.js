import i18n from 'i18next';
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Nova's Legacy",
            "mission_title": "Support the Mission"
        }
    },
    it: {
        translation: {
            "welcome": "Benvenuto su Nova's Legacy",
            "mission_title": "Supporta la Missione"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export const detectLocationAndLanguage = async() => {
    try{
        const response = await fetch('https://ipai.co/json/');
        const data = await response.json();
        if(data.country_code === 'IT'){
            i18n.changeLanguage('it');
        }
        else{
            i18n.changeLanguage('en');
        }
    }
    catch(error){
        console.error("Impossible to locate position, using default language", error);
    }
}

export default i18n;