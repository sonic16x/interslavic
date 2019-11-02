import { isvToEngLatin } from '../translator';
import { declensionAdjective } from './declensionAdjective';

export interface IPronounParadigm {
    type: string;
    columns?: string[];
    cases?: {};
    casesSingular?: {};
    casesPlural?: {};
}

export function declensionPronoun(rawWord: string, pronounType: string): IPronounParadigm {
    const word = isvToEngLatin(rawWord);
    if (pronounType === 'personal' || pronounType === 'reflexive') {
        if (['ja', 'mene', 'me', 'mne', 'mi', 'mnoju', 'my', 'nas', 'nam', 'nami'].indexOf(word) !== -1) {
            return {
                type: 'noun',
                columns: ['Singular', 'Plural'],
                cases: {
                    nom: ['ja', 'my'],
                    acc: ['mene (mę)', 'nas'],
                    gen: ['mene', 'nas'],
                    loc: ['mně', 'nas'],
                    dat: ['mně (mi)', 'nam'],
                    ins: ['mnojų', 'nami'],
                },
            };
        } else if (['ty', 'tebe', 'te', 'tobe', 'ti', 'toboju', 'vy', 'vas', 'vam', 'vami'].indexOf(word) !== -1) {
            return {
                type: 'noun',
                columns: ['Singular', 'Plural'],
                cases: {
                    nom: ['ty', 'vy'],
                    acc: ['tebe (tę)', 'vas'],
                    gen: ['tebe', 'vas'],
                    loc: ['tobě', 'vas'],
                    dat: ['tobě (ti)', 'vam'],
                    ins: ['tobojų', 'vami'],
                },
            };
        } else if (['on', 'jego', 'go', 'je', 'jemu', 'mu', 'njim', 'ona', 'ju', 'jej', 'jeju', 'njeju', 'oni', 'jih', 'jim', 'njimi'].indexOf(word) !== -1) {
            return {
                type: 'adjective',
                casesSingular: {
                    nom: ['on', 'ono', 'ona'],
                    acc: ['(n)jego (go) / (n)je', '(n)je', '(n)jų'],
                    gen: ['(n)jego', '(n)jej'],
                    loc: ['(n)jem', '(n)jej'],
                    dat: ['(n)jemu (mu)', '(n)jej'],
                    ins: ['(n)jim', '(n)jejų'],
                },
                casesPlural: {
                    nom: ['oni / one', 'one'],
                    acc: ['(n)jih / (n)je', '(n)je'],
                    gen: ['(n)jih'],
                    loc: ['(n)jih'],
                    dat: ['(n)jim'],
                    ins: ['(n)jimi'],
                },
            };
        } else if (['sebe', 'se', 'sobe', 'si', 'soboju'].indexOf(word) !== -1) {
            return {
                type: 'noun',
                columns: ['Word Form'],
                cases: {
                    nom: [null],
                    acc: ['sebę (sę)'],
                    gen: ['sebe'],
                    loc: ['sobě'],
                    dat: ['sobě (si)'],
                    ins: ['sobojų'],
                },
            };
        }
    } else if (pronounType === 'possessive' &&
        ['jih', 'jej', 'jego'].indexOf(word) !== -1) {
        return {
            type: 'noun',
            columns: ['Word Form'],
            cases: {
                nom: [rawWord],
                acc: [rawWord],
                gen: [rawWord],
                loc: [rawWord],
                dat: [rawWord],
                ins: [rawWord],
            },
        };
    } else if ((pronounType === 'indefinite' || pronounType === 'interrogative' || pronounType === 'relative' ) &&
        (rawWord.match(/čto/) || rawWord.match(/kto/) ||
           ['kogo'].indexOf(word) !== -1) && !rawWord.match(/ktory/)) {
        let prefix = '';
        let postfix = '';
        let origWord = rawWord;
        if (rawWord === 'kogo') {
            origWord = 'kto';
        } else if (word.match(/koli$/)) {
            postfix = 'koli';
        } else if (word.match(/nebud$/)) {
            postfix = '-nebųď';
        } else if (word.match(/libo$/)) {
            postfix = '-libo';
        } else if (word.match(/^ino/)) {
            prefix = 'ino';
        } else if (word.match(/^ne/)) {
            prefix = 'ně';
        } else if (word.match(/^ni/)) {
            prefix = 'ni';
        } else if (word.match(/^vse/)) {
            prefix = 'vse';
        }
        if (origWord.match(/čto/)) {
            return {
                type: 'noun',
                columns: ['Word Form'],
                cases: {
                    nom: [prefix + 'čto' + postfix],
                    acc: [prefix + 'čego' + postfix],
                    gen: [prefix + 'čego' + postfix],
                    loc: [prefix + 'čem' + postfix],
                    dat: [prefix + 'čemu' + postfix],
                    ins: [prefix + 'čim' + postfix],
                },
            };
        } else if (origWord.match(/kto/)) {
            return {
                type: 'noun',
                columns: ['Word Form'],
                cases: {
                    nom: [prefix + 'kto' + postfix],
                    acc: [prefix + 'kogo' + postfix],
                    gen: [prefix + 'kogo' + postfix],
                    loc: [prefix + 'kom' + postfix],
                    dat: [prefix + 'komu' + postfix],
                    ins: [prefix + 'kym' + postfix ],
                },
            };
        } else {
            return null;
        }
    } else if (pronounType === 'relative' && rawWord === 'iže') {
        return {
            type: 'adjective',
            casesSingular: {
                nom: ['iže', 'ježe', 'jaže'],
                acc: ['jegože / iže', 'jųže'],
                gen: ['jegože', 'jejže'],
                loc: ['jemže', 'jejže'],
                dat: ['jemuže', 'jejže'],
                ins: ['jimže', 'jejųže'],
            },
            casesPlural: {
                nom: ['jiže / ježe', 'ježe'],
                acc: ['jihže / ježe', 'ježe'],
                gen: ['jihže'],
                loc: ['jihže'],
                dat: ['jimže'],
                ins: ['jimiže'],
            },
        };
    } else if (['demonstrative', 'indefinite', 'interrogative', 'relative',
        'possessive'].indexOf(pronounType) !== -1) {
        let origWord = rawWord;
        let postfix = '';
        if (origWord === 'te') {
            origWord = 'toj';
        } else if (origWord === 'tojže') {
            origWord = 'toj';
            postfix = 'že';
        } else if (word.match(/koli$/)) {
            origWord = rawWord.slice(0, -4);
            postfix = 'koli';
        } else if (word.match(/nebud$/)) {
            origWord = rawWord.slice(0, -6);
            postfix = '-nebųď';
        } else if (word.match(/libo$/)) {
            origWord = rawWord.slice(0, -5);
            postfix = '-libo';
        } else if (word === 'vsi' || word === 'vse') {
            origWord = 'veś';
        }
        const adjectiveParadigm = declensionAdjective(origWord, postfix);
        return {
            type: 'adjective',
            casesSingular: adjectiveParadigm.singular,
            casesPlural: adjectiveParadigm.plural,
        };

    }
    return null;
}
