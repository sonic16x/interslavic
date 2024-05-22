import {
    getGender,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    getVerbDetails,
    isAnimated,
    isComparative,
    isIndeclinable,
    isPlural,
    isSingular,
    isSuperlative
} from "../wordDetails";

const t = (s: string) => s;

export function expandAbbr(abbr: string): string[] {
    const pos = getPartOfSpeech(abbr);
    if (!pos) {
        return [];
    }

    const arr = [t(pos)];
    switch (pos) {
        case 'noun': {
            const gender = getGender(abbr);
            const animated = isAnimated(abbr);
            arr.push(t('noun-' + gender));
            if (gender.startsWith('masculine')) {
                arr.push(t(animated ? 'noun-animated' : 'noun-inanimate'));
            }
            if (isIndeclinable(abbr)) {
                arr.push(t('noun-indeclinable'));
            }
            if (isPlural(abbr)) {
                arr.push(t('noun-plural'));
            }
            if (isSingular(abbr)) {
                arr.push(t('noun-singular'));
            }
            break;
        }
        case 'adjective': {
            if (isComparative(abbr)) {
                arr.push(t('comparative-degree'));
            } else if (isSuperlative(abbr)) {
                arr.push(t('superlative-degree'));
            }
            break;
        }
        case 'verb': {
            const verbDetails = getVerbDetails(abbr);
            if (verbDetails) {
                arr.push(...verbDetails.map((e) => t('verb-' + e)));
            }
            break;
        }
        case 'numeral': {
            const numeralType = getNumeralType(abbr);
            if (numeralType) {
                arr.push(t('numeral-' + numeralType));
            }
            break;
        }
        case 'pronoun': {
            const pronounType = getPronounType(abbr);
            if (pronounType) {
                arr.push(t('pronoun-' + pronounType));
            }
            break;
        }
    }

    return arr;
}
