import { ITranslateResult } from 'services'

import { hasIntelligibilityIssues } from 'utils'

describe('hasIntelligibilityIssues', () => {
    describe('without target languages', () => {
        test.each([
            // nothing is known about the word
            [false, ''],
            [false, '!'],
            // ... and one language is not enough to rule it out either
            [false, 'pl-'],
            // exactly a third of the 6 points is lost - the threshold is inclusive
            [true, 'ru- pl-'],
            [true, 'be+ bg+ cs+ hr+ mk+ pl- ru- sk+ sl+ sr+ uk+'],
            // three languages with a problem are enough, however lightly they weigh
            [true, 'sl~ sr~ hr~'],
            [true, 'be+ bg+ cs~ hr~ mk+ pl+ ru+ sk~ sl+ sr+ uk+'],
            // intelligible in the west only
            [true, 'be- bg- cs+ hr- mk- pl+ ru- sk+ sl- sr- uk-'],
            // not intelligible anywhere
            [true, 'be- bg- cs- hr- mk- pl- ru- sk- sl- sr- uk-'],
            // partially intelligible everywhere
            [true, 'be~ bg~ cs~ hr~ mk~ pl~ ru~ sk~ sl~ sr~ uk~'],
            // the languages we do not weigh do not count
            [false, 'hsb- csb- dsb- pl+'],
        ])('should return %s for %j', (expected, intelligibility) => {
            const item = { intelligibility } as ITranslateResult
            expect(hasIntelligibilityIssues(item)).toBe(expected)
        })
    })

    describe('with target languages', () => {
        test.each([
            // the word is fine in Russian, no matter what happens elsewhere
            [false, 'be+ bg+ cs~ hr+ mk+ pl~ ru+ sk+ sl- sr+ uk+', ['ru']],
            // ... and it is only half-good for the Czechs
            [true, 'be+ bg+ cs~ hr+ mk+ pl~ ru+ sk+ sl- sr+ uk+', ['cs']],
            // ... while the two of them together lose only a quarter of their weight
            [false, 'be+ bg+ cs~ hr+ mk+ pl~ ru+ sk+ sl- sr+ uk+', ['ru', 'cs']],
            // a half of the only target language is lost - more than a third of it
            [true, 'ru~', ['ru']],
            // a quarter of the two target languages is lost - less than a third
            [false, 'ru~ pl+', ['ru', 'pl']],
            // we know nothing about the target language
            [false, 'pl- cs- sk-', ['ru']],
        ])('should return %s for %j and %j', (expected, intelligibility, targetLangs) => {
            const item = { intelligibility } as ITranslateResult
            expect(hasIntelligibilityIssues(item, targetLangs)).toBe(expected)
        })
    })
})
