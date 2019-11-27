export function convertCases(add: string): string {
    return add
        .replace('+2', '+Gen.')
        .replace('+3', '+Dat.')
        .replace('+4', '+Acc.')
        .replace('+5', '+Ins.')
        .replace('+6', '+Loc.');
}
