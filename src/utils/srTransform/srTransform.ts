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
        ;
    } else {
        return text;
    }
}

export function srVukovicaToGajevica(text: string): string {
    return text
        .replace(/џ/g, 'dž').replace(/Џ/g, 'Dž')
        .replace(/љ/g, 'lj').replace(/Љ/g, 'Lj')
        .replace(/њ/g, 'nj').replace(/Њ/g, 'Nj')
        .replace(/а/g, 'a').replace(/А/g, 'A')
        .replace(/б/g, 'b').replace(/Б/g, 'B')
        .replace(/ц/g, 'c').replace(/Ц/g, 'C')
        .replace(/ч/g, 'č').replace(/Ч/g, 'Č')
        .replace(/ћ/g, 'ć').replace(/Ћ/g, 'Ć')
        .replace(/д/g, 'd').replace(/Д/g, 'D')
        .replace(/ђ/g, 'đ').replace(/Ђ/g, 'Ð')
        .replace(/е/g, 'e').replace(/Е/g, 'E')
        .replace(/ф/g, 'f').replace(/Ф/g, 'F')
        .replace(/г/g, 'g').replace(/Г/g, 'G')
        .replace(/х/g, 'h').replace(/Х/g, 'H')
        .replace(/и/g, 'i').replace(/И/g, 'I')
        .replace(/ј/g, 'j').replace(/Ј/g, 'J')
        .replace(/к/g, 'k').replace(/К/g, 'K')
        .replace(/л/g, 'l').replace(/Л/g, 'L')
        .replace(/м/g, 'm').replace(/М/g, 'M')
        .replace(/н/g, 'n').replace(/Н/g, 'N')
        .replace(/о/g, 'o').replace(/О/g, 'O')
        .replace(/п/g, 'p').replace(/П/g, 'P')
        .replace(/р/g, 'r').replace(/Р/g, 'R')
        .replace(/с/g, 's').replace(/С/g, 'S')
        .replace(/ш/g, 'š').replace(/Ш/g, 'Š')
        .replace(/т/g, 't').replace(/Т/g, 'T')
        .replace(/у/g, 'u').replace(/У/g, 'U')
        .replace(/в/g, 'v').replace(/В/g, 'V')
        .replace(/з/g, 'z').replace(/З/g, 'Z')
        .replace(/ж/g, 'ž').replace(/Ж/g, 'Ž')
        ;
}

export function srGetEkavica(text: string): string {
    return text.replace(/(е̖|е̱|е̩)/g, 'е');
}

export function srGetIjekavica(text: string): string {
    return text
        .replace(/ле̖/g, 'ље')
        .replace(/не̖/g, 'ње')
        .replace(/е̖/g, 'је')
        .replace(/е̱/g, 'ије')
        .replace(/е̩/g, 'и');
}

export function srTransform(text: string, srLangVariant:string ): string {
    if ( srLangVariant === 'ijekavicaCyr' || srLangVariant === 'ijekavicaLat' ) {
        text = srGetIjekavica(text);
    } else {
        text = srGetEkavica(text);
    }
    if ( srLangVariant === 'ekavicaLat' || srLangVariant === 'ijekavicaLat' ) {
        text = srVukovicaToGajevica(text);
    }
    return text;
}

