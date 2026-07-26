const REGEXP = /^!?(\w+)(.?)/

export type IntelligibilityMark = '+' | '~' | '-'

const MARKS: IntelligibilityMark[] = ['+', '~', '-']

const EMPTY_MARKS: Record<string, IntelligibilityMark> = {}

/**
 * Parses the raw `intelligibility` field (e.g. `!be~ pl+ ru-`) into a map
 * of language code to its mark. Languages without an explicit mark are omitted,
 * so a missing key means "no data" rather than "not intelligible".
 */
export function getIntelligibilityMarks(intelligibility: string): Record<string, IntelligibilityMark> {
    const result = (intelligibility || '').split(' ').reduce((acc, tag) => {
        const [, lang, mark] = tag.match(REGEXP) || []
        if (lang && MARKS.includes(mark as IntelligibilityMark)) {
            acc[lang] = mark as IntelligibilityMark
        }

        return acc
    }, {} as Record<string, IntelligibilityMark>)

    return Object.keys(result).length ? result : EMPTY_MARKS
}

/**
 * Tells whether a word is worth showing to a speaker of every target language.
 * A word survives when the language either has no data at all, or is marked
 * as fully (`+`) or partially (`~`) intelligible.
 */
export function isIntelligibleInLanguages(intelligibility: string, targetLangs: string[]): boolean {
    if (!targetLangs.length) {
        return true
    }

    const marks = getIntelligibilityMarks(intelligibility)

    return targetLangs.every((lang) => marks[lang] !== '-')
}

/**
 * Returns the target languages where the word is only partially intelligible (`~`),
 * i.e. the ones worth a warning sign on the card.
 */
export function getPartlyIntelligibleLanguages(intelligibility: string, targetLangs: string[]): string[] {
    if (!targetLangs.length) {
        return []
    }

    const marks = getIntelligibilityMarks(intelligibility)

    return targetLangs.filter((lang) => marks[lang] === '~')
}

/**
 * Returns the target languages the word has no intelligibility data for.
 * Such words are kept in the results, but they are worth a question mark on the card.
 */
export function getUnknownIntelligibilityLanguages(intelligibility: string, targetLangs: string[]): string[] {
    if (!targetLangs.length) {
        return []
    }

    const marks = getIntelligibilityMarks(intelligibility)

    return targetLangs.filter((lang) => !marks[lang])
}
