import { transposeMatrix } from './transposeMatrix'

describe('transposeMatrix', () => {
    it('should return valid result if width is 0', () => {
        expect(transposeMatrix([[1], [2], [3]])).toStrictEqual([[1, 2, 3]])
    })

    it('should return valid result', () => {
        const matrix = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ]
        expect(transposeMatrix(transposeMatrix(matrix))).toStrictEqual(matrix)
    })
})
