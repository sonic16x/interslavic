import { ITranslateResult } from 'services'

import { hasIntelligibilityIssues, hasIntelligibilityIssuesInVector } from 'utils'

describe('hasIntelligibilityIssuesInVector', () => {
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
        expect(hasIntelligibilityIssuesInVector([western, southern, eastern])).toBe(expected)
    })
})

describe('hasIntelligibilityIssues', () => {
    test.each([
        // Test cases with no intelligibility string - type-based decisions
        [false, '', 1],  // universally intelligible
        [false, '', 2],  // predominantly intelligible
        [false, '', 5],  // neologism
        [true, '', 3],   // regionally intelligible
        [true, '', 4],   // Church Slavonic
        [true, '', 9],   // other/unknown
    ])('should return %s for empty intelligibility and type %d', (expected, intelligibility, type) => {
        const item = { intelligibility, type } as ITranslateResult
        expect(hasIntelligibilityIssues(item)).toBe(expected)
    })

    test('vector check should take precedence over type', () => {
        // Even though type=3 would normally indicate issues,
        // when all languages have good intelligibility (+), it should return false
        const item = {
            // All languages marked as good intelligibility
            intelligibility: 'be+ bg+ cs+ hr+ mk+ pl+ ru+ sk+ sl+ sr+ uk+',
            type: 3
        } as ITranslateResult
        expect(hasIntelligibilityIssues(item)).toBe(false)
    })

    test('should detect intelligibility issues from language markers', () => {
        const item = {
            intelligibility: 'ru+ be~ uk~ pl- cs- sk- bg- mk- sl- sr- hr-',
            type: 2
        } as ITranslateResult
        expect(hasIntelligibilityIssues(item)).toBe(true)
    })
})
