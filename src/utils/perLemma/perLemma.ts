/**
 * Grammar cells (`partOfSpeech`, `addition`) hold one value for the whole row,
 * or one value per lemma of the `isv` cell: "n. | f.", "(uha/ušese) | ".
 */
export const LEMMA_SEPARATOR = ' | '

/** The value that belongs to the lemma number `index`. */
export function perLemma(value: string, index = 0): string {
    const parts = value.split(LEMMA_SEPARATOR)

    return parts[index] ?? parts[0]
}

/** Distinct non-empty values of the row, in lemma order. */
export function eachLemma(value: string): string[] {
    return Array.from(new Set(value.split(LEMMA_SEPARATOR).filter(Boolean)))
}
