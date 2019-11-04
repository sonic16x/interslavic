export type Gender = 'masculine' | 'feminine' | 'neuter' | 'masculine or feminine';

function getArr(str) {
    return str.replace(/ /g, '').split('.');
}

export function getGender(details: string): Gender {
    if (details.includes('m./f.')) {
        return 'masculine or feminine';
    }
    const arr = getArr(details);
    if (arr.includes('m')) {
        return 'masculine';
    }
    if (arr.includes('f')) {
        return 'feminine';
    }
    return 'neuter';
}

export function isPlural(details: string): boolean {
    return getArr(details).includes('pl');
}

export function isSingular(details: string): boolean {
    return getArr(details).includes('sg');
}

export function isAnimated(details: string): boolean {
    return getArr(details).includes('anim');
}

export function isIndeclinable(details: string): boolean {
    return getArr(details).includes('indecl');
}

export function getNumeralType(details: string): string {
    const arr = getArr(details);

    if (arr.includes('card')) {
        return 'cardinal';
    }

    if (arr.includes('coll')) {
        return 'collective';
    }

    if (arr.includes('fract')) {
        return 'fractional';
    }

    if (arr.includes('subst')) {
        return 'substantivized';
    }

    if (arr.includes('diff')) {
        return 'differential';
    }

    if (arr.includes('mult')) {
        return 'multiplicative';
    }

    if (arr.includes('ord')) {
        return 'ordinal';
    }
}

export function getPronounType(details: string): string {
    const arr = getArr(details);

    if (arr.includes('pers')) {
        return 'personal';
    }

    if (arr.includes('dem')) {
        return 'demonstrative';
    }

    if (arr.includes('indef')) {
        return 'indefinite';
    }

    if (arr.includes('refl')) {
        return 'reflexive';
    }

    if (arr.includes('rel')) {
        return 'relative';
    }

    if (arr.includes('poss')) {
        return 'possessive';
    }

    if (arr.includes('int')) {
        return 'interrogative';
    }
}

// + adj - adjective - прилагательное
// + adv - adverb - наречие
// + conj - conjunction - союз
// + f - feminine noun - существительное женского рода
// + i - imperfective verb - несовершенный глагол (что делать?)
// + intj - interjection - междометие
// + iv - intransitive verb - непереходный глагол
// + m - inanimate masculine noun - существительное мужского рода неодушевлённое
// + m anim - animate masculine noun - существительное мужского рода одушевлённое
// - mv - modal (auxiliary) verb - модальный глагол
// + n - noun; neuter noun - существительное среднего рода
// - p - perfective verb - совершенный глагол (что сделать?)
// + pl - plural - множественное число
// + prep - preposition - предлог
// + pron - pronoun - местоимение
// - tv - transitive verb - переходный глагол

export type VerbType = 'imperfective' | 'intransitive' | 'modal' | 'perfective' | 'transitive';

export function getVerbType(details: string): VerbType {
    const arr = getArr(details);
    if (arr.includes('i')) {
        return 'imperfective';
    }

    if (arr.includes('iv')) {
        return 'intransitive';
    }

    if (arr.includes('mv')) {
        return 'modal';
    }

    if (arr.includes('p')) {
        return 'perfective';
    }

    if (arr.includes('tv')) {
        return 'transitive';
    }
}

export type PartOfSpeech =
    'adjective' |
    'noun' |
    'adverb' |
    'conjunction' |
    'preposition' |
    'pronoun' |
    'interjection' |
    'verb' |
    'numeral'
;

export function getPartOfSpeech(details: string): PartOfSpeech {
    const arr = getArr(details);
    if (arr.includes('adj')) {
        return 'adjective';
    }
    if (
        arr.includes('f') ||
        arr.includes('n') ||
        arr.includes('m')
    ) {
        return 'noun';
    }
    if (arr.includes('adv')) {
        return 'adverb';
    }
    if (arr.includes('conj')) {
        return 'conjunction';
    }
    if (arr.includes('prep')) {
        return 'preposition';
    }
    if (arr.includes('pron')) {
        return 'pronoun';
    }
    if (arr.includes('num')) {
        return 'numeral';
    }
    if (arr.includes('intj')) {
        return 'interjection';
    }
    if (
        arr.includes('i') ||
        arr.includes('iv') ||
        arr.includes('mv') ||
        arr.includes('p') ||
        arr.includes('v') ||
        arr.includes('tv')
    ) {
        return 'verb';
    }

}
