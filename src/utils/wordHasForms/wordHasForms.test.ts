import { wordHasForms } from 'utils'

test('wordHasForms', () => {
    const cases: [string, string, boolean][] = [
        ['kot', 'm.anim.', true],
        ['Blizky Vȯzhod', 'm.sg.', false],
        ['adres, adresa', 'm.', true],
        ['dělati', 'v.tr. ipf.', true],
        ['kako', 'adv.', false],
        // marks in parentheses are not part of the lemma
        ['dělo (1)', 'n.', true],
        ['vråta (sport)', 'n.pl.', true],
        ['izbaviti (+2)', 'v.tr. pf.', true],
    ]
    cases.forEach(([isv, details, expected]) => expect(wordHasForms(isv, details)).toBe(expected))
})
