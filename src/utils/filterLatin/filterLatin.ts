export function filterLatin(text: string): string {
    return text
        .replace(/[ąáäȁ]/g, 'a')
        .replace(/[ćč]/g, 'c')
        .replace(/[ďđ]/g, 'd')
        .replace(/[ęéěȅ]/g, 'e')
        .replace(/[íȉ]/g, 'i')
        .replace(/[łĺľ]/g, 'l')
        .replace(/[ńň]/g, 'n')
        .replace(/[óôöȍ]/g, 'o')
        .replace(/[řŕȑ]/g, 'r')
        .replace(/[śš]/g, 's')
        .replace(/[ß]/g, 'ss')
        .replace(/[ť]/g, 't')
        .replace(/[úůüȕ]/g, 'u')
        .replace(/[ý]/g, 'y')
        .replace(/[źżž]/g, 'z')
        ;
}
