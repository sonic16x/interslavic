export function filterLatin(text: string): string {
    return text.replace(/[ąáä]/g, 'a')
        .replace(/[ćč]/g, 'c')
        .replace(/[ďđ]/g, 'd')
        .replace(/[ęéě]/g, 'e')
        .replace(/[í]/g, 'i')
        .replace(/[łĺľ]/g, 'l')
        .replace(/[ńň]/g, 'n')
        .replace(/[óôö]/g, 'o')
        .replace(/[řŕ]/g, 'r')
        .replace(/[śš]/g, 's')
        .replace(/[ß]/g, 'ss')
        .replace(/[ť]/g, 't')
        .replace(/[úůü]/g, 'u')
        .replace(/[ý]/g, 'y')
        .replace(/[źżž]/g, 'z')
        ;
}
