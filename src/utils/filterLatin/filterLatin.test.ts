import { filterLatin } from './filterLatin'

describe('filterLatin', () => {
    test('replaces accented vowels correctly', () => {
        expect(filterLatin('ąáäȁ')).toBe('aaaa')
        expect(filterLatin('ęéěȅ')).toBe('eeee')
        expect(filterLatin('íȉ')).toBe('ii')
        expect(filterLatin('óôöȍ')).toBe('oooo')
        expect(filterLatin('úůüȕ')).toBe('uuuu')
        expect(filterLatin('ý')).toBe('y')
    })

    test('replaces accented consonants correctly', () => {
        expect(filterLatin('ćč')).toBe('cc')
        expect(filterLatin('ďđ')).toBe('dd')
        expect(filterLatin('łĺľ')).toBe('lll')
        expect(filterLatin('ńň')).toBe('nn')
        expect(filterLatin('řŕȑ')).toBe('rrr')
        expect(filterLatin('śš')).toBe('ss')
        expect(filterLatin('ß')).toBe('ss')
        expect(filterLatin('ť')).toBe('t')
        expect(filterLatin('źżž')).toBe('zzz')
    })

    test('preserves standard Latin characters', () => {
        expect(filterLatin('abcxyz')).toBe('abcxyz')
        expect(filterLatin('Hello, World!')).toBe('Hello, World!')
    })

    test('handles mixed input with diacritics and standard characters', () => {
        expect(filterLatin('Hęllo Wörld!')).toBe('Hello World!')
        expect(filterLatin('Príliš žluťoučký kůň')).toBe('Prilis zlutoucky kun')
    })

    test('returns an empty string when input is empty', () => {
        expect(filterLatin('')).toBe('')
    })
})
