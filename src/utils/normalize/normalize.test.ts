import { normalize } from 'utils/normalize';

describe('normalize', () => {
    test('råbotati -> rabotati', () => {
        expect(normalize('råbotati')).toBe('rabotati');
    });

    test('sųråbotati -> surabotati', () => {
        expect(normalize('sųråbotati')).toBe('surabotati');
    });

    test('gòltnųti -> goltnuti', () => {
        expect(normalize('gòltnųti')).toBe('goltnuti');
    });

    test('Organizacija Sjedinjenyh Narodov -> ...', () => {
        expect(normalize('Organizacija Sjedinjenyh Narodov')).toBe('Organizacija Sjedinjenyh Narodov');
    });
});
