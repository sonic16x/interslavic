import { declensionNoun } from 'legacy/declensionNoun';
import {
    getGender,
    isAnimated,
    isIndeclinable,
    isPlural,
    isSingular,
} from 'utils/wordDetails';

// @ts-ignore
import { noun } from './testCases.json';

describe('noun', () => {
    noun.forEach(({ init: { word, details, add }, expected}) => {
        test(`noun ${word}`, () => {
            const gender = getGender(details);
            const animated = isAnimated(details);
            const plural = isPlural(details);
            const singular = isSingular(details);
            const indeclinable = isIndeclinable(details);

            const actual = declensionNoun(word, add, gender, animated, plural, singular, indeclinable);

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
