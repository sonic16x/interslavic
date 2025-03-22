import { analyzeAbbr } from './analyzeAbbr'
import type { t as TranslateFn } from 'translations'

export function expandAbbr(t: typeof TranslateFn, abbr: string): string {
    const analyzed = analyzeAbbr(abbr)

    return analyzed.filter(shouldBeShownToUser).map((key) => t(key)).join(', ')
}

function shouldBeShownToUser(verbModifier: string): boolean {
    // "main verb" (as opposed to auxiliary) doesn't make sense to show in the UI
    return verbModifier !== 'verb-main'
}
