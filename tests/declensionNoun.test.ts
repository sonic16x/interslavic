import { declensionNoun } from 'utils/legacy/declensionNoun';
import {
    getGender,
    isAnimated,
    isPlural,
} from 'utils/wordDetails';

import { noun } from './testCases.json';

describe('noun', () => {
    noun.forEach(({ init: { word, details, add }, expected}) => {
        test(`noun ${word}`, () => {
            const gender = getGender(details);
            const animated = isAnimated(details);
            const plural = isPlural(details);

            const actual = declensionNoun(word, add, gender, animated, plural);

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
