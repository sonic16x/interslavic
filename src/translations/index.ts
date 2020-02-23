import translations from 'translations/data.json';
import { latinToGla } from 'utils/latinToGla';
import { getCyrillic } from 'utils/getCyrillic';
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
            case 'latn':
                return translations[key].isv;
            case 'cyrl':
                return getCyrillic(translations[key].isv, '3');
            case 'glag':
                return latinToGla(translations[key].isv);
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
