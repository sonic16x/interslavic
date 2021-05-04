import { addLangs, dictionaryUrl, dictionaryUrlAdd, langs } from 'consts';
import * as fs from 'fs';
import fetch from 'node-fetch';
import { dataDelimiter, Dictionary, validFields, initialFields } from 'services/dictionary';
import { transposeMatrix } from 'utils/transposeMatrix';

const isMainTable = (tableNumber) => tableNumber === 0;
const getId = (line) => line[0];
const getColumnName = (column) => column[0];

Promise.all([
    fetch(dictionaryUrl).then((res) => res.text()),
    fetch(dictionaryUrlAdd).then((res) => res.text()),
]).then((results: string[]) => {
    const existingFields = new Set();
    const allColumns = [];
    const existingIds = new Set();

    results.map((data, tableNumber) => {
        const wordList = data
            .replace(/#/g, '')
            .split('\n')
            .map((l) => l.replace('\r', '').split('\t').map((e) => e.trim()))
        ;

        if (!isMainTable(tableNumber)) {
            wordList.forEach((line) => existingIds.add(getId(line)));
        }

        wordList.sort((a, b) => {
            if (getId(a) === 'id' || getId(b) === 'id') {
                return 1;
            }

            return parseInt(getId(a), 10) - parseInt(getId(b), 10);
        });

        return wordList;
    }).forEach((table) => {
        const filteredTableByIds = table.filter((line) => existingIds.has(getId(line)));

        transposeMatrix(filteredTableByIds)
            .filter((column: string[]) => validFields.includes(column[0]))
            .forEach((column: string[]) => {
                if (validFields.includes(getColumnName(column)) && !existingFields.has(getColumnName(column))) {
                    existingFields.add(getColumnName(column));
                    allColumns.push(column);
                }
            })
        ;
    });

    const allData = transposeMatrix<string>(allColumns);

    Dictionary.init(allData);

    const searchIndex = Dictionary.getIndex();
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated());

    const basicDataTransposed = [];

    allColumns.forEach((column: string[]) => {
        const fieldName = getColumnName(column);
        if (initialFields.includes(fieldName) || langs.includes(fieldName)) {
            basicDataTransposed.push(column);
        }
    });

    const basicData = transposeMatrix(basicDataTransposed);
    const basicDataStr = basicData.map((line) => line.join('|')).join('\n');

    const searchIndexBasic = [
        'isv-src',
        'isv',
        'en',
        ...langs,
    ].reduce((searchIndexObj, lang) => {
        searchIndexObj[lang] = searchIndex[lang];

        return searchIndexObj;
    }, {});

    const searchIndexBasicStr = JSON.stringify(searchIndexBasic);

    if (!fs.existsSync('./static/data')) {
        fs.mkdirSync('./static/data');
    }

    fs.writeFileSync('./static/data/basic.txt', [basicDataStr, searchIndexBasicStr].join(dataDelimiter));
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr);

    addLangs.forEach((lang) => {
        const langDataTransposed = [
            allColumns.find(([fieldName]) => fieldName === lang),
        ];

        const langData = transposeMatrix(langDataTransposed);
        const langDataStr = langData.map((line) => line.join('|')).join('\n');

        const langDataIndexStr = JSON.stringify({[lang]: searchIndex[lang]});
        fs.writeFileSync(`./static/data/${lang}.txt`, [langDataStr, langDataIndexStr].join(dataDelimiter));
    });
});
