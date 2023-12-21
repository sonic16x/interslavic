import { removeBrackets } from 'utils/removeBrackets';

test('removeBrackets', () => {
    const cases = [
        ['euro [€]', '[', ']', 'euro'],
        ['adagio (muzyka)', '(', ')', 'adagio'],
    ];
    cases.forEach(([input, l, r, expected]) => expect(removeBrackets(input, l, r)).toBe(expected));
});
