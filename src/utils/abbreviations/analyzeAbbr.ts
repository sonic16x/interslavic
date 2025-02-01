import {
    getGender,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    getVerbDetails,
    isAnimate,
    isComparative,
    isIndeclinable,
    isPlural,
    isSingular,
    isSuperlative
} from 'utils'

import { t } from 'translations'

export function analyzeAbbr(abbr: string): string[] {
    const pos = getPartOfSpeech(abbr)
    if (!pos) {
        return []
    }

    const arr: string[] = [pos]
    switch (pos) {
        case 'noun': {
            const gender = getGender(abbr)
            const animate = isAnimate(abbr)
            arr.push('noun-' + gender)
            if (gender.startsWith('masculine')) {
                arr.push(animate ? 'noun-animate' : 'noun-inanimate')
            }
            if (isIndeclinable(abbr)) {
                arr.push('noun-indeclinable')
            }
            if (isPlural(abbr)) {
                arr.push('noun-plural')
            }
            if (isSingular(abbr)) {
                arr.push('noun-singular')
            }
            break
        }
        case 'adjective': {
            if (isComparative(abbr)) {
                arr.push('comparative-degree')
            } else if (isSuperlative(abbr)) {
                arr.push('superlative-degree')
            }
            break
        }
        case 'verb': {
            const verbDetails = getVerbDetails(abbr)
            if (verbDetails) {
                arr.push(...verbDetails.map(e => 'verb-' + e))
            }
            break
        }
        case 'numeral': {
            const numeralType = getNumeralType(abbr)
            if (numeralType) {
                arr.push('numeral-' + numeralType)
            }
            break
        }
        case 'pronoun': {
            const pronounType = getPronounType(abbr)
            if (pronounType) {
                arr.push('pronoun-' + pronounType)
            }
            break
        }
    }

    return arr
}
