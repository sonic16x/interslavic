import { ITranslateResult } from 'services'

import { estimateUnintelligibility } from './estimateUnintelligibility'

/**
 * A word is worth a warning sign when it is not intelligible in a third
 * of the languages it is judged by, by weight...
 */
export const UNINTELLIGIBILITY_RATIO = 1 / 3

/**
 * ...or when it has a problem, `-` or `~` alike, in 3 of them or more -
 * however lightly they weigh, such a word cannot be used freely.
 */
export const ISSUE_COUNT_THRESHOLD = 3

/**
 * Judges the word by the target languages when they are selected, and by all
 * the Slavic languages otherwise. Words with no marks are never flagged - we
 * simply do not know anything about them.
 */
export function hasIntelligibilityIssues(item: ITranslateResult, targetLangs: string[] = []): boolean {
    const { lost, total, issues } = estimateUnintelligibility(item.intelligibility, targetLangs)

    return (total > 0 && lost >= total * UNINTELLIGIBILITY_RATIO) || issues >= ISSUE_COUNT_THRESHOLD
}
