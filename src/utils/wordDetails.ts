export type Gender = 'male' | 'female' | 'neuter';

export function getGender(details: string): Gender {
    if (details.indexOf('m.') !== -1) {
        return 'male';
    }
    if (details.indexOf('f.') !== -1) {
        return 'female';
    }
    return 'neuter';
}

export function isPlural(details: string): boolean {
    return details.indexOf('pl.') !== -1;
}

export function isAnimated(pos: string): boolean {
    return pos.indexOf('anim.') !== -1;
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
    if (details.indexOf('i.') !== -1) {
        return 'imperfective';
    }

    if (details.indexOf('iv.') !== -1) {
        return 'intransitive';
    }

    if (details.indexOf('mv.') !== -1) {
        return 'modal';
    }

    if (details.indexOf('p.') !== -1) {
        return 'perfective';
    }

    if (details.indexOf('tv.') !== -1) {
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
    if (details.indexOf('adj.') !== -1) {
        return 'adjective';
    }
    if (
        details.indexOf('f.') !== -1 ||
        details.indexOf('n.') !== -1 ||
        details.indexOf('m.') !== -1
    ) {
        return 'noun';
    }
    if (details.indexOf('adv.') !== -1) {
        return 'adverb';
    }
    if (details.indexOf('conj.') !== -1) {
        return 'conjunction';
    }
    if (details.indexOf('prep.') !== -1) {
        return 'preposition';
    }
    if (details.indexOf('pron.') !== -1) {
        return 'pronoun';
    }
    if (details.indexOf('intj.') !== -1) {
        return 'interjection';
    }
    if (
        details.indexOf('i.') !== -1 ||
        details.indexOf('iv.') !== -1 ||
        details.indexOf('mv.') !== -1 ||
        details.indexOf('p.') !== -1 ||
        details.indexOf('tv.') !== -1
    ) {
        return 'verb';
    }

}
