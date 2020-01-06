import request from 'request';
import { dictionaryUrl } from 'consts';
import { Dictionary, validFields } from 'utils/dictionary';
import * as fs from 'fs';

request(dictionaryUrl, (err, data) => {
    const wordList = data.body
        .replace(/#/g, '')
        .split('\n')
        .map((l) => l.split('\t'));
    const header = wordList[0];
    const shortWordList = wordList.map((item) => {
        return item.filter((_, i) => validFields.indexOf(header[i]) !== -1);
    });
    const wordListStr = shortWordList.slice(1).map((item) => item.join('\t')).join('\n');
    Dictionary.init(shortWordList, true);
    const searchIndex = Dictionary.getIndex();
    const searchIndexStr = searchIndex.map((item) => {
        return [
            item[0],
            Array.from(new Set(item[1])).filter(Boolean).join('|'),
        ].join('\t');
    }).join('\n');
    fs.writeFileSync('./static/data.txt', [wordListStr, searchIndexStr].join('<>'));
});
