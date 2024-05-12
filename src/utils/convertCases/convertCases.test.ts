import { convertCases } from 'utils/convertCases';

describe('convertCases', () => {
    it('should convert "+1" to +Nom', () => {
        expect(convertCases('+1')).toBe('+Nom');
    });
    it('should convert "+2" to +Gen', () => {
        expect(convertCases('+2')).toBe('+Gen');
    });
    it('should convert "+3" to +Dat', () => {
        expect(convertCases('+3')).toBe('+Dat');
    });
    it('should convert "+4" to +Acc', () => {
        expect(convertCases('+4')).toBe('+Acc');
    });
    it('should convert "+5" to +Ins', () => {
        expect(convertCases('+5')).toBe('+Ins');
    });
    it('should convert "+6" to +Loc', () => {
        expect(convertCases('+6')).toBe('+Loc');
    });
    it('should convert "+7" to +Voc', () => {
        expect(convertCases('+7')).toBe('+Voc');
    });
    it('should convert "+Nom" to +Nom', () => {
        expect(convertCases('+Nom')).toBe('+Nom');
    });
    it('should convert "+Gen" to +Gen', () => {
        expect(convertCases('+Gen')).toBe('+Gen');
    });
    it('should convert "+Dat" to +Dat', () => {
        expect(convertCases('+Dat')).toBe('+Dat');
    });
    it('should convert "+Acc" to +Acc', () => {
        expect(convertCases('+Acc')).toBe('+Acc');
    });
    it('should convert "+Ins" to +Ins', () => {
        expect(convertCases('+Ins')).toBe('+Ins');
    });
    it('should convert "+Loc" to +Loc', () => {
        expect(convertCases('+Loc')).toBe('+Loc');
    });
    it('should convert "+Voc" to +Voc', () => {
        expect(convertCases('+Voc')).toBe('+Voc');
    });
    it('should convert "+ABCD" to Empty string', () => {
        expect(convertCases('+ABCD')).toBe('');
    });
});
