
import { declensionPronoun } from 'legacy/declensionPronoun';
import { getPronounType } from 'utils/wordDetails';
// @ts-ignore
import { pronoun } from './testCases.json';

describe('pronoun', () => {
    pronoun.forEach(({ init: { word, details, add }, expected}) => {
        test(`pronoun ${word}`, () => {
            const actual = declensionPronoun(word, getPronounType(details));

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
