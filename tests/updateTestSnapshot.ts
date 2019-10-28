import request from 'request';
import { dictionaryUrl } from '../src/consts';
import { declensionNoun } from '../src/utils/legacy/declensionNoun';
import { declensionAdjective } from '../src/utils/legacy/declensionAdjective';
import { conjugationVerb } from '../src/utils/legacy/conjugationVerb';
import {
    getGender,
    getPartOfSpeech,
    isAnimated,
    isPlural,
} from '../src/utils/wordDetails';
import { markFluentVowel } from '../src/utils/markFluentVowel';
import * as fs from 'fs';

const testCases = {
    noun: [],
    verb: [],
    adjective: [],
};

request(dictionaryUrl, (err, data) => {
    const splittedBody = data.body.split('\n').filter(Boolean).slice(1);
    splittedBody.forEach((line, i) => {
        const [ word, add, details ] = line.split('\t').slice(0, 3);
        switch (getPartOfSpeech(details)) {
            case 'noun':
                const gender = getGender(details);
                const animated = isAnimated(details);
                const plural = isPlural(details);

                testCases.noun.push({
                    init: { word, add, details },
                    expected: declensionNoun(word, add, gender, animated, plural),
                });
                break;
            case 'verb':
                testCases.verb.push({
                    init: { word, add, details },
                    expected: conjugationVerb(word, add.replace(/\(|\)/g, '')),
                });
                break;
            case 'adjective':
                testCases.adjective.push({
                    init: { word, add, details },
                    expected: declensionAdjective(word),
                });
                break;
        }
        if (i + 1 === splittedBody.length) {
            fs.writeFileSync('./tests/testCases.json', JSON.stringify(testCases, null, 2));
        }
    });
});
