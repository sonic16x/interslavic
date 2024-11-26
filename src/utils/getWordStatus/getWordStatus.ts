import { ITranslateResult } from "services/dictionary";

import { estimateIntelligibility, hasIntelligibilityIssues } from "utils/intelligibilityIssues";

interface IWordStatus {
    icon: string;
    text: string;
}

export const getWordStatus = (item: ITranslateResult): IWordStatus | undefined => {
    const intelligibilityVector = estimateIntelligibility(item.intelligibility);

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

    if (hasIntelligibilityIssues(intelligibilityVector)) {
        return {
            icon: '⚠️',
            text: 'intelligibilityIssues',
        }
    }
}
