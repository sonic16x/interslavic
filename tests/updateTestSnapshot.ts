import * as fs from 'fs';
import { conjugationVerb } from 'legacy/conjugationVerb';
import { declensionAdjective } from 'legacy/declensionAdjective';
import { declensionNoun, declensionNounFlat } from 'legacy/declensionNoun';
import { declensionNumeral } from 'legacy/declensionNumeral';
import { declensionPronoun } from 'legacy/declensionPronoun';
import fetch from 'node-fetch';
import {
    getGender, getNumeralType,
    getPartOfSpeech, getPronounType,
    isAnimated, isIndeclinable,
    isPlural, isSingular,
} from 'utils/wordDetails';

const dictionaryUrl = 'https://docs.google.com/spreadsheets/u/0/d/1N79e_yVHDo-d026HljueuKJlAAdeELAiPzdFzdBuKbY/export?format=tsv';

const testCases = {
    noun: [],
    verb: [],
    adjective: [],
    pronoun: [],
    numeral: [],
};

fetch(dictionaryUrl)
    .then((res) => res.text())
    .then((data) => {
        const splittedBody = data.replace(/#/g, '').split('\n').filter(Boolean).slice(1);

        splittedBody.forEach((line, i) => {
            const [ wordOrig, add, detailsOrig ] = line.split('\t').slice(1, 4);
            const words = wordOrig.split(',').map((e) => e.trim());
            let details = detailsOrig;
            words.forEach((word) => {
                switch (getPartOfSpeech(details)) {
                    case 'noun':
                        const gender = getGender(details);
                        const animated = isAnimated(details);
                        const plural = isPlural(details);
                        const singular = isSingular(details);
                        const indeclinable = isIndeclinable(details);
                        if (details.includes('m./f.')) {
                            details = details.replace('m./f.', 'm.');
                            testCases.noun.push({
                                init: { word, add, details },
                                expected: declensionNoun(word, add, 'masculine', animated, plural, singular, indeclinable),
                            });
                            details = details.replace('m.', 'f.');
                            testCases.noun.push({
                                init: { word, add, details },
                                expected: declensionNoun(word, add, 'feminine', animated, plural, singular, indeclinable),
                            });
                        } else {
                            testCases.noun.push({
                                init: { word, add, details },
                                expected: declensionNoun(word, add, gender, animated, plural, singular, indeclinable),
                            });
                        }
                        break;
                    case 'verb':
                        testCases.verb.push({
                            init: { word, add, details },
                            expected: conjugationVerb(word, add),
                        });
                        break;
                    case 'adjective':
                        testCases.adjective.push({
                            init: { word, add, details },
                            expected: declensionAdjective(word, ''),
                        });
                        break;
                    case 'pronoun':
                        testCases.pronoun.push({
                            init: { word, add, details },
                            expected: declensionPronoun(word, getPronounType(details)),
                        });
                        break;
                    case 'numeral':
                        testCases.numeral.push({
                            init: { word, add, details },
                            expected: declensionNumeral(word, getNumeralType(details)),
                        });
                        break;
                }
                if (i + 1 === splittedBody.length) {
                    fs.writeFileSync('./tests/testCases.json', JSON.stringify(testCases, null, 2));
                }
            });
        });
    });
