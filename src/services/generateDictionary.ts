import { addLangs, dictionaryUrl, dictionaryUrlAdd, langs } from 'consts';
import * as fs from 'fs';
import request from 'request-promise';
import { dataDelimiter, Dictionary, validFields, initialFields } from 'services/dictionary';
import { transposeMatrix } from 'utils/transposeMatrix';

Promise.all([
    request(dictionaryUrl),
    request(dictionaryUrlAdd),
]).then((results: string[]) => {
    const existingFields = [];
    const dataMap: {[id: string]: string[]} = {};

    results.forEach((data, i) => {
        const filterHeader = [];
        const wordList = data
            .replace(/#/g, '')
            .split('\n')
            .map((l) => l.replace('\r', '').split('\t').map((e) => e.trim()))
        ;

        wordList.forEach((line, i) => {
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

            const id = line[0];
            if (id === 'id') {
                return;
            }
            const filteredLine = line.filter((_, i) => filterHeader[i]);
            if (dataMap[id]) {
                dataMap[id] = [
                    ...dataMap[id],
                    ...filteredLine,
                ];
            } else {
                dataMap[id] = filteredLine;
            }
        });
    });

    const isvFieldIndex = validFields.indexOf('isv');
    const allData: string[][] = [
        validFields,
            ...Object.values(dataMap)
            .filter((line) => line.length === validFields.length)
            .sort((lineA, lineB) => {
                const textA = lineA[isvFieldIndex].toUpperCase();
                const textB = lineB[isvFieldIndex].toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }),
    ];

    Dictionary.init(allData);
    const searchIndex = Dictionary.getIndex();
    const transposedData = transposeMatrix(allData);
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated());

    const basicDataTransposed = [];

    transposedData.forEach((column: string[]) => {
        const fieldName = column[0];
        if (initialFields.includes(fieldName)) {
            basicDataTransposed.push(column);
        }
    });

    const basicData = transposeMatrix(basicDataTransposed);
    const basicDataStr = basicData.map((line) => line.join('|')).join('\n');

    const searchIndexBasic = [
        'isv-src',
        'isv',
        'en',
    ].reduce((searchIndexObj, lang) => {
        searchIndexObj[lang] = searchIndex[lang];
        return searchIndexObj;
    }, {});
    const searchIndexBasicStr = JSON.stringify(searchIndexBasic);
    fs.writeFileSync('./static/data/basic.txt', [basicDataStr, searchIndexBasicStr].join(dataDelimiter));
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr);

    [
        ...langs,
        ...addLangs,
    ].forEach((lang) => {
        const langDataTransposed = [
            transposedData.find(([fieldName]) => fieldName === lang),
        ];

        const langData = transposeMatrix(langDataTransposed);
        const langDataStr = langData.map((line) => line.join('|')).join('\n');

        const langDataIndexStr = JSON.stringify({[lang]: searchIndex[lang]});
        fs.writeFileSync(`./static/data/${lang}.txt`, [langDataStr, langDataIndexStr].join(dataDelimiter));
    });
});
