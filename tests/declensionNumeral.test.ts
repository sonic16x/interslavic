
import { declensionNumeral } from 'legacy/declensionNumeral';
import { getNumeralType } from 'utils/wordDetails';
// @ts-ignore
import { numeral } from './testCases.json';

describe('numeral', () => {
    numeral.forEach(({ init: { word, details, add }, expected}) => {
        test(`numeral ${word}`, () => {
            const actual = declensionNumeral(word, getNumeralType(details));

            if (actual === null) {
                expect(actual).toBe(expected);
            } else {
                expect(actual).toMatchObject(expected);
            }
        });
    });
});
