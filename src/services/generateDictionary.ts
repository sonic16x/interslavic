import { addLangs, langs } from 'consts';
import * as fs from 'fs';
import { Dictionary } from 'services/dictionary';
import { dataDelimiter, validFields, initialFields } from 'consts';
import { transposeMatrix } from 'utils/transposeMatrix';
import { getColumnName } from 'utils/getColumnName';
import { loadTablesData } from 'services/loadTablesData';

loadTablesData.then(({ data, columns }) => {
    Dictionary.init(data);

    const searchIndex = Dictionary.getIndex();
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated());

    const basicDataTransposed = [];

    columns.forEach((column: string[]) => {
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
            columns.find(([fieldName]) => fieldName === lang),
        ];

        const langData = transposeMatrix(langDataTransposed);
        const langDataStr = langData.map((line) => line.join('|')).join('\n');

        const langDataIndexStr = JSON.stringify({[lang]: searchIndex[lang]});
        fs.writeFileSync(`./static/data/${lang}.txt`, [langDataStr, langDataIndexStr].join(dataDelimiter));
    });
});
