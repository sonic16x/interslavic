import { annotateWordType } from './wordType';

describe('annotateWordType', () => {
    test.each([
        ["90", ["🌱", 'suggestedNewWord']],
        ["91", ["🌱", 'suggestedNewWord']],
        ["92", ["🌱", 'suggestedNewWord']],
        ["93", ["🌱", 'suggestedNewWord']],
        ["94", ["🌱", 'suggestedNewWord']],
        ["95", ["🌱", 'suggestedNewWord']],
        ["98", ["⚠️", 'intelligibilityIssues']],
        ["99", ["⛔️", 'suggestedForRemoval']],
        ["97", ["🌱", 'suggestedNewWord']],
    ])('returns correct status for wordType %s', (wordType, expected) => {
        expect(annotateWordType(wordType)).toEqual(expected);
    });

    test.each([
        [""],
        ["0"],
        ["1"],
        ["2"],
        ["3"],
        ["9"],
        ["foo"],
    ])('returns empty status for wordType %s', (wordType) => {
        expect(annotateWordType(wordType)).toEqual(["", ""]);
    });
});
