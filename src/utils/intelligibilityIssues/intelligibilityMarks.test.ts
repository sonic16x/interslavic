import {
    getIntelligibilityMarks,
    getPartlyIntelligibleLanguages,
    getUnknownIntelligibilityLanguages,
    isIntelligibleInLanguages,
} from './intelligibilityMarks'

describe('getIntelligibilityMarks', () => {
    test.each([[''], [null], ['!'], ['! ! !'], ['be uk']])('should return {} for %j', (intelligibility) => {
        expect(getIntelligibilityMarks(intelligibility)).toEqual({})
    })

    test('should parse marks and ignore the unverified flag', () => {
        expect(getIntelligibilityMarks('  !be~   pl+ mk ru- !sr uk+  ')).toEqual({
            be: '~',
            pl: '+',
            ru: '-',
            uk: '+',
        })
    })
})

describe('isIntelligibleInLanguages', () => {
    test('should keep everything when no target language is selected', () => {
        expect(isIntelligibleInLanguages('pl- cs-', [])).toBe(true)
    })

    test.each([
        ['pl+ cs+', ['pl'], true],
        ['pl~ cs+', ['pl'], true],
        ['pl- cs+', ['pl'], false],
        // no data about the language at all - we cannot rule the word out
        ['pl+ cs+', ['ru'], true],
        ['', ['ru'], true],
        ['!', ['ru'], true],
        // every selected language has to pass
        ['pl+ cs-', ['pl', 'cs'], false],
        ['pl~ cs+', ['pl', 'cs'], true],
        ['pl+ cs+', ['pl', 'cs', 'ru'], true],
    ])('for %j and %j should return %s', (intelligibility, langs, expected) => {
        expect(isIntelligibleInLanguages(intelligibility, langs)).toBe(expected)
    })
})

describe('getPartlyIntelligibleLanguages', () => {
    test.each([
        ['pl~ cs+', [], []],
        ['pl~ cs+', ['pl', 'cs'], ['pl']],
        ['pl~ cs~', ['cs', 'pl'], ['cs', 'pl']],
        ['pl+ cs+', ['pl', 'cs'], []],
        ['pl- cs+', ['pl'], []],
        ['', ['pl'], []],
    ])('for %j and %j should return %j', (intelligibility, langs, expected) => {
        expect(getPartlyIntelligibleLanguages(intelligibility, langs)).toEqual(expected)
    })
})

describe('getUnknownIntelligibilityLanguages', () => {
    test.each([
        ['', [], []],
        ['pl+ cs+', ['pl', 'cs'], []],
        ['pl+ cs+', ['pl', 'ru'], ['ru']],
        ['pl~ cs+', ['ru', 'be'], ['ru', 'be']],
        // an unverified mark is still data
        ['!ru~', ['ru'], []],
        // no data at all
        ['', ['pl'], ['pl']],
        ['!', ['pl'], ['pl']],
    ])('for %j and %j should return %j', (intelligibility, langs, expected) => {
        expect(getUnknownIntelligibilityLanguages(intelligibility, langs)).toEqual(expected)
    })
})
