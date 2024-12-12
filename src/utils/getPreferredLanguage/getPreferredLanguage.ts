import { EN,interfaceLanguageList } from 'consts'

import { intersection } from 'utils'

const supportedLanguages = interfaceLanguageList.map(item => item.value)

export function getPreferredLanguage(): string {
    if (typeof navigator === 'undefined' || !navigator.languages) {
        return EN
    }

    const languages = navigator.languages.map(getPrimaryTag)
    const relevantLanguages = intersection(languages, supportedLanguages)

    return relevantLanguages.length > 0 ? relevantLanguages[0] : EN
}

function getPrimaryTag(languageCode: string): string {
    return languageCode.split('-', 1)[0]
}
