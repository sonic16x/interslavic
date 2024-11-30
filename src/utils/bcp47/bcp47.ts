export function toBCP47(code: string) {
    if (code === 'sr') {
        return 'sr-Cyrl'
    }

    return code
}
