import { estimateIntelligibility } from './estimateIntelligibility';

describe('estimateIntelligibility', () => {
    let map: Record<string, string>;

    beforeEach(() => {
        map = {
            be: '-',
            bg: '-',
            cs: '-',
            hr: '-',
            mk: '-',
            pl: '-',
            ru: '-',
            sk: '-',
            sl: '-',
            sr: '-',
            uk: '-',
            unknown: '+',
        };
    });

    test.each([[''], ['!']])('should return null for %s', (sameInLanguages) => {
        expect(estimateIntelligibility(sameInLanguages)).toBeNull();
    });

    test('should return [0,0,0] for all-minus', () => {
        expect(estimateIntelligibility(make(map))).toEqual([0, 0, 0]);
    });

    test('should return [2,2,2] for all-plus', () => {
        map = Object.fromEntries(Object.entries(map).map(([lang]) => [lang, '+']));
        expect(estimateIntelligibility(make(map))).toEqual([2, 2, 2]);
    });

    test('should return [2,2,2] for all-unsigned', () => {
        map = Object.fromEntries(Object.entries(map).map(([lang]) => [lang, '']));
        expect(estimateIntelligibility(make(map))).toEqual([2, 2, 2]);
    });

    test('should return [0,0,0] if all elements are known', () => {
        delete map.unknown;
        expect(estimateIntelligibility(make(map))).toEqual([0, 0, 0]);
    });

    test.each([
        ['be'],
        ['bg'],
        ['cs'],
        ['hr'],
        ['mk'],
        ['pl'],
        ['ru'],
        ['sk'],
        ['sl'],
        ['sr'],
        ['uk'],
    ])('should return null if %s is missing', (lang) => {
        delete map[lang];
        expect(estimateIntelligibility(make(map))).toBeNull();
    });

    test.each([
        [{ be: '+', ru: '+', uk: '+' }, [0, 0, 2]],
        [{ hr: '+', sr: '+', sl: '+' }, [0, 1, 0]],
        [{ bg: '+', mk: '+' }, [0, 1, 0]],
        [{ cs: '+', pl: '+', sk: '+' }, [2, 0, 0]],
        [{ ru: '~' }, [0, 0, 0.5]],
        [{ pl: '~' }, [0.5, 0, 0]],
        [{ sr: '~' }, [0, 0.125, 0]],
    ])('for %j should return %j', (patch, vector) => {
        const sameInLanguages = make({ ...map, ...patch });
        expect(estimateIntelligibility(sameInLanguages)).toEqual(vector);
    });
});

function make(languages: Record<string, string>): string {
    return Object.entries(languages).reduce((acc, [lang, mark]) => {
        return (`${acc}${exclaim()}${lang}${mark} `);
    }, '');
}

function exclaim() {
    return Math.random() > 0.5 ? '!' : '';
}
