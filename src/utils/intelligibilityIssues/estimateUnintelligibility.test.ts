import { estimateUnintelligibility } from './estimateUnintelligibility'

const ALL_LANGS = ['be', 'bg', 'cs', 'hr', 'mk', 'pl', 'ru', 'sk', 'sl', 'sr', 'uk']

function make(languages: string[], mark: string): string {
    return languages.map((lang) => `${lang}${mark}`).join(' ')
}

describe('estimateUnintelligibility', () => {
    describe('without target languages', () => {
        test.each([[''], ['!'], ['! ! !']])('should lose nothing for %j', (sameInLanguages) => {
            expect(estimateUnintelligibility(sameInLanguages)).toEqual({ lost: 0, total: 6, issues: 0 })
        })

        test('should lose nothing when every language is intelligible', () => {
            expect(estimateUnintelligibility(make(ALL_LANGS, '+'))).toEqual({ lost: 0, total: 6, issues: 0 })
        })

        test('should lose everything when no language is intelligible', () => {
            expect(estimateUnintelligibility(make(ALL_LANGS, '-'))).toEqual({ lost: 6, total: 6, issues: 11 })
        })

        test('should lose a half of every partially intelligible language', () => {
            expect(estimateUnintelligibility(make(ALL_LANGS, '~'))).toEqual({ lost: 3, total: 6, issues: 11 })
        })

        test.each([
            // one point each
            ['ru-', 1],
            ['pl-', 1],
            ['be- uk-', 1],
            ['cs- sk-', 1],
            ['bg- mk-', 1],
            ['sl- sr- hr-', 1],
            // two points for a whole group
            ['ru- be- uk-', 2],
            ['pl- cs- sk-', 2],
            ['bg- mk- sl- sr- hr-', 2],
            // a half of the loss for a `~`
            ['ru~', 0.5],
            ['sr~', 0.125],
            // the unverified flag does not matter
            ['!ru-', 1],
            // languages we do not weigh at all
            ['hsb- csb-', 0],
            // no mark - no loss
            ['ru pl cs', 0],
        ])('should lose %d points for %j', (sameInLanguages, lost) => {
            expect(estimateUnintelligibility(sameInLanguages).lost).toBe(lost)
        })
    })

    describe('with target languages', () => {
        test('should only take the target languages into account', () => {
            expect(estimateUnintelligibility('be- bg- cs~ pl+ ru+', ['pl', 'ru'])).toEqual({
                lost: 0,
                total: 2,
                issues: 0,
            })
        })

        test('should count a target language we know nothing about', () => {
            expect(estimateUnintelligibility('ru~', ['ru', 'sl'])).toEqual({ lost: 0.5, total: 1.5, issues: 1 })
        })

        test('should ignore the languages we do not weigh', () => {
            expect(estimateUnintelligibility('hsb- ru-', ['hsb'])).toEqual({ lost: 0, total: 0, issues: 0 })
        })
    })
})
