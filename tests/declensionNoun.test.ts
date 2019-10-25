import { declensionNoun } from 'utils/legacy/declensionNoun';
import {
    getGender,
    isAnimated,
    isPlural,
} from 'utils/wordDetails';
import { markFluentVowel } from 'utils/markFluentVowel';

import { noun } from './testCases.json';

describe('noun', () => {
    noun.forEach(({ init: { word, details, add }, expected}) => {
        test(`noun ${word}`, () => {
            let preparedWord = word;
            const preparedAdd = add.replace(/\(|\)/g, '');

            if (preparedAdd && word !== preparedAdd) {
                preparedWord = markFluentVowel(word, preparedAdd);
            }

            const gender = getGender(details);
            const animated = isAnimated(details);
            const plural = isPlural(details);

            const actual = declensionNoun(preparedWord, preparedAdd, gender, animated, plural);

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
