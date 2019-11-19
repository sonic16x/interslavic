import {
    removeExclamationMark,
    levenshteinDistance,
    removeBrackets,
    convertCases,
    splitWords,
} from 'utils/translator';

describe('translator', () => {
    test('splitWords by ;', () => {
        const input = 'one,two;three';
        const actual = splitWords(input);
        expect(actual).toMatchObject(['one,two', 'three']);
    });
    test('splitWords by ,', () => {
        const input = 'one,two,three';
        const actual = splitWords(input);
        expect(actual).toMatchObject(['one', 'two', 'three']);
    });
    test('removeExclamationMark mark exist', () => {
        const input = '!one';
        const actual = removeExclamationMark(input);
        expect(actual).toBe('one');
    });
    test('removeExclamationMark mark does not exist', () => {
        const input = 'abc';
        const actual = removeExclamationMark(input);
        expect(actual).toBe('abc');
    });
    test('convertCases', () => {
        const cases = [
            ['+2', '+Gen.'],
            ['+3', '+Dat.'],
            ['+4', '+Acc.'],
            ['+5', '+Ins.'],
            ['+6', '+Loc.'],
        ];
        cases.forEach(([input, expected]) => expect(convertCases(input)).toBe(expected));
    });
    test('levenshteinDistance', () => {
        const cases = [
            ['kot', 'kot', 0],
            ['kot', 'ko', 1],
            ['kot', 'k', 2],
        ];
        cases.forEach(([a, b, expected]) => expect(levenshteinDistance(a, b)).toBe(expected));
    });
    test('removeBrackets', () => {
        const cases = [
            ['euro [€]', '[', ']', 'euro'],
            ['adagio (muzyka)', '(', ')', 'adagio'],
        ];
        cases.forEach(([input, l, r, expected]) => expect(removeBrackets(input, l, r)).toBe(expected));
    });
});
