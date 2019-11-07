import { declensionAdjective } from '../src/utils/legacy/declensionAdjective';
import { adjective } from './testCases.json';

describe('adjective', () => {
    adjective.forEach(({ init: { word, details, add }, expected}) => {
        test(`adjective ${word}`, () => {
            const actual = declensionAdjective(word, '');

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
