import { interfaceLanguageList } from 'services/interfaceLanguages';

import { intersection } from 'utils/intersection';

const supportedLanguages = interfaceLanguageList.map(item => item.value);

export function getPreferredLanguage(): string {
    if (typeof navigator === 'undefined' || !navigator.languages) {
        return 'en';
    }

    const languages = navigator.languages.map(getPrimaryTag);
    const relevantLanguages = intersection(languages, supportedLanguages);

    return relevantLanguages.length > 0 ? relevantLanguages[0] : 'en';
}

function getPrimaryTag(languageCode: string): string {
    return languageCode.split('-', 1)[0];
}
