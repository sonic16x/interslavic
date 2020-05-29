/*
* Source http://steen.free.fr/interslavic/conjugator.html
*/

/* tslint:disable */

const prefixes = [
    'do', 'iz', 'izpo', 'nad', 'na', 'ne', 'ob', 'odpo', 'od', 'o', 'prědpo',
    'pod', 'po', 'prě', 'pre', 'pri', 'pro', 'råzpro', 'razpro', 'råz', 'raz',
    'sȯ', 's', 'u', 'vȯ', 'vo', 'v', 'vȯz', 'voz', 'vy', 'za',
];

export function conjugationVerbFlat(inf, rawPts): any {
    const result: any = conjugationVerb(inf, rawPts);
    if (!result) {
        return [];
    }
    const forms = [
        ...result.conditional.filter(Boolean).map((item) => item.split(' ')[1].replace(/[()]/g, '')),
        result.gerund,
        ...result.imperative.replace(/ /g, '').split(','),
        ...result.imperfect,
        result.infinitive,
        ...result.pfap.replace(/[(),]/g, '').split(' '),
        ...result.pfpp.replace(/[(),]/g, '').split(' '),
        ...result.prap.replace(/[(),]/g, '').split(' '),
        ...result.prpp.replace(/[(),]/g, '').split(' '),
        ...result.present.join(',').replace(/ /g, '').split(',')
    ].filter(Boolean).filter((item) => item.indexOf('-') === -1);
    return Array.from(new Set(forms));
}

export function conjugationVerb(inf, rawPts): any {
    //special cases
    if (inf.split(' ')[0].includes('/')) {
        return null;
    }
    if (inf === 'sųt' || inf === 'je' || inf === 'jest') {
        inf = 'byti';
    }
    const pts = rawPts.replace(/[()]/g, '').split(/[;,/]/)[0].replace(/\+\d/,'');
    const refl = reflexive(inf);
    const pref = prefix(inf);
    const is = infinitive_stem(pref, inf, pts);
    const ps = present_tense_stem(pref, pts, is);
    const psi = secondary_present_tense_stem(ps);
    const lpa = l_participle(pref, pts, is);

    const infinitive = build_infinitive(pref, is, refl);
    const present = buildPresent(pref, ps, psi, refl);
    const imperfect = build_imperfect(pref, is, refl);
    const perfect = buildPerfect(lpa, refl);
    const pluperfect = buildPluralPerfect(lpa, refl);
    const future = buildFuture(infinitive, ps);
    const conditional = buildConditional(lpa, refl);
    const imperative = build_imperative(pref, psi, refl);
    const prap = build_prap(pref, ps, refl);
    const prpp = build_prpp(pref, ps, psi);
    const pfap = build_pfap(lpa, refl);
    const pfpp = build_pfpp(pref, is, psi);
    const gerund = build_gerund(pfpp, refl);

    return {
        infinitive,
        present,
        imperfect,
        perfect,
        pluperfect,
        future,
        conditional,
        imperative,
        prap,
        prpp,
        pfap,
        pfpp,
        gerund,
    }
}

function reflexive(inf) {
    let result = '';
    /*if ((inf.lastIndexOf('se') == inf.length - 2) || (inf.lastIndexOf('sę') == inf.length - 2) ||
        (inf.indexOf('se ') == 0) || (inf.indexOf('sę ') == 0)) {
        result = ' sę';
    }*/
    if(inf.indexOf(' ') !== -1 && ['se', 'sę'].indexOf(inf.split(' ')[1]) !== -1) {
        result = ' sę';
    }
    else {
        result = '';
    }
    return result;
}

function prefix(inf) {
    // get prefixes for some non-regular verbs
    let prefArr = prefixes.filter(
        prfx => inf.indexOf(prfx) === 0 &&
        ['věděti', 'vedeti', 'jesti', 'jěsti', 'dati', 'dųti', 'byti', 'žegti'].
            includes(inf.split(' ')[0].slice(prfx.length))
    );
    if (prefArr.length > 0) {
        return prefArr[0];
    }
    // get prefix separated with '-'
    const kreska = inf.indexOf('-');
    if (kreska != -1) {
        return inf.substring(0, kreska + 1);
    }
    // get prefix 'ne '
    if(inf.indexOf('ne ') === 0) {
        return 'ne ';
    }

    /*	else if ((inf.substring (0, 4) == 'pred') || (inf.substring (0, 4) == 'prėd'))
        {	result = inf.substring (0, 4); 	}
    else if ((inf.substring (0, 3) == 'pre') || (inf.substring (0, 3) == 'prė'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 3) == 'pri') || (inf.substring (0, 3) == 'pro'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 3) == 'raz') || (inf.substring (0, 3) == 'råz'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 3) == 'pod') || (inf.substring (0, 3) == 'nad'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 2) == 'po') || (inf.substring (0, 2) == 'na'))
        {	result = inf.substring (0, 2); 	}
    else if ((inf.substring (0, 2) == 'do') || (inf.substring (0, 2) == 'za'))
        {	result = inf.substring (0, 2); 	}
    else if ((inf.substring (0, 2) == 'iz') || (inf.substring (0, 2) == 'od'))
        {	result = inf.substring (0, 2); 	}
    else if ((inf.substring (0, 2) == 'vy') || (inf.substring (0, 2) == 'ob'))
        {	result = inf.substring (0, 2); 	}
    */
    return '';
}

function infinitive_stem(pref, inf, pts) {
    let trunc = '';
    let result = '';

    inf = inf.replace(pref, '');

    if (inf.length == 0) {
        result = 'ERROR-1';
        return result;
    }
    /*else if ((inf.lastIndexOf('se') == inf.length - 2) || (inf.lastIndexOf('sę') == inf.length - 2)) {
        trunc = inf.substring(0, inf.length - 3);
    }
    else if ((inf.indexOf('se ') == 0) || (inf.indexOf('sę ') == 0)) {
        trunc = inf.substring(3, inf.length);
    }*/
    else if(inf.includes(' ')) {
        trunc = inf.slice(0,inf.indexOf(' '));
    }
    else {
        trunc = inf;
    }

    if (trunc == '') {
        result = 'ERROR-2';
        return result;
    }

    if ( trunc.slice(-2) === 'ti' || trunc.slice(-2) === 'tì') {
        result = trunc.substring(0, trunc.length - 2);
    }
    else if ( trunc.slice(-1) === 't' || trunc.slice(-1) === 'ť' ) {
        result = trunc.substring(0, trunc.length - 1);
    }
    else {
        result = 'ERROR-2';
    }

    if (result.slice(-1) === 's') {
        // *jesti
        if( result === 'jes') {
            result = 'jed';
        }
        //steam based on pts
        else if( pts ) {
            result = pts.slice(0, -1);
        }
        /*result = result.substring(0, result.length - 1) + 'd';
        if (result == 'ned') {
            result = 'nes';
        }
        else if (result.lastIndexOf('gned') == (result.length - 4)) {
            result = result.replace(/gned/, 'gnet');
        }
        else if (result.lastIndexOf('pled') == (result.length - 4)) {
            result = result.replace(/pled/, 'plet');
        }
        else if (result.lastIndexOf('strěd') == (result.length - 5)) {
            result = result.replace(/strěd/, 'strět');
        }
        else if (result.lastIndexOf('stred') == (result.length - 5)) {
            result = result.replace(/stred/, 'stret');
        }
        else if (result.lastIndexOf('tręd') == (result.length - 4)) {
            result = result.replace(/tręd/, 'tręs');
        }
        else if (result.lastIndexOf('tred') == (result.length - 4)) {
            result = result.replace(/tred/, 'tres');
        }
        else if (result.lastIndexOf('ned') == (result.length - 3)) {
            result = result.replace(/ned/, 'nes');
        }*/
    }
    return result;
}

function present_tense_stem(pref, pts, is) {
    let result = is;

    if (pts.length == 0) {
        if (((result.slice(-3) === 'ova') || (result.slice(-3) === 'eva')) && (result != 'hova')) {
            result = (result.slice(0, -3) + 'uj');
        }
        else if (((result.slice(-2) === 'nu') || (result.slice(-2) === 'nų')) && (result.length > 3)) {
            result = (result.slice(0, -1));
        }
        else if (result.slice(-1) === 'ę') {
            if (result.slice(-2) === 'ję') {
                if (result.slice(-3) === 'bję' || result.slice(-3) === 'dję'
                    || result.slice(-3) === 'sję' || result.slice(-3) === 'zję') {
                    result = (result.slice(0, -2) + 'ȯjm');
                }
                else {
                    result = (result.slice(0, -1) + 'm');
                }
            }
            else if (result === 'vzę') {
                result = 'vȯzm';
            }
            else {
                result = (result.slice(0, -1) + 'n');
            }
        }
        else if (result.slice(-1) == 'ų') {
            result = (result.slice(0, -1) /*+ 'm'*/);
        }
        else if ((/*result.slice(-1) == 'i' ||*/ result.slice(-1) == 'y' ||
            result.slice(-1) == 'o' || result.slice(-1) == 'u' ||
            result.slice(-1) == 'ě' || result.slice(-1) == 'e') && result.length < 4) {
            /*if (result == 'uči') {
                result = 'uči';
            }
            else*/
            if (result.charAt(0) == 'u') {
                result = result + 'ĵ';
            }
            else {
                result = result + 'j';
            }
        }
        else if (result.slice(-1) == 'a' || result.slice(-1) == 'e' || result.slice(-1) == 'ě') {
            result = result + 'ĵ';
        }
    }
    else {
        if (((pts.slice(-2) === 'se') || (pts.slice(-2) === 'sę')) && (pts.length > 2)) {
            pts = pts.slice(0, -3);
        }
        else if ((pts.indexOf('se ') == 0) || (pts.indexOf('sę ') == 0)) {
            pts = pts.slice(3);
        }

        if (pref.length !== 0) {
            if (pts.indexOf(pref) !== -1) {
                pts = pts.slice(pref.length);
            }
            else {
                pts = pts.slice(pref.length - 1);
            }
        }
        if ((pts.slice(-1) === '-') || (pts.slice(-1) === 'm') || (pts.slice(-1) === 'e') ||
            (pts.slice(-1) === 'ų') || (pts.slice(-1) === 'u')) {
            result = pts.slice(0, -1);
        }
        else {
            result = pts;
        }
    }

    if ((is == 'by') && (pref == '') || ((result == 'je' || result == 'j') && (is == 'bi'))) {
        result = 'jes';
    }
    else if (result == 'věděĵ') {
        result = 'vě';
    }
    else if (result == 'jed' || result == 'j' && is == 'jed') {
        result = 'je';
    }
    else if (result == 'jěd' || result == 'j' && is == 'jěd') {
        result = 'jě';
    }
    else if (result == 'jad' || result == 'j' && is == 'jad') {
        result = 'ja';
    }
    else if (result == 'daĵ') {
        result = 'da';
    }
    else if (result == 'žeg' || result == 'žž') {
        result = 'žg';
    }
    if ((result == 'jěhaĵ') || ((result == 'jě') && (is == 'jěha'))) {
        result = 'jěd';
    }
    if ((result == 'jehaĵ') || ((result == 'je') && (is == 'jeha'))) {
        result = 'jed';
    }
    if ((result == 'jahaĵ') || ((result == 'ja') && (is == 'jaha'))) {
        result = 'jad';
    }
    return result;
}

function secondary_present_tense_stem(ps) {
    const i = (ps.length - 1);
    if (ps.charAt(i) == 'g') {
        return ps.substring(0, i) + 'ž';
    }
    else if (ps.charAt(i) == 'k') {
        return ps.substring(0, i) + 'č';
    }
    else {
        return ps;
    }
}

function l_participle(pref, pts, is) {
    let result = '';
    if ((is == 'vojd') || (is == 'vȯjd')) {
        result = 'všėl';
    }
    else if ((is == 'id') || (is == 'jd')) {
        result = pref + 'šėl';
    }
    else if ((is.slice(-2) == 'id') ||
        (is.slice(-2) == 'jd')) {
        result = pref + is.slice(0, -2) + 'šėl';
    }
    //treti - trl (by Ranmaru Rei)
    else if (is.match(/r[eě]$/) && pts.match(/re$/)) {
        result = pref + is.slice(0, -2) + 'ŕl';
    }
    else {
        result = pref + is + 'l';
    }
    return result;
}

function build_infinitive(pref, is, refl) {
    if ( is.slice(-2) === 'st' ) {
        is = is.slice(0, -1);
    }
    else if ( is.slice(-1) === 't' || is.match(/[^ij]d$/ )) {
        is = is.slice(0, -1) + 's';
    }
    return transliterateBack(pref + is + 'tì' + refl);
}

function buildPresent(pref, ps, psi, refl) {
    switch (ps) {
        case 'jes':
            return ['jesm','jesi','jest (je)','jesmȯ','jeste','sųt']
                .map(transliterateBack);
        case 'da':
            return ['dam', 'daš', 'da', 'damȯ', 'date', 'dadųt']
                .map((word) => transliterateBack(`${pref}${word}${refl}`));
        case 'vě':
            return ['věm', 'věš', 'vě', 'věmȯ', 'věte', 'vědųt']
                .map((word) => transliterateBack(`${pref}${word}${refl}`));
        case 'jě':
            return ['jěm', 'jěš', 'jě', 'jěmȯ', 'jěte', 'jědųt']
                .map((word) => transliterateBack(`${pref}${word}${refl}`));
        case 'je':
            return ['jem', 'ješ', 'je', 'jemȯ', 'jete', 'jedųt']
                .map((word) => transliterateBack(`${pref}${word}${refl}`));
        case 'ja':
            return ['jam', 'jaš', 'ja', 'jamȯ', 'jate', 'jadųt']
                .map((word) => transliterateBack(`${pref}${word}${refl}`));
    }

    switch (ps.slice(-1)) {
        case 'ĵ': {
            const cut = ps.slice(0, -1);
            const pps = `${cut}j`;
            return [
                `${pref}${pps}ų${refl}, ${pref}${cut}m${refl}`,
                `${pref}${pps}eš${refl}, ${pref}${cut}š${refl}`,
                `${pref}${pps}e${refl}, ${pref}${cut}${refl}`,
                `${pref}${pps}emȯ${refl}, ${pref}${cut}mo${refl}`,
                `${pref}${pps}ete${refl}, ${pref}${cut}te${refl}`,
                `${pref}${pps}ųt${refl}`,
            ].map(transliterateBack);
        }
        case 'i': {
            const cut = ps.slice(0, -1);
            return [
                `${pref}${cut}xų${refl}, ${pref}${ps}m${refl}`,
                `${pref}${ps}š${refl}`,
                `${pref}${ps}${refl}`,
                `${pref}${ps}mȯ${refl}`,
                `${pref}${ps}te${refl}`,
                `${pref}${cut}ęt${refl}`,
            ].map(transliterateBack);
        }
        default:
            return [
                `${pref}${ps}ų${refl}, ${pref}${psi}em${refl}`,
                `${pref}${psi}eš${refl}`,
                `${pref}${psi}e${refl}`,
                `${pref}${psi}emȯ${refl}`,
                `${pref}${psi}ete${refl}`,
                `${pref}${ps}ųt${refl}`,
                '',
            ].map(transliterateBack);
    }
}

function build_imperfect(pref, is, refl) {
    let impst = '';
    let i = is.length - 1;
    if (!is.charAt(i).match(/[aeiouyęųåěėȯ)]/)) {
        if (is.charAt(i) == 'k') {
            impst = is.substring(0, i) + 'če';
        }
        else if (is.slice(-3) === 'žeg') {
            impst = 'žže';
        }
        else if (is.charAt(i) == 'g') {
            impst = is.substring(0, i) + 'že';
        }
        else {
            impst = is + 'e';
        }
    }
    else if (is == 'by' && pref == '') {
        impst = 'bě';
    }
    else {
        impst = is;
    }

    return [
        `${pref}${impst}h${refl}`,
        `${pref}${impst}še${refl}`,
        `${pref}${impst}še${refl}`,
        `${pref}${impst}hmȯ${refl}`,
        `${pref}${impst}ste${refl}`,
        `${pref}${impst}hų${refl}`,
    ].map(transliterateBack);
}

function buildFuture(infinitive, ps) {
    if ((((infinitive == 'biti') || (infinitive == 'бити')) && ((ps == 'j') || (ps == 'je') || (ps == 'jes')))
        || (infinitive == 'byti') || (infinitive == 'bytì') || (infinitive == 'быти')) {
        infinitive = '';
    }
    const verb = transliterateBack(infinitive);
    return [
        `bųdų ${verb}`,
        `bųdeš ${verb}`,
        `bųde ${verb}`,
        `bųdemȯ ${verb}`,
        `bųdete ${verb}`,
        `bųdųt ${verb}`,
    ];
}

function buildPerfect(lpa, refl) {
    const result = [
        `jesm ${lpa}(a)${refl}`,
        `jesi ${lpa}(a)${refl}`,
        `(je) ${lpa}${refl}`,
        `(je) ${lpa}a${refl}`,
        `(je) ${lpa}o${refl}`,
        `jesmȯ ${lpa}i${refl}`,
        `jeste ${lpa}i${refl}`,
        `(sųt) ${lpa}i${refl}`,
        ''
    ];

    return result.map((line) => {
        let res = line.includes('šėl') ?  idti(line) : line;
        res = res.includes('žegl') ?  zegti(res) : res;
        return transliterateBack(res);
    });
}

function buildPluralPerfect(lpa, refl) {
    const result = [
        `běh ${lpa}(a)${refl}`,
        `běše ${lpa}(a)${refl}`,
        `běše ${lpa}${refl}`,
        `běše ${lpa}a${refl}`,
        `běše ${lpa}o${refl}`,
        `běhmo ${lpa}i${refl}`,
        `běste ${lpa}i${refl}`,
        `běhų ${lpa}i${refl}`,
        ''
    ];

    return result.map((line) => {
        let res = line.indexOf('šėl') !== -1 ?  idti(line) : line;
        res = res.includes('žegl') ?  zegti(res) : res;
        return transliterateBack(res);
    });
}

function buildConditional(lpa, refl) {
    const result = [
        `byh ${lpa}(a)${refl}`,
        `bys ${lpa}(a)${refl}`,
        `by ${lpa}${refl}`,
        `by ${lpa}a${refl}`,
        `by ${lpa}o${refl}`,
        `byhmȯ ${lpa}i${refl}`,
        `byste ${lpa}i${refl}`,
        `by ${lpa}i${refl}`,
        ''
    ];

    return result.map((line) => {
        let res = line.indexOf('šėl') !== -1 ?  idti(line) : line;
        res = res.includes('žegl') ?  zegti(res) : res;
        return transliterateBack(res);
    });
}

function build_imperative(pref, ps, refl) {
    let p2s = '';
    let i = (ps.length - 1);

    if (ps == 'jes') {
        p2s = 'bųď';
    }
    else if (ps == 'da') {
        p2s = pref + 'daj';
    }
    else if (ps == 'je') {
        p2s = pref + 'jeď';
    }
    else if (ps == 'jě') {
        p2s = pref + 'jěď';
    }
    else if (ps == 'ja') {
        p2s = pref + 'jaď';
    }
    else if (ps == 'vě') {
        p2s = pref + 'věď';
    }
    else if ((ps.charAt(i) == 'ĵ') || (ps.charAt(i) == 'j')) {
        p2s = pref + ps;
    }
    else if ((ps.charAt(i) == 'a') || (ps.charAt(i) == 'e') || (ps.charAt(i) == 'ě')) {
        p2s = pref + ps + 'j';
    }
    else if (ps.charAt(i) == 'i') {
        p2s = pref + ps;
    }
    else {
        p2s = pref + ps + 'i';
    }

    let result = p2s + refl + ', ' + p2s + 'mȯ' + refl + ', ' + p2s + 'te' + refl;
    result = result.replace(/jij/g, 'j');
    result = result.replace(/ĵij/g, 'ĵ');
    result = transliterateBack(result);
    return result;
}

function build_prap(pref, ps, refl) {
    let cut = '';
    const i = (ps.length - 1);


    if (ps == 'jes') {
        ps = pref + 'sų';
    }
    else if (ps == 'da') {
        ps = pref + 'dadų';
    }
    else if (ps == 'je') {
        ps = pref + 'jedų';
    }
    else if (ps == 'jě') {
        ps = pref + 'jědų';
    }
    else if (ps == 'ja') {
        ps = pref + 'jadų';
    }
    else if (ps == 'vě') {
        ps = pref + 'vědų';
    }

    else if ((ps.charAt(i) == 'a') || (ps.charAt(i) == 'e') || (ps.charAt(i) == 'ě')) {
        ps = pref + ps + 'jų';
    }
    else if (ps.charAt(i) == 'i') {
        cut = ps.substring(0, ps.length - 1);
        ps = pref + cut + 'ę';
    }
    else {
        ps = pref + ps + 'ų';
    }

    return transliterateBack(ps + 'ćí (' + ps + 'ćá, ' + ps + 'ćé)' + refl);
}

function build_prpp(pref, ps, psi) {
    let result = '';

    if (ps == 'jes') {
        result = '—';
    }
    else if (ps == 'da') {
        ps = 'dado';
    }
    else if (ps == 'je') {
        ps = 'jedo';
    }
    else if (ps == 'jě') {
        ps = 'jědo';
    }
    else if (ps == 'ja') {
        ps = 'jado';
    }
    else if (ps == 'vě') {
        ps = 'vědo';
    }

    const i = (ps.length - 1);
    let cut = '';
    if (ps.charAt(i) == 'ĵ') {
        cut = ps.substring(0, i);
        ps = cut + 'j';
        result = pref + ps + 'emý (—á, —œ)' + ', ' + pref + cut + 'mý (—á, —œ)';
    }
    else if (ps.charAt(i) == 'j') {
        result = pref + psi + 'emý (' + pref + psi + 'emá, ' + pref + psi + 'emœ)';
    }
    else if ((ps.charAt(i) == 's') || (ps.charAt(i) == 'z')
        || (ps.charAt(i) == 't') || (ps.charAt(i) == 'd')
        || (ps.charAt(i) == 'l')) {
        result = pref + ps + 'omý (' + pref + ps + 'omá, ' + pref + ps + 'omœ)';
    }
    else if ((ps.charAt(i) == 'i') || (ps.charAt(i) == 'o')) {
        result = pref + ps + 'mý (' + pref + ps + 'má, ' + pref + ps + 'mœ)';
    }
    else if (result != '—') {
        result = pref + psi + 'emý (' + pref + psi + 'emá, ' + pref + psi + 'emœ)';
    }

    result = transliterateBack(result);
    return result;
}

function build_pfap(lpa, refl) {
    let result = '';
    if (lpa.slice(-2, -1).match(/[aeiouyęųåěėȯ)]/)) {
        result = lpa.substring(0, lpa.length - 1) + 'vši' + refl;
    }
    else {
        result = lpa.substring(0, lpa.length - 1) + 'ši' + refl;
    }
    if (result.indexOf('šėv') != -1) {
        result = idti(result);
    }
    result = result + ' (' + result.slice(0, -1) + "á, " + result.slice(0, -1) + "é)";
    result = transliterateBack(result);
    return result;
}


function build_pfpp(pref, is, psi) {
    let ppps = '';
    const i = (is.length - 1);
    /* old rule for -t
    if (((is.charAt(i) != 'j') && ((psi.charAt(psi.length - 1) == 'j') && (i < 4) && (is.charAt(0) != 'u')) || (is == 'by')) || (is.charAt(i) == 'ę')) {
        ppps = pref + is + 't';
    }*/
    // rule for -t by Ranmaru Rei
    if(is.match(/r[eě]$/ ) && psi.match(/r$/)) {
        ppps = pref + is.slice(0, -2) + 'ŕt';
    }
    else if (
        is.match(/[iyuě]$/) && psi.match(/[jvn]$/) && psi !== 'imaj' ||
        is.match(/[ęuųå]$/ ) ||
        is === 'by' ||
        is.match(/lě$/ ) && psi.match(/lj$/)
    ) {
        ppps = pref + is + 't';
    }
    // end rule for -t
    /*else if (((is.charAt(i) == 'ų') || (is.charAt(i) == 'u')) && (is.charAt(i - 1) == 'n')) {
        ppps = pref + psi + 'en';
    }
    else if ((is.charAt(i) == 'ų') || (is.charAt(i) == 'u')) {
        ppps = pref + is + 't';
    }*/
    else if ((is.charAt(i) == 'a') || (is.charAt(i) == 'e') || (is.charAt(i) == 'ě')) {
        ppps = pref + is + 'n';
    }
    else if (is.charAt(i) == 'i') {
        ppps = pref + is + 'Xen';
        ppps = ppps.replace(/stiX/g, 'šćX');
        ppps = ppps.replace(/zdiX/g, 'žđX');
        ppps = ppps.replace(/siX/g, 'šX');
        ppps = ppps.replace(/ziX/g, 'žX');
        ppps = ppps.replace(/tiX/g, 'ćX');
        ppps = ppps.replace(/diX/g, 'đX');
        ppps = ppps.replace(/riX/g, 'řX');
        ppps = ppps.replace(/liX/g, 'ľX');
        ppps = ppps.replace(/niX/g, 'ňX');
        ppps = ppps.replace(/jiX/g, 'jX');
        ppps = ppps.replace(/šiX/g, 'šX');
        ppps = ppps.replace(/žiX/g, 'žX');
        ppps = ppps.replace(/čiX/g, 'čX');
        ppps = ppps.replace(/iX/g, 'jX');
        ppps = ppps.replace(/X/g, '');
    }
    else if ((is.charAt(i) == 'k') || (is.charAt(i) == 'g')) {
        if (psi.slice(-1) === 'i') {
            ppps = pref + psi.slice(0,-1) + 'en';
        } else {
            ppps = pref + psi + 'en';
        }
    }
    else {
        ppps = pref + is + 'en';
    }

    return transliterateBack(ppps + 'ý (' + ppps + 'á, ' + ppps + 'ó)');
}

function build_gerund(pfpp, refl) {
    const ppps = (pfpp.indexOf('(') - 2);
    return transliterateBack(pfpp.substring(0, ppps) + 'ıje' /*+ refl*/);
}

function idti(sel) {
    return sel
        .replace('šėl(a)', 'šėl/šla')
        .replace('šėl(a)', 'šėl/šla')
        .replace('všėl/šla', 'všėl/vȯšla')
        .replace('všėl/šla', 'všėl/vȯšla')
        .replace(/šėla/g, 'šla')
        .replace(/šėlo/g, 'šlo')
        .replace(/šėli/g, 'šli')
        .replace(/všl/g, 'vȯšl')
        .replace(/iz[oȯ]š/g, 'izš')
        .replace(/ob[oȯ]š/g, 'obš')
        .replace(/od[oȯ]š/g, 'odš')
        .replace(/pod[oȯ]š/g, 'podš')
        .replace(/nad[oȯ]š/g, 'nadš')
    ;
}

function zegti(zeg) {
    return zeg
        .replace(/žegl\(a\)$/g, 'žegl/žgla')
        .replace(/žegla$/g, 'žgla')
        .replace(/žeglo$/g, 'žglo')
        .replace(/žegli$/g, 'žgli');
}

function transliterateBack(iW) {
    return iW
        .replace(/stx/, 'šć')
        .replace(/zdx/, 'žđ')
        .replace(/sx/, 'š')
        .replace(/šx/, 'š')
        .replace(/zx/, 'ž')
        .replace(/žx/, 'ž')
        .replace(/cx/, 'č')
        .replace(/čx/, 'č')
        .replace(/tx/, 'ć')
        .replace(/dx/, 'đ')
        .replace(/jx/, 'j')
        .replace(/x/, 'j')
        .replace(/-/g, '')
        .replace(/—/g, '-')
        //
        .replace(/lı/g, "ľ")
        .replace(/nı/g, "ń")
        .replace(/rı/g, "ŕ")
        .replace(/tı/g, "ť")
        .replace(/dı/g, "ď")
        .replace(/sı/g, "ś")
        .replace(/zı/g, "ź")
        .replace(/ı/g, "")
    ;
}
