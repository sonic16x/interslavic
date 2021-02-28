import { conjugationVerb } from 'legacy/conjugationVerb';
import { declensionAdjective } from 'legacy/declensionAdjective';
import { declensionNoun } from 'legacy/declensionNoun';
import { declensionNumeral } from 'legacy/declensionNumeral';
import { declensionPronoun } from 'legacy/declensionPronoun';
import {
    getGender,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    getVerbDetails,
    isAnimated,
    isIndeclinable,
    isPlural,
    isSingular,
} from 'utils/wordDetails';
import { dictionaryUrl } from 'consts';
import * as fs from 'fs';
import request from 'request';
import { dataDelimiter, Dictionary, validFields } from 'services/dictionary';

function getWordMetadata(itemRaw) {
        const details = Dictionary.getField(itemRaw, 'partOfSpeech');
        const pos = getPartOfSpeech(details);
        const word = Dictionary.getField(itemRaw, 'isv');
        const add = Dictionary.getField(itemRaw, 'addition');
        // const { details } = item;
        const arr = [String(pos)];
        const animated = isAnimated(details);
        const gender = getGender(details);
        const plural = isPlural(details);
        const singular = isSingular(details);
        const indeclinable = isIndeclinable(details);
        switch (pos) {
            case 'noun':
                arr.push('noun-' + gender);
                if (gender.match(/masculine/)) {
                    arr.push(animated ? 'noun-animated' : 'noun-inanimate');
                }
                if (indeclinable) { arr.push('noun-indeclinable'); }
                if (plural) { arr.push('noun-plural'); }
                if (singular) { arr.push('noun-singular'); }
                break;
            case 'verb':
                const verbDetails = getVerbDetails(details);
                if (verbDetails) {
                    arr.push(...verbDetails.map((e) => 'verb-' + e));
                }
                break;
            case 'numeral':
                const numeralType = getNumeralType(details);
                if (numeralType) {
                    arr.push('numeral-' + numeralType);
                }
                break;
            case 'pronoun':
                const pronounType = getPronounType(details);
                if (pronounType) {
                    arr.push('pronoun-' + pronounType);
                }
                break;
        }
        return arr.join(', ');
}

function getWordParadigm(rawItem) {
        const [ wordId, word, add, details ] = rawItem;
        let wordData;
        const remark = '';
        switch (getPartOfSpeech(details)) {
            case 'noun':
                const gender = getGender(details);
                const animated = isAnimated(details);
                const plural = isPlural(details);
                const singular = isSingular(details);
                const indeclinable = isIndeclinable(details);

                wordData = declensionNoun(word, add, gender, animated, plural, singular, indeclinable);

                if (wordData === null) {
                    return 'No data for declination this word/phrase';
                }
                break;
            case 'adjective':
                // const { singularAdj, pluralAdj, comparison } = declensionAdjective(word, '');

                // console.dir(declensionAdjective(word, ''));
                wordData = declensionAdjective(word, '');
                break;
            case 'verb':
                let addVerb = add;
                // temporary fix for searching addition in parent verb
                // must be deleted when column 'addition' will be correct filled !!!
                if (!addVerb && word.includes(' ')) {
                    const BaseWord = Dictionary.getWordList().filter((item) => {
                        if (Dictionary.getField(item, 'isv') === word.split(' ')[0] &&
                            Dictionary.getField(item, 'addition') &&
                            Dictionary.getField(item, 'partOfSpeech').includes('v.')) { return true; }
                        return false;
                    });
                    if (BaseWord.length > 0) {
                        addVerb = Dictionary.getField(BaseWord[0], 'addition');
                    }
                }
                // normal verb
                wordData = conjugationVerb(word, addVerb);
                if (wordData === null) {
                    return `No data for conjugation this verb`;
                }
                break;
            case 'numeral':
                const numeralType = getNumeralType(details);
                wordData = declensionNumeral(word, numeralType);
                if (wordData === null) {
                    return ('No data for declination this word');
                }
                break;
            case 'pronoun':
                const pronounType = getPronounType(details);
                wordData = declensionPronoun(word, pronounType);
                if (wordData === null) {
                    return ('No data for declination this word');
                }
                break;
            default:
                return '';
        }
        return wordData;
    }

request(dictionaryUrl, (err, data) => {
    const wordList = data.body
        .replace(/#/g, '')
        .split('\n')
        .map((l) => l.split('\t'));
    const header = wordList[0];
    const shortWordList = wordList.map((item) => {
        return validFields.map((fld) => item.find((_, i) => header[i] === fld)).map((e) => e.trim());
    });
    Dictionary.init(shortWordList);
    const words = Dictionary.getWordList();
    const paradigmData = words.map((item) => {
        // const itemRaw = Dictionary.getField(item, 'isv');
        return [
            JSON.stringify(item),
            JSON.stringify(getWordParadigm(item)),
            getWordMetadata(item),
        ].join('\t');
    }).join('\n');
    fs.writeFileSync('./static/words_forms.txt', paradigmData);
});
