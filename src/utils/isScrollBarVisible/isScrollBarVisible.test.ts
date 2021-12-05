import { isScrollBarVisible } from 'utils/isScrollBarVisible';

describe('isScrollBarVisible', () => {
    test('shout be false if ref is undefined', () => {
        const ref = {
            current: undefined,
        };
        expect(isScrollBarVisible(ref)).toBe(false);
    });

    test('shout be true', () => {
        const ref = {
            current: {
                scrollHeight: 500,
                scrollTop: 0,
                clientHeight: 400,
            },
        };
        expect(isScrollBarVisible(ref)).toBe(true);
    });

    test('shout be false', () => {
        const ref = {
            current: {
                scrollHeight: 400,
                scrollTop: 0,
                clientHeight: 400,
            },
        };
        expect(isScrollBarVisible(ref)).toBe(false);
    });
});
