/**
 * Build time only (generateDictionary): Slovosbor's votes and the machine's -> the `intelligibility` column.
 * Source -> slovosbor's public export (one row per sense × language) -> summed per (row id, lemma),
 * plus the machine's vote (Levenshtein to the row's translation) where no person answered
 * -> encodeVotes() by the lemma's place in the isv cell.
 * The machine votes here, not in the browser: the cards would run Levenshtein on every keystroke.
 */
import { encodeVotes, foldLemma, machineVote, Six, splitLemmas, VOTE_LANGS } from 'utils'

export const VOTES_URL = 'https://slovosbor.online/api/v0/export/intelligibility.tsv'

/**
 * Fills the `intelligibility` column of wordList (header row first, with the VOTE_LANGS columns) in place
 * from the export's TSV
 * (steen_id, sense_uri, isv, en_definition, lang, yes, dunno, no, false_friend, other_language, rare, total).
 * Several senses of one lemma add up. Returns how many (id, lemma) pairs found their lemma in the row and how many not.
 */
export function addVotes(wordList: string[][], tsv: string): { matched: number; unmatched: number } {
    const [header] = wordList
    const [idCol, isvCol, votesCol] = ['id', 'isv', 'intelligibility'].map((name) => header.indexOf(name))
    const langCols = VOTE_LANGS.map((lang) => header.indexOf(lang))
    if (votesCol < 0) {
        throw new Error('basic.json has no intelligibility column')
    }

    const byLemma = new Map<string, Record<string, Six>>()
    tsv.split('\n').slice(1).filter(Boolean).forEach((line) => {
        const [id, , isv, , lang, ...counts] = line.split('\t')
        if (!VOTE_LANGS.includes(lang)) {
            return
        }
        const key = `${id}\t${foldLemma(isv)}`
        const langs = byLemma.get(key) ?? {}
        const six = langs[lang] ?? [0, 0, 0, 0, 0, 0]
        counts.slice(0, 6).forEach((n, i) => {
            six[i] += Number(n) || 0
        })
        langs[lang] = six
        byLemma.set(key, langs)
    })

    let matched = 0
    wordList.slice(1).forEach((row) => {
        row[votesCol] = encodeVotes(splitLemmas(row[isvCol] || '').map((lemma) => {
            const six = byLemma.get(`${row[idCol]}\t${foldLemma(lemma)}`)
            matched += six ? 1 : 0
            // the machine stands in for a language nobody answered; once people answer, it steps aside
            const machine = Object.fromEntries(VOTE_LANGS
                .map((lang, i) => [lang, six?.[lang] ? undefined : machineVote(lemma, row[langCols[i]] || '', lang)])
                .filter(([, vote]) => vote !== undefined))

            return { six: six || {}, machine }
        }))
    })

    return { matched, unmatched: byLemma.size - matched }
}

/**
 * The fallback when the export is unavailable: the `intelligibility` column of the deployed basic.json, by row id.
 * Only values in the votes format are taken (a deploy from before the votes kept the sheet's "be+ ru~" marks).
 * Returns how many rows got their votes back.
 */
export function keepDeployedVotes(wordList: string[][], deployed: string[][]): number {
    const column = (list: string[][], name: string) => list[0].indexOf(name)
    const [idCol, votesCol] = [column(wordList, 'id'), column(wordList, 'intelligibility')]
    const [oldId, oldVotes] = [column(deployed, 'id'), column(deployed, 'intelligibility')]
    const byId = new Map(deployed.slice(1)
        .filter((row) => /^[\d.,|+]*$/.test(row[oldVotes] || ''))
        .map((row) => [row[oldId], row[oldVotes]]))
    let kept = 0
    wordList.slice(1).forEach((row) => {
        row[votesCol] = byId.get(row[idCol]) ?? ''
        kept += row[votesCol] ? 1 : 0
    })

    return kept
}
