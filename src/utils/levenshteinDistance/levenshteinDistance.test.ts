import { levenshteinDistance } from 'utils/levenshteinDistance';

describe('levenshteinDistance', () => {
    test('check same words', () => {
        const inputA = 'kot';
        const inputB = 'kot';
        const actual = 0;
        expect(levenshteinDistance(inputA, inputB)).toBe(actual);
    });
    test('check kot and ko', () => {
        const inputA = 'kot';
        const inputB = 'ko';
        const actual = 1;
        expect(levenshteinDistance(inputA, inputB)).toBe(actual);
    });
    test('check kot and k', () => {
        const inputA = 'kot';
        const inputB = 'k';
        const actual = 2;
        expect(levenshteinDistance(inputA, inputB)).toBe(actual);
    });
});
