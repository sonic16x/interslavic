import { toQueryString } from './toQueryString';

describe('toQueryString', () => {
    it('should return empty string for empty object', () => {
        expect(toQueryString({})).toBe('');
    });

    it('should return single key=value pair for an object with 1 entry', () => {
        expect(toQueryString({ a: 5 })).toBe('a=5');
    });

    it('should return many key=value pairs for a complex object', () => {
        expect(toQueryString({ a: 5, b: true, c: 'this' })).toBe('a=5&b=true&c=this');
    });

    it('should encode uri components', () => {
        expect(toQueryString({ a: '3:5', b: true, 'e:r': 'this' })).toBe('a=3%3A5&b=true&e%3Ar=this');
    });
});
