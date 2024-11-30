import { endsWith, includes, includesExactly, startsWith } from './searchStrategies'
describe('searchStrategies', () => {
    describe('startsWith', () => {
        test('returns true when substring is in the beginning (case 1)', () => {
            expect(startsWith('hello world', 'hell')).toBe(true)
        })

        test('returns true when substring is in the beginning (case 2)', () => {
            expect(startsWith('hello world', 'hello wo')).toBe(true)
        })

        test('returns true when substring starts after a space', () => {
            expect(startsWith('hello world', 'wor')).toBe(true)
        })

        test('returns false when substring starts after a non-space', () => {
            expect(startsWith('hello-world', 'wor')).toBe(false)
        })
    })

    describe('endsWith', () => {
        test('returns true when substring is at the end (case 1)', () => {
            expect(endsWith('hello world', 'orld')).toBe(true)
        })

        test('returns true when substring is at the end (case 2)', () => {
            expect(endsWith('hello world', 'o world')).toBe(true)
        })

        test('returns true when substring ends before a space', () => {
            expect(endsWith('hello world ', 'ello')).toBe(true)
        })

        test('returns false when substring ends before a non-space', () => {
            expect(endsWith('hello-world', 'ello')).toBe(false)
        })

        test('returns false when substring is nowhere to be found', () => {
            expect(endsWith('share', 'sphere')).toBe(false)
        })
    })

    describe('includesExactly', () => {
        test('returns true when string is identical', () => {
            expect(includesExactly('hello world', 'hello world')).toBe(true)
        })

        test('returns true when substring ends with space', () => {
            expect(includesExactly('hello world', 'hello')).toBe(true)
        })

        test('returns true when substring begins with space', () => {
            expect(includesExactly('hello world', 'world')).toBe(true)
        })

        test('returns false when substring ends with space but does not end with it', () => {
            expect(includesExactly('hello world', 'hell')).toBe(false)
        })

        test('returns false when substring begins with space but does not reach the end', () => {
            expect(includesExactly('hello world', 'worl')).toBe(false)
        })

        test('returns false when substring is somewhere in the middle', () => {
            expect(includesExactly('hello world', 'lo w')).toBe(false)
        })
    })

    describe('includes', () => {
        test('returns true when substring exists', () => {
            expect(includes('hello world', 'o w')).toBe(true)
        })

        test('returns false when substring does not exist', () => {
            expect(includes('hello world', 'bye')).toBe(false)
        })
    })
})
