import { ITranslateResult } from 'services'

import { decodeVotes, lemmaScore, shareBand, splitLemmas } from 'utils'

interface IWordStatus {
    icon: string;
    text: string;
}

export const getWordStatus = (item: ITranslateResult): IWordStatus | undefined => {
    if (item.remove) {
        return {
            icon: '⛔️',
            text: 'suggestedForRemoval',
        }
    }

    if (item.new) {
        return {
            icon: '🌱',
            text: 'suggestedNewWord',
        }
    }

    // a lemma most speakers do not understand
    const low = splitLemmas(item.isv).some((_, i) => (
        shareBand(lemmaScore(decodeVotes(item.intelligibility, i)).total / 100) === 'low'
    ))
    if (low) {
        return {
            icon: '⚠️',
            text: 'intelligibilityIssues',
        }
    }
}
