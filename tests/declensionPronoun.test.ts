
import { pronoun } from './testCases.json';
import { declensionPronoun } from '../src/utils/legacy/declensionPronoun';
import { getPronounType } from '../src/utils/wordDetails';

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
