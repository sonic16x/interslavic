import { hasIntelligibilityIssues } from './hasIntelligibilityIssues'

describe('hasIntelligibilityIssues', () => {
    test('should return false for null', () => {
        expect(hasIntelligibilityIssues(null)).toBe(false)
    })

    test.each([
        [true, 0.0, 0.0, 0.0],
        // region Isolated groups
        [true, 0.0, 0.0, 0.5],
        [true, 0.0, 0.5, 0.0],
        [true, 0.5, 0.0, 0.0],
        [true, 0.0, 0.0, 1.0],
        [true, 0.0, 1.0, 0.0],
        [true, 1.0, 0.0, 0.0],
        [true, 0.0, 0.0, 1.5],
        [true, 0.0, 1.5, 0.0],
        [true, 1.5, 0.0, 0.0],
        [true, 0.0, 0.0, 2.0],
        [true, 0.0, 2.0, 0.0],
        [true, 2.0, 0.0, 0.0],
        // endregion

        // region Low intelligibility
        [true, 1, 0.75, 0],
        [true, 0.5, 0.75, 0.5],
        [true, 1.0, 0.25, 0.5],
        // endregion

        // region No issues
        [false, 1, 0, 1],
        [false, 0, 1, 1],
        [false, 1, 1, 0],
        [false, 1, 0.5, 0.5],
        [false, 0.5, 1, 0.5],
        [false, 0.5, 0.5, 1],
        [false, 2, 0.125, 0],
        [false, 2, 2, 2],
        // endregion
    ])('should return %s for [%f, %f, %f]', (expected, western, southern, eastern) => {
        expect(hasIntelligibilityIssues([western, southern, eastern])).toBe(expected)
    })
})
