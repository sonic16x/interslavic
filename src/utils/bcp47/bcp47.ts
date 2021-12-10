export function toBCP47(code: string) {
    if (code.startsWith('isv')) {
        return code.replace('isv', 'art-x-isv');
    }

    if (code === 'sr') {
        return 'sr-Cyrl';
    }

    return code;
}
