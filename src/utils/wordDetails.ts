export type Gender = 'masculine' | 'feminine' | 'neuter';

function getArr(str) {
    return str.replace(/ /g, '').split('.');
}

export function getGender(details: string): Gender {
    const arr = getArr(details);
    if (arr.indexOf('m') !== -1) {
        return 'masculine';
    }
    if (arr.indexOf('f') !== -1) {
        return 'feminine';
    }
    return 'neuter';
}

export function isPlural(details: string): boolean {
    return getArr(details).indexOf('pl') !== -1;
}

export function isAnimated(details: string): boolean {
    return getArr(details).indexOf('anim') !== -1;
}

export function isIndeclinable(details: string): boolean {
    return getArr(details).indexOf('indecl') !== -1;
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
    if (arr.indexOf('i') !== -1) {
        return 'imperfective';
    }

    if (arr.indexOf('iv') !== -1) {
        return 'intransitive';
    }

    if (arr.indexOf('mv') !== -1) {
        return 'modal';
    }

    if (arr.indexOf('p') !== -1) {
        return 'perfective';
    }

    if (arr.indexOf('tv') !== -1) {
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
    'verb'
;

export function getPartOfSpeech(details: string): PartOfSpeech {
    const arr = getArr(details);
    if (arr.indexOf('adj') !== -1) {
        return 'adjective';
    }
    if (
        arr.indexOf('f') !== -1 ||
        arr.indexOf('n') !== -1 ||
        arr.indexOf('m') !== -1
    ) {
        return 'noun';
    }
    if (arr.indexOf('adv') !== -1) {
        return 'adverb';
    }
    if (arr.indexOf('conj') !== -1) {
        return 'conjunction';
    }
    if (arr.indexOf('prep') !== -1) {
        return 'preposition';
    }
    if (arr.indexOf('pron') !== -1) {
        return 'pronoun';
    }
    if (arr.indexOf('intj') !== -1) {
        return 'interjection';
    }
    if (
        arr.indexOf('i') !== -1 ||
        arr.indexOf('iv') !== -1 ||
        arr.indexOf('mv') !== -1 ||
        arr.indexOf('p') !== -1 ||
        arr.indexOf('v') !== -1 ||
        arr.indexOf('tv') !== -1
    ) {
        return 'verb';
    }

}
