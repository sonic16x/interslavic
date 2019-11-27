import { removeExclamationMark } from 'utils/removeExclamationMark';

describe('removeExclamationMark', () => {
    test('removeExclamationMark mark exist', () => {
        const input = '!one';
        const actual = removeExclamationMark(input);
        expect(actual).toBe('one');
    });
    test('removeExclamationMark mark does not exist', () => {
        const input = 'abc';
        const actual = removeExclamationMark(input);
        expect(actual).toBe('abc');
    });
});
