const translations = {};
let currentLang;

export function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    } else {
        return key;
    }
}

export async function setLang(lang) {
    if (!translations[lang]) {
        translations[lang] = await import(`./data/${lang}.json`);
    }
    currentLang = lang;
}
