import request from 'request';
import { dictionaryUrl } from 'consts';
import { Dictionary } from 'utils/dictionary';
import * as fs from 'fs';

const validFields = [
    'isv',
    'addition',
    'partOfSpeech',
    // 'type',
    'en',
    // 'sameInLanguages',
    // 'genesis',
    'ru',
    'be',
    'uk',
    'pl',
    'cs',
    'sk',
    'bg',
    'mk',
    'sr',
    'hr',
    'sl',
    'de',
    // 'id',
    // 'id',
];

request(dictionaryUrl, (err, data) => {
    const wordList = data.body
        .replace(/#/g, '')
        .split('\n')
        .map((l) => l.split('\t'));
    const header = wordList[0];
    fs.writeFileSync('./static/wordList.tsv', wordList.map((item) => {
        return item.filter((_, i) => validFields.indexOf(header[i]) !== -1).join('\t');
    }).join('\n'));
    Dictionary.init(wordList, true);
    const searchIndex = Dictionary.getIndex();
    fs.writeFileSync('./static/searchIndex.tsv', searchIndex.map((item) => {
        return [
            item[0],
            Array.from(new Set(item[1])).filter(Boolean).join('|'),
        ].join('\t');
    }).join('\n'));
});
