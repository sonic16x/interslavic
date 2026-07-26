import { ITranslateResult } from 'services'

import {
    getPartlyIntelligibleLanguages,
    getUnknownIntelligibilityLanguages,
    hasIntelligibilityIssues,
} from 'utils'

import type { t as TranslateFn } from 'translations'

export interface IWordStatus {
    icon: string;
    text: string;
    /**
     * Target languages the status refers to, if it is language-specific.
     */
    langs?: string[];
}

/**
 * Returns the badges to show on the word card. Words suggested for removal or for
 * addition get a badge of their own, the rest are described in terms of their
 * intelligibility - in the selected target languages, if there are any.
 */
export const getWordStatuses = (item: ITranslateResult, targetLangs: string[] = []): IWordStatus[] => {
    if (item.remove) {
        return [{
            icon: '⛔️',
            text: 'suggestedForRemoval',
        }]
    }

    if (item.new) {
        return [{
            icon: '🌱',
            text: 'suggestedNewWord',
        }]
    }

    const statuses: IWordStatus[] = []

    const partlyIntelligible = getPartlyIntelligibleLanguages(item.intelligibility, targetLangs)
    if (partlyIntelligible.length) {
        statuses.push({
            icon: '⚠️',
            text: 'intelligibilityIssuesInLanguages',
            langs: partlyIntelligible,
        })
    }

    const unknownIntelligibility = getUnknownIntelligibilityLanguages(item.intelligibility, targetLangs)
    if (unknownIntelligibility.length) {
        statuses.push({
            icon: '❓',
            text: 'intelligibilityUnknownInLanguages',
            langs: unknownIntelligibility,
        })
    }

    if (!statuses.length && hasIntelligibilityIssues(item, targetLangs)) {
        statuses.push({
            icon: '⚠️',
            text: 'intelligibilityIssues',
        })
    }

    return statuses
}

export const getWordStatusText = (t: typeof TranslateFn, { text, langs }: IWordStatus): string => {
    if (!langs?.length) {
        return t(text)
    }

    return `${t(text)}: ${langs.map((lang) => t(`${lang}Lang`)).join(', ')}`
}
