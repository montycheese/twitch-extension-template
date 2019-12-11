import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as enUS from './en-US.json';
import { isProduction } from '../util/HelperFunctions';

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: enUS
      },
      /* de: {
        translations: {}
      } */
    },
    lng: _detectViewerLanguage(),
    fallbackLng: 'en',
    debug: !isProduction(),

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;


// of the format
// http://localhost:8080/video_overlay.html?anchor=video_overlay&language=en&locale=en-US&mode=viewer&state=testing&platform=web
function _detectViewerLanguage() {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get('language');
}
