import { objectSetToString } from './objectSetToString';

describe('objectSetToString', () => {
    it('should return empty string from falsy object', () => {
        expect(objectSetToString({ b: false })).toBe('');
    });

    it('should take truish keys to string', () => {
        expect(objectSetToString({ a: true, b: false })).toBe('a');
    });

    it('should sort keys to string', () => {
        expect(objectSetToString({ b: true, a: true })).toBe('a,b');
        expect(objectSetToString({ a: true, b: true })).toBe('a,b');
    });
});
