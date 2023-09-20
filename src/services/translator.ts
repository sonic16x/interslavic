import { Dictionary } from 'services/dictionary';

import { Az, loadDicts } from 'legacy/az';
import { conjugationVerb, getConjugationVerbFlat } from 'legacy/conjugationVerb';
import { declensionAdjective, getDeclensionAdjectiveFlat } from 'legacy/declensionAdjective';
import { declensionNoun, getDeclensionNounFlat } from 'legacy/declensionNoun';
import { declensionNumeral, getDeclensionNumeralFlat } from 'legacy/declensionNumeral';
import { declensionPronoun, getDeclensionPronounFlat } from 'legacy/declensionPronoun';
import { getCyrillic } from 'utils/getCyrillic';
import { getGlagolitic } from 'utils/getGlagolitic';
import { getLatin } from 'utils/getLatin';
import {
    getGender,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    isAnimated,
    isIndeclinable,
    isPlural,
    isSingular,
} from 'utils/wordDetails';

function toUpperCase(str: string) {
    if (!str) {
        return str;
    }

    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function getPosFromAz(azPos: string) {
    const azPosMap = {
        'NOUN': 'noun',
        'VERB': 'v',
        'INFN': 'v',
        'ADJF': 'adj',
        'ADJS': 'adj',
        'COMP': 'adj',
        'NPRO': 'pron',
        'PREP': 'prep',
        'PRCL': 'particle',
        'NUMR': 'num',
        'CONJ': 'conj',
        'INTJ': 'interjection',
    }

    if (azPosMap[azPos]) {
        return azPosMap[azPos];
    }
}

function getPersonFromAz(tag): number {
    for (let i = 1; i < 4; i++) {
        if (tag.flex.includes(`${i}per`)) {
            return i;
        }
    }
}

function getTensFromAz(tag): string {
    if (tag.past) {
        return 'past';
    }

    if (tag.future) {
        return 'future';
    }

    if (tag.pres) {
        return 'present';
    }

    return 'present';
}

function getCaseFromAz(azCase: string) {
    const azPosMap = {
        'nomn': 'nom',
        'gent': 'gen',
        'gen1': 'gen',
        'gen2': 'gen',
        'datv': 'dat',
        'accs': 'acc',
        'acc2': 'acc',
        'ablt': 'ins',
        'loct': 'loc',
        'loc1': 'loc',
        'loc2': 'loc',
        'voct': 'voc',
    }

    if (azPosMap[azCase]) {
        return azPosMap[azCase];
    }

    return 'nom';
}

function getGenderFromAz(tag) {
    if (tag.femn) {
        return 'feminine';
    }

    if (tag.neut) {
        return 'neuter';
    }

    if (tag.masc) {
        return 'masculine';
    }
}

function splitText(text: string): string[] {
    return text.split(/(\,|\.|\?|\!|\s|\(|\)|\[|\]|\{|\}|\"|\'|-)/).filter(Boolean);
}

function isCyrillic(str: string) {
    return /[а-яА-ЯЁё]/.test(str);
}

function isFirstUpper(str: string) {
    return str[0] === str[0].toUpperCase();
}

export type TranslateNodeType = 'valid' | 'maybe' | 'error' | 'space';

export interface ITranslateNode {
    start?: number,
    end?: number,
    str: string,
    type: TranslateNodeType,
    forms?: string[],
}

class TranslatorClass {
    public static getInstance(): TranslatorClass {
        if (!TranslatorClass.instance) {
            TranslatorClass.instance = new TranslatorClass();
        }

        return TranslatorClass.instance;
    }

    private static instance: TranslatorClass;
    private translateCache: Map<string, any>;
    private lang: string;

    private constructor() {
        this.translateCache = new Map();
    }

    private format(isv, flavorisationType, alphabet?: string) {
        if (alphabet === 'cyrillic') {
            return getCyrillic(isv, flavorisationType)
        }

        if (alphabet === 'glagolitic') {
            return getGlagolitic(isv, flavorisationType)
        }

        return getLatin(isv, flavorisationType);
    }

    private getWordForm(
        word: string,
        add: string,
        details: string,
        tag: any,
    ): { word: string, flat?: string[] } {
        const translatedPos = getPartOfSpeech(details);

        switch (translatedPos) {
            case 'noun': {
                const nounCase = getCaseFromAz(tag.CAse);

                const gender = getGender(details);
                const animated = isAnimated(details);
                const plural = isPlural(details);
                const singular = isSingular(details);
                const indeclinable = isIndeclinable(details);

                const cases = declensionNoun(word, add, gender, animated, plural, singular, indeclinable);
                const flat = getDeclensionNounFlat(cases);


                return {
                    word: cases[nounCase][(tag.sing || tag.inan) ? 0 : 1],
                    flat,
                };
            }

            case 'pronoun': {
                const pronounType = getPronounType(details);

                const pronounParadigm = declensionPronoun(word, pronounType);
                const pronounCase = getCaseFromAz(tag.CAse);

                const flat = getDeclensionPronounFlat(pronounParadigm);

                if (!pronounParadigm) {
                    return {
                        word,
                    };
                }

                if (pronounParadigm.type === 'noun') {
                    return {
                        word: pronounParadigm.cases[pronounCase][(tag.plur) ? 1 : 0],
                        flat,
                    };
                }

                if (pronounParadigm.type === 'adjective') {
                    const plural = isPlural(details);

                    if (plural) {
                        return {
                            word: pronounParadigm.casesPlural[pronounCase][0].split('/')[0],
                            flat,
                        };
                    } else {
                        return {
                            word: pronounParadigm.casesSingular[pronounCase][0].split('/')[0],
                            flat,
                        };
                    }
                }
            }

            case 'verb': {
                const data = conjugationVerb(word, add);

                const flat = getConjugationVerbFlat(data);

                const tens = getTensFromAz(tag);
                const person = getPersonFromAz(tag);
                const plural = !tag.sing;

                if (tens === 'present' && person) {
                    let index = person - 1;

                    if (plural) {
                        index += 3;
                    }

                    return {
                        word: data.present[index].split(',')[0],
                        flat,
                    };
                }

                if (tens === 'future') {
                    return {
                        word: data.infinitive,
                        flat,
                    }
                }

                if (tens === 'past') {
                    const gender = getGenderFromAz(tag);

                    let index = 0;

                    if (plural) {
                        index = 5;
                    } else {
                        if (gender === 'masculine') {
                            index = 2;
                        }

                        if (gender === 'feminine') {
                            index = 3;
                        }

                        if (gender === 'neuter') {
                            index = 4;
                        }
                    }

                    return  {
                        word: data.perfect[index].split(' ')[1],
                        flat,
                    }
                }

                return { word, flat };
            }

            case 'adjective': {
                const adjectiveCase = getCaseFromAz(tag.CAse);
                const data = declensionAdjective(word, add);

                const flat = getDeclensionAdjectiveFlat(data);

                if (tag.COMP) {
                    return {
                        word: (data?.comparison?.comparative) ? data.comparison.comparative[1] : word,
                        flat,
                    };
                }

                const tense = tag.plur ? 'plural' : 'singular';
                const gender = getGenderFromAz(tag);

                const result = data[tense][adjectiveCase];
                let str;

                if (tense === 'singular') {
                    if (adjectiveCase === 'nom' || adjectiveCase === 'acc') {
                        if (gender === 'masculine') {
                            str = result[0];
                        }

                        if (gender === 'neuter') {
                            str = result[1];
                        }

                        if (gender === 'feminine') {
                            str = result[2];
                        }
                    } else {
                        str = result[gender === 'feminine' ? 1 : 0];
                    }
                } else {
                    if (adjectiveCase === 'nom' || adjectiveCase === 'acc') {
                        str = result[gender === 'masculine' ? 0 : 1];
                    } else {
                        str = result ? result[0] : word;
                    }
                }

                return { word: str, flat };
            }

            case 'numeral': {
                const numeralCase = getCaseFromAz(tag.CAse);
                const numeralType = getNumeralType(details);

                const numeralParadigm = declensionNumeral(word, numeralType);
                const flat = getDeclensionNumeralFlat(numeralParadigm);

                return {
                    word: numeralParadigm.cases[numeralCase][0],
                    flat,
                };
            }
        }

        return { word };
    }

    public init(lang, done) {
        if (this.lang === lang) {
            done();
        } else {
            this.lang = lang;

            loadDicts(`dicts/${this.lang}`, (files) => {
                // eslint-disable-next-line
                // @ts-ignore
                window.Az = Az.init(files);
                this.translateCache = new Map();

                done();
            });
        }
    }

    public getPlain(nodes: ITranslateNode[]): string {
        return nodes.map(({ str }) => str).join('');
    }

    public replaceNode(nodes: ITranslateNode[], itemIndex, formIndex): ITranslateNode[] {
        return nodes.map((node, i) => {
            if (itemIndex !== i) {
                return node;
            }

            return  {
                ...node,
                str: node.forms[formIndex],
            };
        });
    }

    public translate(text, showTime = true): Promise<ITranslateNode[]> {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => resolve(this.translateSync(text, showTime)), 0);
            } catch (err) {
                reject(err);
            }
        });
    }

    public formatNodes(nodes: ITranslateNode[], flavorisationType, alphabet): ITranslateNode[] {
        return nodes.map((item) => ({
            ...item,
            str: (item.type === 'valid' || item.type === 'maybe') ? this.format(item.str, flavorisationType, alphabet) : item.str,
            forms: item.forms ? item.forms.map((form) => this.format(form, flavorisationType, alphabet)) : undefined,
        }));
    }

    public translateSync(text, showTime = true): ITranslateNode[] {
        const from = this.lang;
        const to = 'isv';
        const startTranslateTime = performance.now();

        const nodes = splitText(text).map((item, index, arr) => {
            const translatable = isCyrillic(item);
            const start = arr.slice(0, index).reduce((acc, element) => acc + element.length, 0);
            const end = start + item.length;

            if (!translatable) {
                return {
                    start,
                    end,
                    type: 'space',
                    str: item,
                };
            }

            const rawWord = item;

            if (this.translateCache.has(rawWord)) {
                return this.translateCache.get(rawWord);
            }

            let type = 'error'
            const parsedWords = Az.morph(rawWord);
            const parsedWord = parsedWords.length ? parsedWords[0] : undefined

            const infinitive = parsedWord && parsedWord.normalize().toString();

            let firstTranslateResult;

            if (parsedWord && infinitive) {
                let translateResults = Dictionary.translate({
                    inputText: infinitive,
                    from,
                    to,
                    searchType: 'full',
                    posFilter: getPosFromAz(parsedWord.tag.POS),
                }, false)[0];

                if (!translateResults.length) {
                    translateResults = Dictionary.translate({
                        inputText: infinitive,
                        from,
                        to,
                        searchType: 'begin',
                        posFilter: '',
                    }, false)[0];

                    type = 'maybe';
                } else {
                    type = 'valid';
                }

                if (translateResults && translateResults.length) {
                    firstTranslateResult = translateResults[0];
                } else {
                    type = 'error';
                }
            }

            let str = rawWord;
            let forms;

            if (type === 'valid' || type === 'maybe') {
                str = Dictionary.getField(firstTranslateResult, 'isv').split(',')[0];

                try {
                    const { word, flat } = this.getWordForm(
                        str,
                        Dictionary.getField(firstTranslateResult, 'addition'),
                        Dictionary.getField(firstTranslateResult, 'partOfSpeech'),
                        parsedWord.tag,
                    );

                    forms = flat;
                    str = word;
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.log('getWordForm error', str, err);
                }

                if (typeof forms === 'string') {
                    forms = [forms];
                }

                const isUp = isFirstUpper(rawWord);

                if (isUp) {
                    str = toUpperCase(str);
                }

                if (forms && forms.length) {
                    forms = forms
                        .map((form) => isUp ? toUpperCase(form) : form)
                    ;
                }
            }

            const result = {
                start,
                end,
                str,
                type,
                forms,
            };

            this.translateCache.set(rawWord, result);

            return result;
        });

        const translateTime = Math.round(performance.now() - startTranslateTime); // @TODO: send to GA

        if (showTime) {
            // eslint-disable-next-line no-console
            console.log('TRANSLATE', `${translateTime}ms`);
        }

        return nodes;
    }
}

export const Translator = TranslatorClass.getInstance();
