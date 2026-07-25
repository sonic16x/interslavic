import { getIntelligibilityMarks, IntelligibilityMark } from './intelligibilityMarks'

const EMPTY = {}

const EMOJI: Record<IntelligibilityMark, string> = {
    '-': '🚫',
    '~': '⚠️',
    '+': '✅',
}

export function findIntelligibilityIssues(sameInLanguages: string): Record<string, string> {
    const marks = getIntelligibilityMarks(sameInLanguages)
    const result = Object.entries(marks).reduce((acc, [lang, mark]) => {
        acc[lang] = EMOJI[mark]

        return acc
    }, {})

    return Object.keys(result).length ? result : EMPTY
}
