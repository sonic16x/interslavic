import { convertCases } from 'utils/convertCases';

describe('convertCases', () => {
    it('should convert "+2" to +Gen.', () => {
        expect(convertCases('+2')).toBe('+Gen.');
    });
    it('should convert "+3" to +Dat.', () => {
        expect(convertCases('+3')).toBe('+Dat.');
    });
    it('should convert "+4" to +Acc.', () => {
        expect(convertCases('+4')).toBe('+Acc.');
    });
    it('should convert "+5" to +Ins.', () => {
        expect(convertCases('+5')).toBe('+Ins.');
    });
    it('should convert "+6" to +Loc.', () => {
        expect(convertCases('+6')).toBe('+Loc.');
    });
});
