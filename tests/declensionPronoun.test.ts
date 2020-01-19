
import { declensionPronoun } from '../src/utils/legacy/declensionPronoun';
import { getPronounType } from '../src/utils/wordDetails';
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
