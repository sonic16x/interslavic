import { joinLemmas } from 'utils'

const lemmas = [
    ['id', 'isv', 'upos', 'xpos', 'addition', 'genesis'],
    ['1', 'bolěti (1)', 'VERB', 'v.intr. ipf.', '(bolěje)', ''],
    ['2', 'bolěti (2)', 'VERB', 'v.intr. ipf.', '(boli)', ''],
    ['3', 'djabȯl', 'NOUN', 'm.anim.', '(djabla)', 'I'],
    ['4', 'djavȯl', 'NOUN', 'm.anim.', '(djavla)', 'I'],
    ['5', 'izbaviti', 'VERB', 'v.tr./intr. pf.', '', ''],
    ['6', 'myti sę', 'VERB', 'v.refl. ipf.', '', ''],
    ['7', 'uho', 'NOUN', 'n.', '(uha/ušese; pl. uši)', ''],
    ['8', 'uško', 'NOUN', 'n.', '', ''],
]
const header = ['id', 'isv', 'addition', 'partOfSpeech', 'genesis', 'upos']

test('joinLemmas', () => {
    const words = [
        header,
        ['10', 'bolěti (2)', 'stale', 'stale', 'stale', 'VERB'],
        ['11', 'djabȯl, djavȯl', '', '', '', 'NOUN'],
        ['12', '!izbaviti (+2)', '(+2)', 'v.tr. pf.', '', 'VERB'],
        ['13', 'Dobro jutro!', '', 'intj.', '', ''],
        ['14', 'slovo', '', 'n.', '', 'NOUN'],
        ['15', 'kupati sę', '', 'v.refl. ipf.', '', 'VERB'],
        ['16', 'uho, uško [@]', '', '', '', 'NOUN'],
        ['17', 'uho, djabȯl', '', '', '', 'NOUN'],
    ]

    expect(joinLemmas(words, lemmas)).toEqual([
        { id: '14', isv: 'slovo', lemma: 'slovo' },
        { id: '15', isv: 'kupati sę', lemma: 'kupati sę' },
    ])
    expect(words.slice(1)).toEqual([
        ['10', 'bolěti (2)', '(boli)', 'v.intr. ipf.', '', 'VERB'],
        ['11', 'djabȯl, djavȯl', '(djabla) | (djavla)', 'm.anim.', 'I', 'NOUN'],
        ['12', '!izbaviti (+2)', '(+2)', 'v.tr./intr. pf.', '', 'VERB'],
        ['13', 'Dobro jutro!', '', 'phrase', '', ''],
        ['14', 'slovo', '', 'n.', '', 'NOUN'],
        ['15', 'kupati sę', '', 'v.refl. ipf.', '', 'VERB'],
        ['16', 'uho, uško [@]', '(uha/ušese; pl. uši) | ', 'n.', '', 'NOUN'],
        ['17', 'uho, djabȯl', '(uha/ušese; pl. uši) | (djabla)', 'n. | m.anim.', '', 'NOUN'],
    ])
})

test('joinLemmas leaves a table without upos alone', () => {
    const words = [header.slice(0, 5), ['10', 'bolěti', '(boli)', 'v.intr. ipf.', '']]

    expect(joinLemmas(words, lemmas)).toEqual([])
    expect(words[1]).toEqual(['10', 'bolěti', '(boli)', 'v.intr. ipf.', ''])
})
