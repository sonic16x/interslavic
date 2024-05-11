export function parseI18nString(str): [TemplateStringsArray, ...unknown[]] {
    const strings: string[] = [];
    const substitutions: string[] = [];

    let startIndex = 0;
    let endIndex = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        startIndex = str.indexOf('{', endIndex);
        if (startIndex === -1) {
            strings.push(str.slice(endIndex));
            break;
        }

        strings.push(str.slice(endIndex, startIndex));
        endIndex = str.indexOf('}', startIndex);

        if (endIndex === -1) {
            throw new Error(`Missing closing brace } after position ${startIndex} in string: ${str}`);
        }

        substitutions.push(str.slice(startIndex + 1, endIndex));
        endIndex++;
    }

    return [Object.assign(strings, { raw: [...strings] }), ...substitutions];
}
