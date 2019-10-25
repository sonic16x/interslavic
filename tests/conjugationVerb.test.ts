import { conjugationVerb } from 'utils/legacy/conjugationVerb';
import { verb } from './testCases.json';

describe('adjective', () => {
    verb.forEach(({ init: { word, details, add }, expected}) => {
        test(`noun ${word}`, () => {
            const actual = conjugationVerb(word, add.replace(/\(|\)/g, ''));

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
