import { ITranslateResult } from 'services'

import { hasIntelligibilityIssues } from 'utils'

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

    if (hasIntelligibilityIssues(item)) {
        return {
            icon: '⚠️',
            text: 'intelligibilityIssues',
        }
    }
}
