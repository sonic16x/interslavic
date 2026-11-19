import { getPartOfSpeech, removeBrackets } from 'utils'

export function wordHasForms(isvRaw: string, details: string) {
    const pos = getPartOfSpeech(details)
    // marks in parentheses, "(1)", "(+2)", "(na)", are not part of the lemma
    const isv = removeBrackets(isvRaw, '(', ')')

    switch (pos) {
        case 'noun':
        case 'numeral':
        case 'pronoun':
            if (isv.includes(' ') && isv.match(/[^,] [^\[]/)) {
                return false
            }
        case 'adjective':
        case 'verb':
            return true
        default:
            return false
    }
}
