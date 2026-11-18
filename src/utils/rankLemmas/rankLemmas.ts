/** "!kot (m.), kotka" -> [kot, kotka]: the lemmas of an isv cell, row marks and brackets dropped. */
export function splitLemmas(isv: string): string[] {
    return isv
        .replace(/^[!#]+/, '')
        .replace(/\s*(\([^)]*\)|\[[^\]]*\])/g, '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
}
