import { convertCases } from 'utils'

describe('convertCases', () => {
    test.each([
        ['+1', '+Nom'],
        ['+2', '+Gen'],
        ['+3', '+Dat'],
        ['+4', '+Acc'],
        ['+5', '+Ins'],
        ['+6', '+Loc'],
        ['+7', '+Voc']
    ])('should convert "%s" to "%s"', (input, expected) => {
        expect(convertCases(input)).toBe(expected)
    })
    
    test.each([
        ['+Nom.', '+Nom'],
        ['+Gen.', '+Gen'],
        ['+Dat.', '+Dat'],
        ['+Acc.', '+Acc'],
        ['+Ins.', '+Ins'],
        ['+Loc.', '+Loc'],
        ['+Voc.', '+Voc']
    ])('should remove dot from "%s"', (input, expected) => {
        expect(convertCases(input)).toBe(expected)
    })
    
    test('should convert unknown abbreviations to an empty string', () => {
        expect(convertCases('+ABCD')).toBe('')
    })
})
