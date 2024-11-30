export function estimateIntelligibility(sameInLanguages: string): IntelligibilityVector | null {
    if (!sameInLanguages || sameInLanguages === '!') {
        return null
    }

    const splitLangs = sameInLanguages.split(' ')
    const integrity = splitLangs.reduce<IntelligibilityVector>((acc, tag) => add(acc, score_max(tag)), [0, 0, 0])
    const vector = splitLangs.reduce<IntelligibilityVector>((acc, tag) => add(acc, score(tag)), [0, 0, 0])

    return check_integrity(integrity) ? vector : null
}

export type IntelligibilityVector = [number, number, number];

const REGEXP = /^!?(\w+)(.?)/

const LANGUAGE_WEIGHTS = {
    ru: [0, 0, 1],
    be: [0, 0, 0.5],
    uk: [0, 0, 0.5],
    pl: [1, 0, 0],
    cs: [0.5, 0, 0],
    sk: [0.5, 0, 0],
    bg: [0, 0.5, 0],
    mk: [0, 0.5, 0],
    sl: [0, 0.5, 0],
    sr: [0, 0.25, 0],
    hr: [0, 0.25, 0],
    '': [0, 0, 0],
}

function score_max(tag: string): IntelligibilityVector {
    const [, lang] = tag.match(REGEXP) || []

    return LANGUAGE_WEIGHTS[lang] || LANGUAGE_WEIGHTS['']
}

function score(tag: string): IntelligibilityVector {
    const [, lang, mark] = tag.match(REGEXP) || []

    return multiply(LANGUAGE_WEIGHTS[lang] || LANGUAGE_WEIGHTS[''], getCoefficient(mark))
}

function check_integrity([western, southern, eastern]: IntelligibilityVector): boolean {
    return western === 2 && southern === 2 && eastern === 2
}

function multiply(vector: IntelligibilityVector, coefficient: number): IntelligibilityVector {
    return vector.map((value) => value * coefficient) as IntelligibilityVector
}

function add(vector1: IntelligibilityVector, vector2: IntelligibilityVector): IntelligibilityVector {
    return vector1.map((value, index) => value + vector2[index]) as IntelligibilityVector
}

function getCoefficient(mark: string) {
    if (!mark || mark === '+') {
        return 1
    }

    if (mark === '-') {
        return 0
    }

    return 0.5
}
