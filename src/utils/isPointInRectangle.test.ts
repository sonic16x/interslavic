import { isPointInRectangle } from './isPointInRectangle';

describe('isPointInRectangle', () => {
    it.each([
        [true, 0, 0],
        [true, 0, 1],
        [true, 1, 0],
        [true, 1, 1],
        [true, 0.5, 0.5],
        [false, -0.1, 0],
        [false, 1.1, 0],
        [false, 0, -0.1],
        [false, 0, 1.1],
    ])('should return %j for x=%d, y=%d in rectangle(0, 0, 1, 1)', (expected: boolean, x: number, y: number) => {
        const rectangle = {
            left: 0,
            width: 1,
            right: 1,
            top: 0,
            height: 1,
            bottom: 1,
        };

        expect(isPointInRectangle(x, y, rectangle)).toBe(expected);
    });
});
