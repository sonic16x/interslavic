export function convertCases(caseInfoRaw: string): string {
    const caseList = ['+Nom','+Gen','+Dat','+Acc','+Ins','+Loc','+Voc'];
    const caseInfo = caseInfoRaw
        .replace('+1', '+Nom')
        .replace('+2', '+Gen')
        .replace('+3', '+Dat')
        .replace('+4', '+Acc')
        .replace('+5', '+Ins')
        .replace('+6', '+Loc')
        .replace('+7', '+Voc')
        .replace('.', ''); 

    return caseList.includes(caseInfo) ? caseInfo : '';
}
