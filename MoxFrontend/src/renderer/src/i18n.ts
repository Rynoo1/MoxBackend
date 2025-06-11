import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      greeting: 'Good morning',
      settings: 'Settings',
      userProfile: 'User Profile',
      editProfile: 'Edit Profile',
      save: 'Save',
      cancel: 'Cancel',
      username: 'Username',
      email: 'Email',
      preferences: 'Preferences',
      darkMode: 'Dark Mode',
      fontSize: 'Font Size',
      language: 'Language',
      highContrast: 'High Contrast'
    }
  },
  af: {
    translation: {
      greeting: 'Goeie môre',
      settings: 'Instellings',
      userProfile: 'Gebruikerprofiel',
      editProfile: 'Wysig Profiel',
      save: 'Stoor',
      cancel: 'Kanselleer',
      username: 'Gebruikersnaam',
      email: 'E-pos',
      preferences: 'Voorkeure',
      darkMode: 'Donker Modus',
      fontSize: 'Lettergrootte',
      language: 'Taal',
      highContrast: 'Hoë Kontras'
    }
  },
  zu: {
    translation: {
      greeting: 'Sawubona ekuseni',
      settings: 'Izilungiselelo',
      userProfile: 'Iphrofayela Yomsebenzisi',
      editProfile: 'Hlela Iphrofayela',
      save: 'Londoloza',
      cancel: 'Khansela',
      username: 'Igama lomsebenzisi',
      email: 'I-imeyili',
      preferences: 'Okuthandwayo',
      darkMode: 'Imodi Emnyama',
      fontSize: 'Usayizi Wombhalo',
      language: 'Ulimi',
      highContrast: 'Ukuqhathanisa Okuphezulu'
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
