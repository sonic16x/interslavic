import { declensionNoun } from '../src/utils/legacy/declensionNoun';
import {
    getGender,
    isAnimated,
    isPlural,
    isSingular,
    isIndeclinable,
} from '../src/utils/wordDetails';

import { noun } from './testCases.json';

describe('noun', () => {
    noun.forEach(({ init: { word, details, add }, expected}) => {
        test(`noun ${word}`, () => {
            const gender = getGender(details.replace('m./f.', 'm.' ));
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
