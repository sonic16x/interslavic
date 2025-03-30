import { deduplicate } from './deduplicate'

describe('deduplicate', () => {
    test('deduplicate array of string', () => {
        expect(deduplicate(['a', 'a', 'b', 'c', 'c'])).toEqual(['a', 'b', 'c'])
    })
})
