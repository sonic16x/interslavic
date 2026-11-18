import { LEMMA_SEPARATOR } from '../perLemma'

export interface ILemmaIssue {
    id: string;
    isv: string;
    lemma: string;
}

const clean = (text = '') => text.normalize('NFC').trim()

// "!bolěti (1) (+3)" -> "bolěti (1)": the homonym index is part of the key, other brackets are not
const lemmaKey = (text: string) => clean(text.replace(/^[!#]+/, '').replace(/\s*(\((?!\d+\))[^)]*\)|\[[^\]]*\])/g, ''))

/**
 * Fills `partOfSpeech`, `addition` and `genesis` of the `words` table from the `lemmas` table.
 * Join key: lemma from the `isv` cell (with homonym index) + `upos` of the row.
 * Mutates and returns `words`; rows without `upos` (tab not migrated yet) are left alone.
 */
export function joinLemmas(words: string[][], lemmas: string[][]): ILemmaIssue[] {
    const col = (table: string[][], name: string) => table[0].indexOf(name)
    const lemmaCol = Object.fromEntries(lemmas[0].map((name, i) => [name, i]))
    const byKey = new Map(lemmas.slice(1).map((line) => (
        [`${clean(line[lemmaCol.isv])}\t${clean(line[lemmaCol.upos])}`, line]
    )))
    const [isvCol, uposCol, posCol, addCol, genesisCol] = ['isv', 'upos', 'partOfSpeech', 'addition', 'genesis']
        .map((name) => col(words, name))
    const issues: ILemmaIssue[] = []

    if (uposCol === -1) {
        return issues
    }

    words.slice(1).forEach((line) => {
        const keys = (line[isvCol] || '').split(',').map(lemmaKey).filter(Boolean)
        const found = keys.map((key) => byKey.get(`${key}\t${clean(line[uposCol])}`))
        const missing = keys.filter((_, i) => !found[i])

        if (keys.length === 0) {
            return
        }

        if (missing.length) {
            // no row in `lemmas`: a multiword entry is a phrase; a single word or a reflexive verb is an error
            if (missing.some((key) => !key.includes(' ') || key.endsWith(' sę'))) {
                missing.forEach((lemma) => issues.push({ id: line[0], isv: line[isvCol], lemma }))
            } else if (found.every((lemma) => !lemma)) {
                line[posCol] = 'phrase'
            }

            return
        }

        // one value when every lemma agrees, otherwise one per lemma: "n. | f."
        const perLemmaCell = (values: string[]) => (
            values.every((value) => value === values[0]) ? values[0] : values.join(LEMMA_SEPARATOR)
        )
        // government lives in `isv` now; until that cell is rewritten it is still in the old addition
        const government = (line[addCol] || '').match(/\(\+[^)]*\)/g) || []

        line[posCol] = perLemmaCell(found.map((lemma) => clean(lemma[lemmaCol.xpos])))
        line[addCol] = [perLemmaCell(found.map((lemma) => clean(lemma[lemmaCol.addition]))), ...government]
            .filter(Boolean).join(' ')
        if (genesisCol !== -1) {
            line[genesisCol] = clean(found[0][lemmaCol.genesis])
        }
    })

    return issues
}
