import { ITranslateResult } from 'services'

import { estimateIntelligibility, IntelligibilityVector } from './estimateIntelligibility'

export function hasIntelligibilityIssues(item: ITranslateResult) {
    const vector = estimateIntelligibility(item.intelligibility)
    if (vector) {
        return hasIntelligibilityIssuesInVector(vector)
    }

    return (item.type > 2 && item.type !== 5)
}

export function hasIntelligibilityIssuesInVector(vector: IntelligibilityVector): boolean {
    const [western, southern, eastern] = vector

    const isolatedToEasternGroup = (western + southern) === 0
    const isolatedToWesternGroup = (southern + eastern) === 0
    const isolatedToSouthernGroup = (western + eastern) === 0
    const lowIntelligibility = (western + southern + eastern) < 2

    return isolatedToEasternGroup || isolatedToWesternGroup || isolatedToSouthernGroup || lowIntelligibility
}
