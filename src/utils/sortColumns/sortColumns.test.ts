import { sortColumns } from './sortColumns'

describe('sortColumns', () => {
    test('sorts columns based on a specified column', () => {
        const columns = [
            ['isv', 'pes', 'kot', 'arena'],
            ['en', 'dog', 'cat', 'arena'],
            ['ru', 'собака', 'кот', 'арена'],
        ]

        const sortedByEn = sortColumns(columns, 'en')
        expect(sortedByEn).toEqual([
            ['isv', 'arena', 'kot', 'pes'],
            ['en', 'arena', 'cat', 'dog'],
            ['ru', 'арена', 'кот', 'собака'],
        ])
    })
})
