/*
* Source http://steen.free.fr/interslavic/conjugator.html
*/

/* tslint:disable */

export function conjugationVerb(inf, pts) {
    const refl = reflexive(inf);
    const pref = prefix(inf);
    const is = infinitive_stem(pref, inf);

    const ps = present_tense_stem(pref, pts, is);
    const psi = secondary_present_tense_stem(ps);
    const lpa = l_participle(pref, is);

    const infinitive = build_infinitive(pref, is, refl);
    const present = build_present(pref, ps, psi, refl);
    const imperfect = build_imperfect(pref, is, refl);
    const perfect = build_perfect(lpa, refl);
    const pluperfect = build_pluperfect(lpa, refl);
    const future = build_future(infinitive, ps);
    const conditional = build_conditional(lpa, refl);
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

    // result = '<table class='border' style='font-family:ms sans serif; font-size:10pt;'>';
    // result += '<tr><th class='leeg' width='50px' colspan='2'> </th><th> present </th><th> imperfect </th><th> future </th>';
    // result += '</tr><tr>';
    // result += '<th> 1sg <br> 2sg <br> 3sg <br> 1pl <br> 2pl <br> 3pl </th>';
    // result += transliterate_back ('<td align='center'> ja <br> ty <br> on/ona/ono <br> my <br> vy <br> oni/one </td>');
    // result += '	<td>' + present + '</td>';
    // result += '	<td>' + imperfect + '</td>';
    // result += '	<td>' + future + '</td>';
    // result += '</tr><tr>';
    // result += '	<th class='leeg' colspan='2'> </th><th> perfect </th><th> pluperfect </th><th> conditional </th>';
    // result += '</tr><tr>';
    // result += '	<th> 1sg <br> 2sg <br> 3sg <br><br> 1pl <br> 2pl <br> 3pl </th>';
    // result += transliterate_back ('<td align='center'> ja <br> ty <br> on <br> ona <br> ono <br> my <br> vy <br> oni/one </td>');
    // result += '	<td>' + perfect + '</td>';
    // result += '	<td>' + pluperfect + '</td>';
    // result += '	<td>' + conditional + '</td>';
    // result += '</tr></table><br>';
    // result += '<table class='border' style='font-family:ms sans serif; font-size:10pt;'>';
    // result += '	<tr><th> infinitive </th><td>' + infinitive + '</td>';
    // result += '	<tr><th> imperative </th><td>' + imperative + '</td>';
    // result += '	<tr><th> present active participle </th><td>' + prap + '</td>';
    // result += '	<tr><th> present passive participle </th><td>' + prpp + '</td>';
    // result += '	<tr><th> past active participle </th><td>' + pfap + '</td>';
    // result += '	<tr><th> past passive participle </th><td>' + pfpp + '</td>';
    // result += '	<tr><th> verbal&nbsp;noun </th><td>' + gerund + '</td>';
    // result += '</tr></table>';
}

function reflexive(inf) {
    let result = '';
    if ((inf.lastIndexOf('se') == inf.length - 2) || (inf.lastIndexOf('sę') == inf.length - 2) ||
        (inf.indexOf('se ') == 0) || (inf.indexOf('sę ') == 0)) {
        result = ' sę';
    }
    else {
        result = '';
    }
    return result;
}

function prefix(inf) {
    let result = '';
    const kreska = inf.indexOf('-');
    if (kreska != -1) {
        result = inf.substring(0, kreska + 1)
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
    return result;
}

function infinitive_stem(pref, inf) {
    let trunc = '';
    let result = '';

    inf = inf.replace(pref, '');

    if (inf.length == 0) {
        result = 'ERROR-1';
        return result;
    }
    else if ((inf.lastIndexOf('se') == inf.length - 2) || (inf.lastIndexOf('sę') == inf.length - 2)) {
        trunc = inf.substring(0, inf.length - 3);
    }
    else if ((inf.indexOf('se ') == 0) || (inf.indexOf('sę ') == 0)) {
        trunc = inf.substring(3, inf.length);
    }
    else {
        trunc = inf;
    }

    if (trunc == '') {
        result = 'ERROR-2';
        return result;
    }

    if ((trunc.lastIndexOf('ti') == (trunc.length - 2)) || (trunc.lastIndexOf('tì') == (trunc.length - 2))) {
        result = trunc.substring(0, trunc.length - 2);
    }
    else if ((trunc.lastIndexOf('t') == (trunc.length - 1)) || (trunc.lastIndexOf('ť') == (trunc.length - 1))) {
        result = trunc.substring(0, trunc.length - 1);
    }
    else {
        result = 'ERROR-2';
    }

    if (result.lastIndexOf('s') == result.length - 1) {
        result = result.substring(0, result.length - 1) + 'd';
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
        }
    }
    return result;
}

function present_tense_stem(pref, pts, is) {
    let result = is;

    if (pts.length == 0) {
        if (((result.substring(result.length - 3, result.length) == 'ova') || (result.substring(result.length - 3, result.length) == 'eva'))
            && (result != 'hova')) {
            result = (result.substring(0, result.length - 3) + 'uj');
        }
        else if (((result.substring(result.length - 2, result.length) == 'nu') || (result.substring(result.length - 2, result.length) == 'nų')) && (result.length > 3)) {
            result = (result.substring(0, result.length - 1));
        }
        else if (result.charAt(result.length - 1) == 'ę') {
            if (result.lastIndexOf('ję') == result.length - 2) {
                if ((result.lastIndexOf('bję') == result.length - 3) || (result.lastIndexOf('dję') == result.length - 3)
                    || (result.lastIndexOf('sję') == result.length - 3) || (result.lastIndexOf('zję') == result.length - 3)) {
                    result = (result.substring(0, result.length - 2) + 'òjm');
                }
                else {
                    result = (result.substring(0, result.length - 1) + 'm');
                }
            }
            else if (result = 'vzę') {
                result = 'vòzm';
            }
            else {
                result = (result.substring(0, result.length - 1) + 'n');
            }
        }
        else if (result.charAt(result.length - 1) == 'ų') {
            result = (result.substring(0, result.length - 1) + 'm');
        }
        else if (((result.charAt(result.length - 1) == 'i') || (result.charAt(result.length - 1) == 'y') ||
            (result.charAt(result.length - 1) == 'o') || (result.charAt(result.length - 1) == 'u') ||
            (result.charAt(result.length - 1) == 'ě') || (result.charAt(result.length - 1) == 'e')) && (result.length < 4)) {
            if (result == 'uči') {
                result = 'uči';
            }
            else if (result.charAt(0) == 'u') {
                result = result + 'ĵ';
            }
            else {
                result = result + 'j';
            }
        }
        else if ((result.charAt(result.length - 1) == 'a') || (result.charAt(result.length - 1) == 'e') || (result.charAt(result.length - 1) == 'ě')) {
            result = result + 'ĵ';
        }
    }
    else {
        if (((pts.lastIndexOf('se') == pts.length - 2) || (pts.lastIndexOf('sę') == pts.length - 2)) && (pts.length > 2)) {
            pts = pts.substring(0, pts.length - 3);
        }
        else if ((pts.indexOf('se ') == 0) || (pts.indexOf('sę ') == 0)) {
            pts = pts.substring(3, pts.length);
        }

        if (pref.length != 0) {
            if (pts.indexOf(pref) != -1) {
                pts = pts.replace(pref, '');
            }
            else {
                pts = pts.replace(pref.substring(0, pref.length - 1), '');
            }
        }
        if ((pts.lastIndexOf('-') == (pts.length - 1)) || (pts.lastIndexOf('m') == (pts.length - 1)) || (pts.lastIndexOf('e') == (pts.length - 1)) ||
            (pts.lastIndexOf('ų') == (pts.length - 1)) || (pts.lastIndexOf('u') == (pts.length - 1))) {
            result = pts.substring(0, pts.length - 1);
        }
        else {
            result = pts;
        }
    }

    if ((result == 'j') || (result == 'jes') || (is == 'by') || ((result == 'je') && (is == 'bi'))) {
        result = 'jes';
    }
    else if (result == 'věděĵ') {
        result = 'vě';
    }
    else if (result == 'jed') {
        result = 'je';
    }
    else if (result == 'jěd') {
        result = 'jě';
    }
    else if (result == 'jad') {
        result = 'ja';
    }
    else if (result == 'daĵ') {
        result = 'da';
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

function l_participle(pref, is) {
    let result = '';
    if ((is == 'vojd') || (is == 'vòjd')) {
        result = 'všèl';
    }
    else if ((is == 'id') || (is == 'jd')) {
        result = pref + 'šèl';
    }
    else if ((is.substring(is.length - 2, is.length) == 'id') ||
        (is.substring(is.length - 2, is.length) == 'jd')) {
        result = pref + is.substring(0, is.length - 2) + 'šèl';
    }
    else {
        result = pref + is + 'l';
    }
    return result;
}

function build_infinitive(pref, is, refl) {
    if (is.lastIndexOf('t') == (is.length - 1)) {
        is = is.substring(0, is.length - 1) + 's';
    }
    else if (is.lastIndexOf('id') == (is.length - 2)) {
        is = is.substring(0, is.length - 1) + 'd';
    }
    else if (is.lastIndexOf('jd') == (is.length - 2)) {
        is = is.substring(0, is.length - 1) + 'd';
    }
    else if (is.lastIndexOf('d') == (is.length - 1)) {
        is = is.substring(0, is.length - 1) + 's';
    }

    return transliterate_back(pref + is + 'tì' + refl);
}

function build_present(pref, ps, psi, refl) {
    let result = '';
    let cut = '';
    const i = (ps.length - 1);

    if (ps == 'jes') {
        result = 'jesm<br>jesi<br>jest (je)<br>jesmò<br>jeste<br>sųt';
    }
    else if (ps == 'da') {
        result = pref + 'dam<br>' + pref + 'daš<br>' + pref + 'da<br>' + pref + 'damò<br>' + pref + 'date<br>' + pref + 'dadųt';
    }
    else if (ps == 'vě') {
        result = pref + 'věm<br>' + pref + 'věš<br>' + pref + 'vě<br>' + pref + 'věmò<br>' + pref + 'věte<br>' + pref + 'vědųt';
    }
    else if (ps == 'jě') {
        result = pref + 'jěm<br>' + pref + 'jěš<br>' + pref + 'jě<br>' + pref + 'jěmò<br>' + pref + 'jěte<br>' + pref + 'jědųt';
    }
    else if (ps == 'je') {
        result = pref + 'jem<br>' + pref + 'ješ<br>' + pref + 'je<br>' + pref + 'jemò<br>' + pref + 'jete<br>' + pref + 'jedųt';
    }
    else if (ps == 'ja') {
        result = pref + 'jam<br>' + pref + 'jaš<br>' + pref + 'ja<br>' + pref + 'jamò<br>' + pref + 'jate<br>' + pref + 'jadųt';
    }
    else if (ps.charAt(i) == 'ĵ') {
        cut = ps.substring(0, ps.length - 1);
        ps = cut + 'j';
        result = pref + ps + 'ų' + refl + ', ' + pref + cut + 'm' + refl + '<br>';
        result = result + pref + ps + 'eš' + refl + ', ' + pref + cut + 'š' + refl + '<br>';
        result = result + pref + ps + 'e' + refl + ', ' + pref + cut + refl + '<br>';
        result = result + pref + ps + 'emò' + refl + ', ' + pref + cut + 'mo' + refl + '<br>';
        result = result + pref + ps + 'ete' + refl + ', ' + pref + cut + 'te' + refl + '<br>';
        result = result + pref + ps + 'ųt' + refl;
    }
    else if (ps.charAt(i) == 'i') {
        cut = ps.substring(0, ps.length - 1);
        result = pref + cut + 'xų' + refl + ', ' + pref + ps + 'm' + refl + '<br>';
        result = result + pref + ps + 'š' + refl + '<br>';
        result = result + pref + ps + refl + '<br>';
        result = result + pref + ps + 'mò' + refl + '<br>';
        result = result + pref + ps + 'te' + refl + '<br>';
        result = result + pref + cut + 'ęt' + refl;
    }
    else {
        result = pref + ps + 'ų' + refl + ', ' + pref + ps + 'em' + refl + '<br>';
        result = result + pref + psi + 'eš' + refl + '<br>';
        result = result + pref + psi + 'e' + refl + '<br>';
        result = result + pref + psi + 'emò' + refl + '<br>';
        result = result + pref + psi + 'ete' + refl + '<br>';
        result = result + pref + ps + 'ųt' + refl + '<br>';
    }
    result = transliterate_back(result);
    return result.split('<br>');
}

function build_imperfect(pref, is, refl) {
    let result = '';
    let impst = '';
    let i = is.length - 1;
    let vowel = /[aeiouyęųåėěèò]/;

    if (vowel.test(is.charAt(i)) == false) {
        if (is.charAt(i) == 'k') {
            impst = is.substring(0, i) + 'če';
        }
        else if (is.charAt(i) == 'g') {
            impst = is.substring(0, i) + 'že';
        }
        else {
            impst = is + 'e';
        }
    }
    else if (is == 'by') {
        impst = 'bě';
    }
    else {
        impst = is;
    }

    result = pref + impst + 'h' + refl + '<br>';
    result = result + pref + impst + 'še' + refl + '<br>';
    result = result + pref + impst + 'še' + refl + '<br>';
    result = result + pref + impst + 'hmò' + refl + '<br>';
    result = result + pref + impst + 'ste' + refl + '<br>';
    result = result + pref + impst + 'hų' + refl;


    result = transliterate_back(result);
    return result.split('<br>');
}

function build_future(infinitive, ps) {
    if ((((infinitive == 'biti') || (infinitive == 'бити')) && ((ps == 'j') || (ps == 'je') || (ps == 'jes')))
        || (infinitive == 'byti') || (infinitive == 'bytì') || (infinitive == 'быти')) {
        infinitive = '';
    }

    let result = 'bųdų ' + infinitive + '<br>';
    result = result + 'bųdeš ' + infinitive + '<br>';
    result = result + 'bųde ' + infinitive + '<br>';
    result = result + 'bųdemò ' + infinitive + '<br>';
    result = result + 'bųdete ' + infinitive + '<br>';
    result = result + 'bųdųt ' + infinitive;

    result = transliterate_back(result);
    return result.split('<br>');
}

function build_perfect(lpa, refl) {
    let result = '';

    result = 'jesm ' + lpa + '(a)' + refl + '<br>';
    result = result + 'jesi ' + lpa + '(a)' + refl + '<br>';
    result = result + '(je) ' + lpa + refl + '<br>';
    result = result + '(je) ' + lpa + 'a' + refl + '<br>';
    result = result + '(je) ' + lpa + 'o' + refl + '<br>';
    result = result + 'jesmò ' + lpa + 'i' + refl + '<br>';
    result = result + 'jeste ' + lpa + 'i' + refl + '<br>';
    result = result + '(sųt) ' + lpa + 'i' + refl + '<br>';
    if (result.indexOf('šèl') != -1) {
        result = idti(result);
    }
    result = transliterate_back(result);
    return result.split('<br>');
}

function build_pluperfect(lpa, refl) {
    let result = 'běh ' + lpa + '(a)' + refl + '<br>';
    result = result + 'běše ' + lpa + '(a)' + refl + '<br>';
    result = result + 'běše ' + lpa + refl + '<br>';
    result = result + 'běše ' + lpa + 'a' + refl + '<br>';
    result = result + 'běše ' + lpa + 'o' + refl + '<br>';
    result = result + 'běhmo ' + lpa + 'i' + refl + '<br>';
    result = result + 'běste ' + lpa + 'i' + refl + '<br>';
    result = result + 'běhų ' + lpa + 'i' + refl + '<br>';
    if (result.indexOf('šèl') != -1) {
        result = idti(result);
    }
    result = transliterate_back(result);
    return result.split('<br>');
}

function build_conditional(lpa, refl) {
    let result = 'byh ' + lpa + '(a)' + refl + '<br>';
    result = result + 'bys ' + lpa + '(a)' + refl + '<br>';
    result = result + 'by ' + lpa + refl + '<br>';
    result = result + 'by ' + lpa + 'a' + refl + '<br>';
    result = result + 'by ' + lpa + 'o' + refl + '<br>';
    result = result + 'byhmò ' + lpa + 'i' + refl + '<br>';
    result = result + 'byste ' + lpa + 'i' + refl + '<br>';
    result = result + 'by ' + lpa + 'i' + refl + '<br>';

    if (result.indexOf('šèl') != -1) {
        result = idti(result);
    }
    result = transliterate_back(result);
    return result.split('<br>');
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

    let result = p2s + refl + ', ' + p2s + 'mò' + refl + ', ' + p2s + 'te' + refl;
    result = result.replace(/jij/g, 'j');
    result = result.replace(/ĵij/g, 'ĵ');
    result = transliterate_back(result);
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

    return transliterate_back(ps + 'ćí (' + ps + 'ćá, ' + ps + 'ćé)' + refl);
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

    result = transliterate_back(result);
    return result;
}

function build_pfap(lpa, refl) {
    let result = '';
    let vowel = /[aeiouyęųåėěèò)]/;
    if (vowel.test(lpa.charAt(lpa.length - 2)) == false) {
        result = lpa.substring(0, lpa.length - 1) + 'ši' + refl;
    }
    else {
        result = lpa.substring(0, lpa.length - 1) + 'vši' + refl;
    }
    if (result.indexOf('šèv') != -1) {
        result = idti(result);
    }

    result = transliterate_back(result);
    return result;
}


function build_pfpp(pref, is, psi) {
    let ppps = '';
    const i = (is.length - 1);
    if (((is.charAt(i) != 'j') && ((psi.charAt(psi.length - 1) == 'j') && (i < 4) && (is.charAt(0) != 'u')) || (is == 'by')) || (is.charAt(i) == 'ę')) {
        ppps = pref + is + 't';
    }
    else if (((is.charAt(i) == 'ų') || (is.charAt(i) == 'u')) && (is.charAt(i - 1) == 'n')) {
        ppps = pref + psi + 'en';
    }
    else if ((is.charAt(i) == 'ų') || (is.charAt(i) == 'u')) {
        ppps = pref + is + 't';
    }
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
        ppps = pref + psi + 'en';
    }
    else {
        ppps = pref + is + 'en';
    }

    return transliterate_back(ppps + 'ý (' + ppps + 'á, ' + ppps + 'ó)');
}

function build_gerund(pfpp, refl) {
    const ppps = (pfpp.indexOf('(') - 2);
    return transliterate_back(pfpp.substring(0, ppps) + 'ıje' + refl);
}

function idti(sel) {
    return sel
        .replace('šèl(a)', 'šèl/šla')
        .replace('šèl(a)', 'šèl/šla')
        .replace('všèl/šla', 'všèl/vòšla')
        .replace('všèl/šla', 'všèl/vòšla')
        .replace(/šèla/g, 'šla')
        .replace(/šèlo/g, 'šlo')
        .replace(/šèli/g, 'šli')
        .replace(/všl/g, 'vòšl')
        .replace(/iz[oò]š/g, 'izš')
        .replace(/ob[oò]š/g, 'obš')
        .replace(/od[oò]š/g, 'odš')
        .replace(/pod[oò]š/g, 'podš')
        .replace(/nad[oò]š/g, 'nadš')
    ;
}

function transliterate_back(iW) {
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
    ;
}
