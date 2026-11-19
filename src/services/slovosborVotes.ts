/**
 * Build time only (generateDictionary): Slovosbor's votes -> the `intelligibility` column, in the sheet's own
 * format "ru+ be~ uk- ...", so the card's ⚠️ reads them as it reads the sheet's marks.
 * Source -> slovosbor's public export (one row per sense × language) -> summed per row id -> one mark per language.
 */

export const VOTES_URL = 'https://slovosbor.online/api/v0/export/intelligibility.tsv'

/** the languages of the sheet's marks: all of them, or the ⚠️ does not read the row */
const MARK_LANGS = ['ru', 'be', 'uk', 'pl', 'cs', 'sk', 'sl', 'hr', 'sr', 'mk', 'bg']

/**
 * "+" when (yes + ½·unsure) / all answers is at least 2/3, "-" below 1/3, "~" between; "?" without answers:
 * the old reader counts it as half and shows no icon for it.
 * As Slovosbor's flower: a false friend and another language are a "no", a rare word an "unsure".
 */
function mark([yes = 0, unsure = 0, no = 0, falseFriend = 0, otherLanguage = 0, rare = 0]: number[]): string {
    const all = yes + unsure + no + falseFriend + otherLanguage + rare
    if (!all) {
        return '?'
    }
    const share = (yes + (unsure + rare) / 2) / all

    return share >= 2 / 3 ? '+' : share < 1 / 3 ? '-' : '~'
}

/**
 * Replaces the sheet's marks of every row people voted on, in place, from the export's TSV
 * (steen_id, sense_uri, isv, en_definition, lang, yes, dunno, no, false_friend, other_language, rare, total).
 * The row's senses and lemmas add up; other rows keep the sheet's marks. Returns how many rows got votes.
 */
export function addVotes(wordList: string[][], tsv: string): number {
    const [header] = wordList
    const [idCol, votesCol] = ['id', 'intelligibility'].map((name) => header.indexOf(name))
    if (votesCol < 0) {
        throw new Error('basic.json has no intelligibility column')
    }

    const byRow = new Map<string, Record<string, number[]>>()
    tsv.split('\n').slice(1).filter(Boolean).forEach((line) => {
        const [id, , , , lang, ...counts] = line.split('\t')
        // the export lists senses nobody answered yet, too
        if (!MARK_LANGS.includes(lang) || !counts.slice(0, 6).some(Number)) {
            return
        }
        const langs = byRow.get(id) ?? {}
        langs[lang] = counts.slice(0, 6).map((n, i) => (langs[lang]?.[i] ?? 0) + (Number(n) || 0))
        byRow.set(id, langs)
    })

    let rated = 0
    wordList.slice(1).forEach((row) => {
        const langs = byRow.get(row[idCol])
        if (langs) {
            row[votesCol] = MARK_LANGS.map((lang) => `${lang}${mark(langs[lang] || [])}`).join(' ')
            rated += 1
        }
    })

    return rated
}
