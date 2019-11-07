
import { numeral } from './testCases.json';
import { getNumeralType } from '../src/utils/wordDetails';
import { declensionNumeral } from '../src/utils/legacy/declensionNumeral';

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
