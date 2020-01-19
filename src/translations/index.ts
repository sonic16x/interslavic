import translations from 'translations/data.json';
import { getCyrillic } from 'utils/getCyrillic';
let currentLang;

export function t(key) {
    let lang = currentLang;
    if (!translations[key]) {
        return key;
    }
    if (lang === 'isv-Cyrl') {
        lang = 'isv';
        if (translations[key][lang]) {
            return getCyrillic(translations[key][lang], '3');
        }
    }
    if (translations[key][lang]) {
        return translations[key][lang];
    }
    if (translations[key].en) {
        return translations[key].en;
    }
    return key;
}

export function setLang(lang) {
    // console.log(translations);
    currentLang = lang;
}
