import { getLatin } from 'utils/getLatin';
import { declensionAdjective } from 'legacy/declensionAdjective';
import { declensionNoun } from 'legacy/declensionNoun';
import { normalize } from 'utils/normalize';
import {
    getGender,
    isPlural,
    isSingular,
} from 'utils/wordDetails';

export interface INumeralParadigm {
    type: string;
    columns?: string[];
    cases?: {};
    casesSingular?: {};
    casesPlural?: {};
}

const exclusionList = {
    /* N A G D I L */
    dva:        ['dva|dvě', 'dva / dvoh|dvě', 'dvoh', 'dvom', 'dvoma', 'dvoh', ['masculine', 'feminine/neuter']],
    oba:        ['oba|obě', 'oba / oboh|obě', 'oboh', 'obom', 'oboma', 'oboh', ['masculine', 'feminine/neuter']],
    obadva:     ['obadva|obadvě', 'obadva / obadvoh|obadvě', 'obadvoh', 'obadvom', 'obadvoma', 'obadvoh', ['masculine', 'feminine/neuter']],
    obydva:     ['obydva|obydvě', 'obydva / obydvoh|obydvě', 'obydvoh', 'obydvom', 'obydvoma', 'obydvoh', ['masculine', 'feminine/neuter']],
    tri:        ['tri', 'trěh / tri', 'trěh', 'trěm', 'trěmi', 'trěh', ['plural']],
    cetyri:     ['četyri', 'četyrěh / četyri', 'četyrěh', 'četyrěm', 'četyrěmi', 'četyrěh', ['plural']],
    dveste:     ['dvěstě', 'dvěstě', 'dvohsȯt', 'dvomstam', 'dvomastami', 'dvohstah', ['plural']],
    trista:     ['trista', 'trista', 'trěhsȯt', 'trěmstam', 'trěmistami', 'trěhstah', ['plural']],
    cetyrista:  ['četyrista', 'četyrista', 'četyrěhsȯt', 'četyrěmstam', 'četyrěmistami', 'četyrěhstah', ['plural']],
    petsot:     ['pęťsȯt', 'pęťsȯt', 'pętisȯt', 'pętistam', 'pęťjųstami', 'pętistah', ['plural']],
    sestsot:    ['šesťsȯt', 'šesťsȯt', 'šesťsȯt', 'šestistam', 'šesťjųstami', 'šestistah', ['plural']],
    sedmsot:    ['sedmsȯt', 'sedmsȯt', 'sedmsȯt', 'sedmistam', 'sedmjųstami', 'sedmistah', ['plural']],
    osmsot:     ['osmsȯt', 'osmsȯt', 'osmsȯt', 'osmistam', 'osmjųstami', 'osmistah', ['plural']],
    devetsot:   ['devęťsȯt', 'devęťsȯt', 'devęťsȯt', 'devętistam', 'devęťjųstami', 'devętistah', ['plural']],
    tysec:      ['tysęć|tysęće / tysęći', 'tysęć|tysęće / tysęći', 'tysęća / tysęći|tysęćev / tysęćij', 'tysęću / tysęći|tysęćam', 'tysęćem / tysęćjų|tysęćami', 'tysęću / tysęći|tysęćah', ['singular (m./f.)', 'plural (m./f.)']],
};

function getExclusionForm(rawWord, caseIndex, formColumns) {
    const wordForms = exclusionList[rawWord][caseIndex].split('|');
    const resForms = [];
    for (let i = 0; i < formColumns; i++) {
        resForms.push(wordForms[(i < wordForms.length ? i : wordForms.length - 1)]);
    }
    return resForms;
}

export function declensionNumeralFlat(rawWord: string, numeralType: string): string[] {
    const result: any = declensionNumeral(rawWord, numeralType);
    if (!result) {
        return [];
    }
    const forms = [];
    for (const caseName in result.cases) {
        if (result.cases.hasOwnProperty(caseName)) {
            forms.push(...result.cases[caseName]);
        }
    }
    return Array.from(new Set(forms.join('/').replace(/ /g, '').split('/'))).filter(Boolean);
}

export function declensionNumeral(rawWord: string, numeralType: string): INumeralParadigm {
    // now we don't know how to decline the phrases
    if (rawWord.includes(' ')) {
        return null;
    }
    const word = normalize(getLatin(rawWord, '3'));
    let declensionType = '';
    let details = '';
    if (numeralType === 'cardinal') {
        // work with exclusion list
        if (exclusionList[word]) {
            const columns = exclusionList[word][6];
            return {
                type: 'noun',
                columns: exclusionList[word][6],
                cases: {
                    nom: getExclusionForm(word, 0, columns.length),
                    acc: getExclusionForm(word, 1, columns.length),
                    gen: getExclusionForm(word, 2, columns.length),
                    loc: getExclusionForm(word, 5, columns.length),
                    dat: getExclusionForm(word, 3, columns.length),
                    ins: getExclusionForm(word, 4, columns.length),
                },
            };
        } else if (word === 'jedin') {
            declensionType = 'adjective';
        } else if (word.match(/[tm]$/)) {
            declensionType = 'noun';
            details = 'f.sg.';
        } else if (word === 'nula') {
            declensionType = 'noun';
            details = 'f.';
        } else if (word.match(/[nd]$/)) {
            declensionType = 'noun';
            details = 'm.';
        } else if (word === 'sto') {
            declensionType = 'noun';
            details = 'n.';
        } else if (word.match(/sto$/)) {
            // indeclinable
            return {
                type: 'noun',
                columns: ['plural'],
                cases: {
                    nom: [rawWord],
                    acc: [rawWord],
                    gen: [rawWord],
                    loc: [rawWord],
                    dat: [rawWord],
                    ins: [rawWord],
                },
            };
        }
    } else if (numeralType === 'collective') {
        const iOrY = (rawWord.slice(-1) === 'o' ? 'y' : 'i');
        return {
            type: 'noun',
            columns: ['plural'],
            cases: {
                nom: [rawWord],
                acc: [rawWord.slice(0, -1) + iOrY + 'h / ' + rawWord],
                gen: [rawWord.slice(0, -1) + iOrY + 'h'],
                loc: [rawWord.slice(0, -1) + iOrY + 'h'],
                dat: [rawWord.slice(0, -1) + iOrY + 'm'],
                ins: [rawWord.slice(0, -1) + iOrY + 'mi'],
            },
        };
    } else if (numeralType === 'fractional' || numeralType === 'substantivized') {
        declensionType = 'noun';
        details = 'f.';
    } else if (numeralType === 'differential' || numeralType === 'multiplicative' ||
        numeralType === 'ordinal' ) {
        declensionType = 'adjective';
    }

    if (declensionType === 'noun') {
        const gender = getGender(details);
        const plural = isPlural(details);
        const singular = isSingular(details);
        const nounParadigm = declensionNoun(rawWord, '', gender, false, plural, singular, false);

        if (plural) {
            return {
                type: 'noun',
                columns: ['plural'],
                cases: {
                    nom: [rawWord],
                    acc: [nounParadigm.acc[1]],
                    gen: [nounParadigm.gen[1]],
                    loc: [nounParadigm.loc[1]],
                    dat: [nounParadigm.dat[1]],
                    ins: [nounParadigm.ins[1]],
                },
            };
        } else if (singular) {
            return {
                type: 'noun',
                columns: ['singular'],
                cases: {
                    nom: [rawWord],
                    acc: [nounParadigm.acc[0]],
                    gen: [nounParadigm.gen[0]],
                    loc: [nounParadigm.loc[0]],
                    dat: [nounParadigm.dat[0]],
                    ins: [nounParadigm.ins[0]],
                },
            };
        } else {
            return {
                type: 'noun',
                columns: ['singular', 'plural'],
                cases: {
                    nom: [rawWord, nounParadigm.nom[1]],
                    acc: [nounParadigm.acc[0], nounParadigm.acc[1]],
                    gen: [nounParadigm.gen[0], nounParadigm.gen[1]],
                    loc: [nounParadigm.loc[0], nounParadigm.loc[1]],
                    dat: [nounParadigm.dat[0], nounParadigm.dat[1]],
                    ins: [nounParadigm.ins[0], nounParadigm.ins[1]],
                },
            };
        }

    } else if (declensionType === 'adjective') {
        const adjectiveParadigm = declensionAdjective(rawWord, '');
        return {
            type: 'adjective',
            casesSingular: adjectiveParadigm.singular,
            casesPlural: adjectiveParadigm.plural,
        };
    }

    return null;
}
