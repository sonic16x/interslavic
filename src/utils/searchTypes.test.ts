import { searchTypes } from 'services/dictionary';

describe('searchTypes', () => {
    test('begin', () => {
        expect(searchTypes.begin('Some text', 'Some')).toBe(true);
        expect(searchTypes.begin('Another Some text', 'Some')).toBe(false);
    });
    test('full', () => {
        expect(searchTypes.full('Some', 'Some')).toBe(true);
        expect(searchTypes.full('Some 2', 'Some')).toBe(false);
    });
    test('end', () => {
        expect(searchTypes.end('Some text', 'text')).toBe(true);
        expect(searchTypes.end('Some text 2', 'text')).toBe(false);
    });
    test('some', () => {
        expect(searchTypes.some('Some text 2', 'text')).toBe(true);
        expect(searchTypes.some('Some text 2', 'gggg')).toBe(false);
    });
});
