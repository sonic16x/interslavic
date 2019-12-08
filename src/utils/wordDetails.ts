/*
    n.	neuter noun
    m. anim.	animate masculine noun
    m.	inanimate masculine noun
    f.	feminine noun
    pl.	only plural
    sg.	only singular
    indecl.	indeclinable
    num.	numeral
    card.	cardinal
    coll.	collective
    fract.	fractional
    subst.	substantivized
    diff.	differential
    mult.	multiplicative
    ord.	ordinal
    pron.	pronoun
    pers.	personal
    dem.	demonstrative
    indef.	indefinite
    refl.	reflexive
    rel.	relative
    poss.	possessive
    int.	interrogative
    v.	verb
    ipf.	imperfective
    pf.	perfective
    intr.	intransitive
    tr.	transitive
    refl.	reflective
    aux.	auxiliar
    adj.	adjective
    adv	adverb
    conj.	conjunction
    prep.	preposition
    intj.	interjection
    prefix	prefix
 */

function getArr(str) {
    return str
        .replace(/\.\//g, '/')
        .replace(/ /g, '')
        .split('.');
}

// Get Part Of Speech

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
        arr.includes('m') ||
        arr.includes('m/f')
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
    if (arr.includes('v')) {
        return 'verb';
    }

}

// Nouns

export type Gender = 'masculine' | 'feminine' | 'neuter' | 'masculine or feminine';

export function getGender(details: string): Gender {
    const arr = getArr(details);
    if (arr.includes('m')) {
        return 'masculine';
    }
    if (arr.includes('f')) {
        return 'feminine';
    }
    if (arr.includes('m/f')) {
        return 'masculine or feminine';
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

// Numerals

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

// Pronouns

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

// Verbs

export type VerbType = 'intransitive' | 'transitive' | 'auxiliar' | 'reflective' | 'imperfective' | 'perfective' | 'imperfective / perfective';

export function getVerbDetails(details: string): VerbType[] {
    return getArr(details).map((detail) => {
        switch (detail) {
            case 'intr':
                return 'intransitive';
            case 'tr':
                return 'transitive';
            case 'aux':
                return 'auxiliar';
            case 'refl':
                return 'reflective';
            case 'ipf':
                return 'imperfective';
            case 'pf':
                return 'perfective';
            case 'ipf/pf':
                return 'imperfective / perfective';
            default:
                return '';
        }
    }).filter((detail) => detail !== '');
}
