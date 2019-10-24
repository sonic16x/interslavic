/*
* Source http://steen.free.fr/interslavic/adjectivator.html
*/

/* tslint:disable */

function applyRules(arr) {
    return arr.map(rules);
}

export function declensionAdjective(adj: string) {
    const root = establish_root(adj);
    const m_nom_sg = m_nominative_sg(adj, root);
    const m_acc_sg = m_accusative_sg(adj, root);
    const f_nom_sg = f_nominative_sg(root);
    const n_nom_sg = n_nominative_sg(root);
    const mn_gen_sg = mn_genitive_sg(root);
    const mn_dat_sg = mn_dative_sg(root);
    const mn_ins_sg = mn_instrumental_sg(root);
    const mn_loc_sg = mn_locative_sg(root);
    const f_acc_sg = f_accusative_sg(root);
    const f_gdl_sg = f_gendatloc_sg(root);
    const f_ins_sg = f_instrumental_sg(root);

    const m_nom_pl = m_nominative_pl(root);
    const m_acc_pl = m_accusative_pl(root);
    const fn_nom_pl = fn_nominative_pl(root);
    const glo_pl = genloc_pl(root);
    const dat_pl = dative_pl(root);
    const ins_pl = instrumental_pl(root);

    const adv = adverb(root);
    const comp_adj = comparative_adj(root);
    const comp_adv = comparative_adv(root);
    const sup_adj = superlative(root, comp_adj, 'adj');
    const sup_adv = superlative(root, comp_adv, 'adv');

    return {
        singular: {
            nom: applyRules([m_nom_sg, n_nom_sg, f_nom_sg]),
            acc: applyRules([m_acc_sg, f_acc_sg]),
            gen: applyRules([mn_gen_sg, f_gdl_sg]),
            dat: applyRules([mn_dat_sg, f_gdl_sg]),
            ins: applyRules([mn_ins_sg, f_ins_sg]),
            loc: applyRules([mn_loc_sg, f_gdl_sg]),
        },
        plural: {
            nom: applyRules([m_nom_pl, fn_nom_pl]),
            acc: applyRules([m_acc_pl, fn_nom_pl]),
            gen: applyRules([glo_pl]),
            dat: applyRules([dat_pl]),
            ins: applyRules([ins_pl]),
            loc: applyRules([glo_pl]),
        },
        comparison: {
            positive: applyRules([m_nom_sg, adv]),
            comparative: applyRules([comp_adj, comp_adv]),
            superlative: applyRules([sup_adj, sup_adv]),
        },
    };
}

function establish_root(adj) {
    let result = '';
    if ((adj == 'naš') || (adj == 'vaš')) {
        result = adj + '|^';
    } else if ((adj.lastIndexOf('č') == adj.length - 3) && (adj.lastIndexOf('i') == adj.length - 2) && (adj.lastIndexOf('j') == adj.length - 1)) {
        result = adj + '|^';
    } else if ((adj == 'sej') || (adj == 'sjej')) {
        result = adj.substring(0, adj.length - 2) + '|^';
    } else if ((adj == 'veś') || (adj == 'ves')) {
        result = 'vs|^';
    } else if (adj == 'onoj') {
        result = 'on|';
    } else if ((adj == 'ovoj') || (adj == 'ov')) {
        result = 'ov|';
    } else if ((adj.lastIndexOf('o') == adj.length - 2) && (adj.lastIndexOf('v') == adj.length - 1)) {
        result = adj + '|';
    } else if ((adj.lastIndexOf('i') == adj.length - 2) && (adj.lastIndexOf('n') == adj.length - 1)) {
        result = adj + '|';
    } else if ((adj.lastIndexOf('t') == adj.length - 3) && (adj.lastIndexOf('o') == adj.length - 2) && (adj.lastIndexOf('j') == adj.length - 1)) {
        result = adj.substring(0, adj.length - 2) + '|';
    } else if ((adj.lastIndexOf('o') == adj.length - 2) && (adj.lastIndexOf('j') == adj.length - 1)) {
        result = adj + '|^';
    } else if ((adj.lastIndexOf('e') == adj.length - 2) && (adj.lastIndexOf('n') == adj.length - 1)) {
        result = adj.substring(0, adj.length - 2) + 'n|';
    } else if ((adj.lastIndexOf('y') == adj.length - 2) && (adj.lastIndexOf('j') == adj.length - 1)) {
        result = adj.substring(0, adj.length - 2);
    } else if ((adj.lastIndexOf('i') == adj.length - 2) && (adj.lastIndexOf('j') == adj.length - 1)) {
        result = adj.substring(0, adj.length - 2) + '^';
    } else if (adj.lastIndexOf('y') == adj.length - 1) {
        result = adj.substring(0, adj.length - 1);
    } else if (adj.lastIndexOf('i') == adj.length - 1) {
        result = adj.substring(0, adj.length - 1) + '^';
    } else {
        result = '';
    }

    return result
        .replace('k^', 'k')
        .replace('g^', 'g')
        .replace('h^', 'h')
    ;
}

function m_nominative_sg(adj, root) {
    if (root.indexOf('|') !== -1) {
        return adj;
    } else {
        return root + 'y';
    }
}

function f_nominative_sg(root) {
    return root + 'a';
}

function n_nominative_sg(root) {
    return root + 'o';
}

function mn_genitive_sg(root) {
    return root + 'ogo';
}

function mn_dative_sg(root) {
    return root + 'omu';
}

function m_accusative_sg(adj, root) {
    return root + 'ogo/' + adj;
}

function mn_instrumental_sg(root) {
    return root + 'ym';
}

function mn_locative_sg(root) {
    return root + 'om';
}

function f_accusative_sg(root) {
    return root + 'ų';
}

function f_gendatloc_sg(root) {
    return root + 'oj';
}

function f_instrumental_sg(root) {
    return root + 'ojų';
}

function m_nominative_pl(root) {
    return root + 'i/' + root + 'e';
}

function m_accusative_pl(root) {
    return root + 'yh/' + root + 'e';
}

function fn_nominative_pl(root) {
    return root + 'e';
}

function genloc_pl(root) {
    return root + 'yh';
}

function dative_pl(root) {
    return root + 'ym';
}

function instrumental_pl(root) {
    return root + 'ymi';
}

function adverb(root) {
    if (root.charAt(root.length - 2) == 'ć') {
        return root + 'i';
    } else {
        return root + 'o';
    }
}

function comparative_adj(root) {
    let result = '';
    const hacek = root.indexOf('^');
    const lastchar = hacek !== -1 ? root.length - 2 : root.length - 1;
    const vowel = /[aåeěęioòuųy]/;
    const liquid = /[lrŕ]/;
    const nasal = /[nm]/;

    if (root == 'velik') {
        result = 'vęčši';
    } else if (root == 'mal') {
        result = 'menši';
    } else if (root == 'dobr') {
        result = 'lěpši, lučši';
    } else if (root == 'zl') {
        result = 'gorši';
    } else if (root == 'mnog') {
        result = 'boľši';
    } else if ((root == 'blåg') || (root == 'blag')) {
        result = 'unši, ' + root.substring(0, root.length - 1) + 'žejši';
    } else if (root.lastIndexOf('sk') == root.length - 2) {
        result = 'bolje ' + root + 'i';
    } else if ((root.lastIndexOf('ok') == root.length - 2) || (root.lastIndexOf('ek') == root.length - 2)) {
        result = root.substring(0, root.length - 2) + 'ši';
    } else if ((root.lastIndexOf('k') == root.length - 1) && (vowel.test(root.charAt(lastchar - 1)) == false)) {
        result = root.substring(0, root.length - 1) + 'ši';
    } else {
        if (hacek == -1) {
            result = root + '%ějši';
        } else {
            result = root + '%ejši';
        }
    }
    result = result
        .replace(/k%/, 'č')
        .replace(/g%/, 'ž')
        .replace(/h%/, 'š')
        .replace(/lši/, 'ľši')
        .replace(/gši/, 'žši')
        .replace(/ležši/, 'legši')
        .replace(/%/, '')
    ;

    return result;
}

function comparative_adv(root) {
    let result = '';
    const hacek = root.indexOf('^');
    const lastchar = hacek !== -1 ? root.length - 2 : root.length - 1;
    const vowel = /[aåeěęioòuųy]/;
    const liquid = /[lrŕ]/;

    if (root == 'velik') {
        result = 'vęče';
    } else if (root == 'mal') {
        result = 'menje';
    } else if (root == 'dobr') {
        result = 'lěpje, lučše';
    } else if (root == 'zl') {
        result = 'gorje';
    } else if (root == 'mnog') {
        result = 'bolje';
    } else if ((root == 'blåg') || (root == 'blag')) {
        result = 'unje, ' + root.substring(0, root.length - 1) + 'žeje';
    } else if (root.lastIndexOf('sk') == root.length - 2) {
        result = 'bolje ' + root + 'o';
    } else if ((root.lastIndexOf('ok') == root.length - 2) || (root.lastIndexOf('ek') == root.length - 2)) {
        result = root.substring(0, root.length - 2) + '%je';
    } else if ((root.lastIndexOf('k') == root.length - 1) && (vowel.test(root.charAt(lastchar - 1)) == false)) {
        result = root.substring(0, root.length - 1) + '%je';
    } else if (root.indexOf('^') != -1) {
        result = root + 'eje';
    } else {
        result = root + '%ěje';
    }
    result = result
        .replace(/k%ě/, 'če')
        .replace(/g%ě/, 'že')
        .replace(/h%ě/, 'še')
        .replace(/k%j/, 'kš')
        .replace(/g%j/, 'gš')
        .replace(/st%j/, 'šč')
        .replace(/s%j/, 'š')
        .replace(/z%j/, 'ž')
        .replace(/t%j/, 'č')
        .replace(/d%j/, 'dž')
        .replace(/%/, '')
    ;

    return result;
}

function superlative(root, comp, srt) {
    let result = '';
    if ((root == 'dobr') && (srt == 'adj')) {
        result = 'najlěpši, najlučši';
    } else if ((root == 'dobr') && (srt == 'adv')) {
        result = 'najlěpje, najlučše';
    } else if ((root == 'blåg') && (srt == 'adj')) {
        result = 'najunši, najblåžejši';
    } else if ((root == 'blag') && (srt == 'adj')) {
        result = 'najunši, najblažejši';
    } else if ((root == 'blåg') && (srt == 'adv')) {
        result = 'najunje, najblåžeje';
    } else if ((root == 'blag') && (srt == 'adv')) {
        result = 'najunje, najblažeje';
    } else {
        result = 'naj' + comp;
    }
    return result;
}

function rules(word: string): string {
    return word
        .replace('^o', '^e')
        .replace('^y', '^i')
        .replace('s|^e', 'se')
        .replace('s|^i', 'si')
        .replace('|', '')
        .replace('č^', 'č')
        .replace('š^', 'š')
        .replace('ž^', 'ž')
        .replace('ć^', 'ć')
        .replace('c^', 'c')
        .replace(/l^/g, 'lj')
        .replace('n^', 'ń')
        .replace('r^', 'ŕ')
        .replace('j^', 'j')
        .replace('t^', 'ť')
        .replace('d^', 'ď')
        .replace('s^', 'ś')
        .replace('z^', 'ź')
        .replace('^', '')
        .replace('jy', 'ji')
        .replace('cy', 'ci')
    ;
}
