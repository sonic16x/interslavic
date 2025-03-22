import { setLang, t } from 'translations'

import { translateAbbr } from './translateAbbr'

describe('translateAbbr', () => {
    beforeAll(() => {
        setLang('en')
    })

    test.each([
        ['adj.', 'adj.'],
        ['adj.comp.', 'adj. comp.'],
        ['adj.sup.', 'adj. sup.'],
        ['adv.', 'adv.'],
        ['conj.', 'conj.'],
        ['f.', 'f.'],
        ['f.indecl.', 'f. indecl.'],
        ['f.pl.', 'f. pl.'],
        ['f.sg.', 'f. sg.'],
        ['intj.', 'intj.'],
        ['m.', 'm.'],
        ['m./f.', 'm./f.'],
        ['m.indecl./f.indecl.', 'm. indecl.'], // TODO: should be 'm./f. indecl.'
        ['m.anim.', 'm. anim.'],
        ['m.anim.indecl.', 'm. anim. indecl.'],
        ['m.indecl.', 'm. indecl.'],
        ['m.pl.', 'm. pl.'],
        ['m.sg.', 'm. sg.'],
        ['n.', 'n.'],
        ['n.indecl.', 'n. indecl.'],
        ['n.pl.', 'n. pl.'],
        ['n.sg.', 'n. sg.'],
        ['num.', 'num.'],
        ['num.card.', 'num. card.'],
        ['num.coll.', 'num. coll.'],
        ['num.diff.', 'num. diff.'],
        ['num.fract.', 'num. fract.'],
        ['num.mult.', 'num. mult.'],
        ['num.ord.', 'num. ord.'],
        ['num.subst.', 'num. subst.'],
        ['particle', 'particle'],
        ['phrase', 'phrase'],
        ['prefix', 'prefix'],
        ['prep.', 'prep.'],
        ['pron.dem.', 'pron. dem.'],
        ['pron.indef.', 'pron. indef.'],
        ['pron.int.', 'pron. int.'],
        ['pron.pers.', 'pron. pers.'],
        ['pron.poss.', 'pron. poss.',],
        ['pron.rec.', 'pron. rec.'],
        ['pron.refl.', 'pron. refl.'],
        ['pron.rel.', 'pron. rel.'],
        ['suffix', 'suffix'],
        ['v.aux. ipf.', 'v. aux. ipf.'],
        ['v.aux. pf.', 'v. aux. pf.'],
        ['v.intr. ipf.', 'v. intr. ipf.'],
        ['v.intr. ipf./pf.', 'v. intr. ipf./pf.'],
        ['v.intr. pf.', 'v. intr. pf.'],
        ['v.ipf.', 'v. ipf.'],
        ['v.pf.', 'v. pf.'],
        ['v.refl. ipf.', 'v. refl. ipf.'],
        ['v.refl. ipf./pf.', 'v. refl. ipf./pf.'],
        ['v.refl. pf.', 'v. refl. pf.'],
        ['v.tr. ipf.', 'v. tr. ipf.'],
        ['v.tr. ipf./pf.', 'v. tr. ipf./pf.'],
        ['v.tr. pf.', 'v. tr. pf.'],
        ['invalid', 'invalid'],
        ['', ''],
    ])('should expand abbreviation %s correctly', (abbr, expected) => {
        expect(translateAbbr(t, abbr)).toEqual(expected)
    })
})
