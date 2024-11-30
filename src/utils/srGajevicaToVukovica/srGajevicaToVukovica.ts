export function srGajevicaToVukovica(text: string): string {
    // detecting gajevica
    if (text.match(/[A-Za-zŽžČčĆćŠš]/)) {
        return text
            .replace(/dž/g, 'џ').replace(/Dž/g, 'Џ')
            .replace(/lj/g, 'љ').replace(/Lj/g, 'Љ')
            .replace(/nj/g, 'њ').replace(/Nj/g, 'Њ')
            .replace(/a/g, 'а').replace(/A/g, 'А')
            .replace(/b/g, 'б').replace(/B/g, 'Б')
            .replace(/c/g, 'ц').replace(/C/g, 'Ц')
            .replace(/č/g, 'ч').replace(/Č/g, 'Ч')
            .replace(/ć/g, 'ћ').replace(/Ć/g, 'Ћ')
            .replace(/d/g, 'д').replace(/D/g, 'Д')
            .replace(/đ/g, 'ђ').replace(/Ð/g, 'Ђ')
            .replace(/e/g, 'е').replace(/E/g, 'Е')
            .replace(/f/g, 'ф').replace(/F/g, 'Ф')
            .replace(/g/g, 'г').replace(/G/g, 'Г')
            .replace(/h/g, 'х').replace(/H/g, 'Х')
            .replace(/i/g, 'и').replace(/I/g, 'И')
            .replace(/j/g, 'ј').replace(/J/g, 'Ј')
            .replace(/k/g, 'к').replace(/K/g, 'К')
            .replace(/l/g, 'л').replace(/L/g, 'Л')
            .replace(/m/g, 'м').replace(/M/g, 'М')
            .replace(/n/g, 'н').replace(/N/g, 'Н')
            .replace(/o/g, 'о').replace(/O/g, 'О')
            .replace(/p/g, 'п').replace(/P/g, 'П')
            .replace(/r/g, 'р').replace(/R/g, 'Р')
            .replace(/s/g, 'с').replace(/S/g, 'С')
            .replace(/š/g, 'ш').replace(/Š/g, 'Ш')
            .replace(/t/g, 'т').replace(/T/g, 'Т')
            .replace(/u/g, 'у').replace(/U/g, 'У')
            .replace(/v/g, 'в').replace(/V/g, 'В')
            .replace(/z/g, 'з').replace(/Z/g, 'З')
            .replace(/ž/g, 'ж').replace(/Ž/g, 'Ж')
        
    } else {
        return text
    }
}
