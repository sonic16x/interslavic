import { toBCP47 } from 'utils/bcp47';

describe('toBCP47', () => {
    it('should convert "isv" to private extension of artificial language code', () => {
        expect(toBCP47('isv')).toBe('art-x-isv');
    });

    it('should convert "isv-Latn" to art-x-isv-Latn', () => {
        expect(toBCP47('isv-Latn')).toBe('art-x-isv-Latn');
    });

    it('should convert "sr" to explictly Cyrillic Serbian (as for now)', () => {
        expect(toBCP47('sr')).toBe('sr-Cyrl');
    });

    it('should passthrough unknown language codes', () => {
        expect(toBCP47('whatever')).toBe('whatever');
    });
});
