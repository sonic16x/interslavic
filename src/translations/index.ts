import translations from 'translations/data.json';
import { getGlagolitic } from 'utils/getGlagolitic';
import { getCyrillic } from 'utils/getCyrillic';
import { getLatin } from '../utils/getLatin';
let currentLang;

export function t(key) {
    const [lang, alphabet] = currentLang.split('-');

    if (lang === 'isv') {
        if (!translations[key]) {
            return key;
        }

        if (!translations[key].isv && translations[key].en) {
            return translations[key].en;
        }

        switch (alphabet) {
            case 'Latn':
                return getLatin(translations[key].isv, '3');
            case 'Cyrl':
                return getCyrillic(translations[key].isv, '3');
            case 'Glag':
                return getGlagolitic(translations[key].isv, '3');
        }
    }
    if (!translations[key]) {
        return key;
    } else if (translations[key][lang]) {
        return translations[key][lang];
    } else if (translations[key].en) {
        return translations[key].en;
    } else {
        return key;
    }
}

export function setLang(lang) {
    currentLang = lang;
}
