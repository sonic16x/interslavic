export function convertCases(add: string): string {
    return add
        .replace('+1', '+Nom')
        .replace('+2', '+Gen')
        .replace('+3', '+Dat')
        .replace('+4', '+Acc')
        .replace('+5', '+Ins')
        .replace('+6', '+Loc')
        .replace('+7', '+Voc')
        .replace('.', '')
        .replace(/\((?!\+Nom|\+Gen|\+Dat|\+Acc|\+Ins|\+Loc|\+Voc).*\)/,'')
    ;
}
