import { intersection } from './intersection'

describe('intersection', () => {
    test('finds the intersection of two arrays', () => {
        expect(intersection(['en', 'ru', 'pl', 'uk'], ['ru', 'uk', 'cs', 'sk'])).toEqual(['ru', 'uk'])
    })

    test('returns an empty array when there are no matches', () => {
        expect(intersection(['en', 'ru'], ['bg', 'sr'])).toEqual([])
    })

    test('returns an empty array if one of the arrays is empty', () => {
        expect(intersection([], ['en', 'ru', 'pl'])).toEqual([])
        expect(intersection(['en', 'ru', 'pl'], [])).toEqual([])
    })

    test('handles duplicate values', () => {
        expect(intersection(['ru', 'ru', 'en'], ['ru', 'pl', 'ru'])).toEqual(['ru', 'ru'])
    })
})
