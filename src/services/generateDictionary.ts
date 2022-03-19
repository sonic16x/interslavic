import * as fs from 'fs';

import { addLangs, initialAddFields, initialFields,langs } from 'consts';

import { Dictionary } from 'services/dictionary';
import { loadTablesData } from 'services/loadTablesData';

import { getColumnName } from 'utils/getColumnName';
import { transposeMatrix } from 'utils/transposeMatrix';

loadTablesData.then(({ data, columns }) => {
    Dictionary.init(data);

    const searchIndex = Dictionary.getIndex();
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated());

    const basicDataTransposed = [];
    const initialFilteredFields = initialFields.filter((field) => !initialAddFields.includes(field));

    columns.forEach((column: string[]) => {
        const fieldName = getColumnName(column);
        if (initialFilteredFields.includes(fieldName) || langs.includes(fieldName)) {
            basicDataTransposed.push(column);
        }
    });

    const basicData = transposeMatrix(basicDataTransposed);

    const searchIndexBasic = [
        'isv-src',
        'isv',
        'en',
        ...langs,
    ].reduce((searchIndexObj, lang) => {
        searchIndexObj[lang] = searchIndex[lang];

        return searchIndexObj;
    }, {});

    const jsonDataStr = JSON.stringify({
        wordList: basicData,
        searchIndex: searchIndexBasic,
    });

    if (!fs.existsSync('./static/data')) {
        fs.mkdirSync('./static/data');
    }

    fs.writeFileSync('./static/data/basic.json', jsonDataStr);
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr);

    addLangs.forEach((lang) => {
        const langDataTransposed = [
            columns.find(([fieldName]) => fieldName === lang),
        ];

        const langData = transposeMatrix(langDataTransposed);

        const jsonDataStr = JSON.stringify({
            wordList: langData.map(([item]) => item),
            searchIndex: { [lang]: searchIndex[lang] },
        });

        fs.writeFileSync(`./static/data/${lang}.json`, jsonDataStr);
    });
});
