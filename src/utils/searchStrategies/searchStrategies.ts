export function startsWith(str: string, substr: string): boolean {
    const pos = str.indexOf(substr);

    return pos === 0 || str[pos - 1] === ' ';
}

export function endsWith(str: string, substr: string): boolean {
    const begin = str.indexOf(substr);
    const end = begin + substr.length;

    return begin >= 0 && (end === str.length || str[end] === ' ');
}

export function includesExactly(str: string, substr: string): boolean {
    return startsWith(str, substr) && endsWith(str, substr);
}

export function includes(str: string, substr: string): boolean {
    return str.includes(substr);
}
