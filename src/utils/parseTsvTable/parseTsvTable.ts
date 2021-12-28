export function parseTsvTable(str: string): string[][] {
    return str
        .split('\n')
        .map((l) => l.replace('\r', '').split('\t').map((e) => e.trim()))
    ;
}
