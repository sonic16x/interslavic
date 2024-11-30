import { IntelligibilityVector } from './estimateIntelligibility'

export function hasIntelligibilityIssues(vector: IntelligibilityVector | null) {
    if (!vector) {
        return false
    }

    const [western, southern, eastern] = vector

    const isolatedToEasternGroup = (western + southern) === 0
    const isolatedToWesternGroup = (southern + eastern) === 0
    const isolatedToSouthernGroup = (western + eastern) === 0
    const lowIntelligibility = (western + southern + eastern) < 2

    return isolatedToEasternGroup || isolatedToWesternGroup || isolatedToSouthernGroup || lowIntelligibility
}
