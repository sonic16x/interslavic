import translations from 'translations/data.json';
let currentLang;

export function t(key) {
    if (translations[key] && translations[key][currentLang]) {
        return translations[key][currentLang];
    } else if(translations[key].en) {
        return translations[key].en;
    } else {
        return key;
    }
}


export function setLang(lang) {
    // console.log(translations);
    currentLang = lang;
}
