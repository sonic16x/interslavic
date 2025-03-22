import { analyzeAbbr } from './analyzeAbbr'
import type { t as TranslateFn } from 'translations'

export function translateAbbr(t: typeof TranslateFn, abbr: string): string {
    const analyzed = analyzeAbbr(abbr)
    if (analyzed.length === 0) {
        return abbr
    }

    return analyzed.filter(shouldBeShownInAbbreviation).map((key) => t(`abbr-${key}`)).filter(Boolean).join(' ')
}

function shouldBeShownInAbbreviation(key: string): boolean {
    return key !== 'verb-main' && key !== 'noun-inanimate'
}

