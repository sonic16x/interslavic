import {addLangs, dictionaryUrl, dictionaryUrlAdd, langs} from 'consts';
import * as fs from 'fs';
import request from 'request-promise';
import { dataDelimiter, Dictionary, validFields } from 'services/dictionary';

Promise.all([
    request(dictionaryUrl),
    request(dictionaryUrlAdd),
]).then((results) => {
    let allData = [];
    const existingFields = [];

    results.forEach((data, i) => {
        const filterHeader = [];
        const wordList = data
            .replace(/#/g, '')
            .split('\n')
            .map((l) => l.replace('\r', '').split('\t').map((e) => e.trim()))
        ;

        const sorteredWordList = [
            wordList[0],
            ...wordList.slice(1)
                .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10)),
        ];
        sorteredWordList.forEach((line, i) => {
            if (i === 0) {
                line.forEach((fieldName) => {
                    if (!existingFields.includes(fieldName) && validFields.includes(fieldName)) {
                        existingFields.push(fieldName);
                        filterHeader.push(true);
                    } else {
                        filterHeader.push(false);
                    }
                });
            }

            const filteredLine = line.filter((_, i) => filterHeader[i]);

            if (allData[i]) {

                const newLine = [
                    ...allData[i],
                    ...filteredLine,
                ];
                allData[i] = newLine;
            } else {
                allData.push(filteredLine);
            }
        });
    });

    allData = allData.filter((item) => (item[0] !== '' && item[0] !== '!'));

    const wordListStr = allData.map((item) => item.join('\t')).join('\n');
    Dictionary.init(allData);
    const searchIndex = Dictionary.getIndex();
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated());
    const searchIndexAll = {};
    [
        'isv-src',
        ...langs,
        ...addLangs,
    ].forEach((lang) => {
        searchIndexAll[lang] = searchIndex[lang].map((item) => {
            return [
                item[0],
                Array.from(new Set(item[1])).filter(Boolean).join('|'),
            ].join('\t');
        }).join('\n');
    });
    const searchIndexStr = JSON.stringify(searchIndex);
    fs.writeFileSync('./static/data.txt', [wordListStr, searchIndexStr, translateStatisticStr].join(dataDelimiter));
});
