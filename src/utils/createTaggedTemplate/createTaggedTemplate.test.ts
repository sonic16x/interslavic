import { getCyrillic } from '../getCyrillic'

import { createTaggedTemplate } from './createTaggedTemplate'

describe('createTaggedTemplate', () => {
    const toCyrillic = (s: unknown) => getCyrillic(String(s), '3')

    test('applies transformation to template strings', () => {
        const Cyrl = createTaggedTemplate(toCyrillic, 'strings')
        const result = Cyrl`Pozdrav, ${'world'}! Kako ${'you'} jesi?`
        expect(result).toBe('Поздрав, world! Како you јеси?')
    })

    test('applies transformation to interpolated values', () => {
        const Cyrl = createTaggedTemplate(toCyrillic, 'values')
        const result = Cyrl`Hello, ${'Světe'}! How are ${'ty'}?`
        expect(result).toBe('Hello, Свєте! How are ты?')
    })

    test('handles empty template strings', () => {
        const Cyrl = createTaggedTemplate(toCyrillic, 'strings')
        const result = Cyrl``
        expect(result).toBe('')
    })

    test('handles template strings without interpolated values', () => {
        const Cyrl = createTaggedTemplate(toCyrillic, 'strings')
        const result = Cyrl`Pozdrav, světe!`
        expect(result).toBe('Поздрав, свєте!')
    })

    test('handles interpolated values of different types', () => {
        const Cyrl = createTaggedTemplate(toCyrillic, 'values')
        const result = Cyrl`Value 1: ${123}, Value 2: ${true}, Value 3: ${null}, Value 4: ${undefined}`
        expect(result).toBe('Value 1: 123, Value 2: труе, Value 3: нулл, Value 4: ундефинед')
    })
})
