import { setLang, t } from 'translations'

import { expandAbbr } from './expandAbbr'

describe('expandAbbr', () => {
    beforeAll(() => {
        setLang('en')
    })

    test.each([
        ['adj.', ['adjective']],
        ['adj.comp.', ['adjective', 'comparative-degree']],
        ['adj.sup.', ['adjective', 'superlative-degree']],
        ['adv.', ['adverb']],
        ['conj.', ['conjunction']],
        ['f.', ['noun', 'noun-feminine']],
        ['f.indecl.', ['noun', 'noun-feminine', 'noun-indeclinable']],
        ['f.pl.', ['noun', 'noun-feminine', 'noun-plural']],
        ['f.sg.', ['noun', 'noun-feminine', 'noun-singular']],
        ['intj.', ['interjection']],
        ['m.', ['noun', 'noun-masculine', 'noun-inanimate']],
        ['m./f.', ['noun', 'noun-masculineOrFeminine', 'noun-inanimate']],
        ['m.indecl./f.indecl.', ['noun', 'noun-masculine', 'noun-inanimate', 'noun-indeclinable']], // TODO: should be 'noun-masculineOrFeminine'
        ['m.anim.', ['noun', 'noun-masculine', 'noun-animate']],
        ['m.anim.indecl.', ['noun', 'noun-masculine', 'noun-animate', 'noun-indeclinable']],
        ['m.indecl.', ['noun', 'noun-masculine', 'noun-inanimate', 'noun-indeclinable']],
        ['m.pl.', ['noun', 'noun-masculine', 'noun-inanimate', 'noun-plural']],
        ['m.sg.', ['noun', 'noun-masculine', 'noun-inanimate', 'noun-singular']],
        ['n.', ['noun', 'noun-neuter']],
        ['n.indecl.', ['noun', 'noun-neuter', 'noun-indeclinable']],
        ['n.pl.', ['noun', 'noun-neuter', 'noun-plural']],
        ['n.sg.', ['noun', 'noun-neuter', 'noun-singular']],
        ['num.', ['numeral']],
        ['num.card.', ['numeral', 'numeral-cardinal']],
        ['num.coll.', ['numeral', 'numeral-collective']],
        ['num.diff.', ['numeral', 'numeral-differential']],
        ['num.fract.', ['numeral', 'numeral-fractional']],
        ['num.mult.', ['numeral', 'numeral-multiplicative']],
        ['num.ord.', ['numeral', 'numeral-ordinal']],
        ['num.subst.', ['numeral', 'numeral-substantivized']],
        ['particle', ['particle']],
        ['phrase', ['phrase']],
        ['prefix', ['prefix']],
        ['prep.', ['preposition']],
        ['pron.dem.', ['pronoun', 'pronoun-demonstrative']],
        ['pron.indef.', ['pronoun', 'pronoun-indefinite']],
        ['pron.int.', ['pronoun', 'pronoun-interrogative']],
        ['pron.pers.', ['pronoun', 'pronoun-personal']],
        ['pron.poss.', ['pronoun', 'pronoun-possessive']],
        ['pron.rec.', ['pronoun', 'pronoun-reciprocal']],
        ['pron.refl.', ['pronoun', 'pronoun-reflexive']],
        ['pron.rel.', ['pronoun', 'pronoun-relative']],
        ['suffix', ['suffix']],
        ['v.aux. ipf.', ['verb', 'verb-auxiliar', 'verb-imperfective']],
        ['v.aux. pf.', ['verb', 'verb-auxiliar', 'verb-perfective']],
        ['v.intr. ipf.', ['verb', 'verb-intransitive', 'verb-imperfective']],
        ['v.intr. ipf./pf.', ['verb', 'verb-intransitive', 'verb-imperfectiveOrPerfective']],
        ['v.intr. pf.', ['verb', 'verb-intransitive', 'verb-perfective']],
        ['v.ipf.', ['verb', 'verb-imperfective']],
        ['v.pf.', ['verb', 'verb-perfective']],
        ['v.refl. ipf.', ['verb', 'verb-reflexive', 'verb-imperfective']],
        ['v.refl. ipf./pf.', ['verb', 'verb-reflexive', 'verb-imperfectiveOrPerfective']],
        ['v.refl. pf.', ['verb', 'verb-reflexive', 'verb-perfective']],
        ['v.tr. ipf.', ['verb', 'verb-transitive', 'verb-imperfective']],
        ['v.tr. ipf./pf.', ['verb', 'verb-transitive', 'verb-imperfectiveOrPerfective']],
        ['v.tr. pf.', ['verb', 'verb-transitive', 'verb-perfective']],
        ['invalid', []],
        ['', []],
    ])('should expand abbreviation %s correctly', (abbr, expectedParts) => {
        const expected = expectedParts.map(key => t(key)).join(', ')
        expect(expandAbbr(t, abbr)).toEqual(expected)
    })
})
