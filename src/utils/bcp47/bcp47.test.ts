import { toBCP47 } from 'utils/bcp47';

describe('toBCP47', () => {
    it('should convert "sr" to explictly Cyrillic Serbian (as for now)', () => {
        expect(toBCP47('sr')).toBe('sr-Cyrl');
    });

    it('should passthrough unknown language codes', () => {
        expect(toBCP47('isv')).toBe('isv');
    });
});
