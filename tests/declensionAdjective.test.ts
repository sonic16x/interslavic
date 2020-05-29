import { declensionAdjective } from 'legacy/declensionAdjective';
// @ts-ignore
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
