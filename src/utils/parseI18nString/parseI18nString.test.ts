import { parseI18nString } from './parseI18nString'

describe('parseI18nString', () => {
    it('should return empty string when given empty string', () => {
        assertEquals(parseI18nString(''), resultOf``)
    })

    it('should return string when given string without substitutions', () => {
        assertEquals(parseI18nString('string'), resultOf`string`)
    })

    it('should return string and one substitution when given string with one substitution', () => {
        assertEquals(parseI18nString('string {substitution}'), resultOf`string ${'substitution'}`)
    })

    it('should return string and two substitutions when given string with two substitutions', () => {
        assertEquals(
            parseI18nString('{substitution} string {substitution2}'),
            resultOf`${'substitution'} string ${'substitution2'}`,
        )
    })

    /** Verifying full compliance with the specification */
    it('should have inter-op with String.raw built-in function', () => {
        expect(
            String.raw.apply(null, parseI18nString('string {substitution}'))
        ).toBe(String.raw`string ${'substitution'}`)
    })
})

function resultOf(strings: TemplateStringsArray, ...substitutions: unknown[]): [TemplateStringsArray, ...unknown[]] {
    return [strings, ...substitutions]
}

function assertEquals(actual: [TemplateStringsArray, ...unknown[]], expected: [TemplateStringsArray, ...unknown[]]) {
    // We cannot use `toEqual` because `raw` property does not play well with array comparison
    expect(actual[0].raw).toEqual(expected[0].raw)
    expect([...actual[0]]).toEqual([...expected[0]])

    expect(actual.slice(1)).toEqual(expected.slice(1))
}
