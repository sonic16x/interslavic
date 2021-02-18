import { dictionaryUrl } from 'consts';
import * as fs from 'fs';
import request from 'request';
import { dataDelimiter, Dictionary, validFields } from 'services/dictionary';

request(dictionaryUrl, (err, data) => {
    const wordList = data.body
        .replace(/#/g, '')
        .split('\n')
        .map((l) => l.split('\t'));
    const header = wordList[0];
    const shortWordList = wordList.map((item) => {
        return validFields.map((fld) => item.find((_, i) => header[i] === fld)).map((e) => e.trim());
    });
    const wordListStr = shortWordList.slice(1).map((item) => item.join('\t')).join('\n');
    Dictionary.init(shortWordList);
    const searchIndex = Dictionary.getIndex();
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated());
    const searchIndexStr = searchIndex.map((item) => {
        return [
            item[0],
            Array.from(new Set(item[1])).filter(Boolean).join('|'),
        ].join('\t');
    }).join('\n');
    fs.writeFileSync('./static/data.txt', [wordListStr, searchIndexStr, translateStatisticStr].join(dataDelimiter));
});
