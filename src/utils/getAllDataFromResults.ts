import { isMainTable } from 'utils/isMainTable';
import { getId } from 'utils/getId';
import { transposeMatrix } from 'utils/transposeMatrix';
import { validFields } from 'services/dictionary';
import { getColumnName } from 'utils/getColumnName';

export interface IAllData {
    data: string[][];
    columns: string[][];
}

export const getAllDataFromResults = (results: string[]): IAllData => {
    const existingFields = new Set();
    const columns = [];
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
                    columns.push(column);
                }
            })
        ;
    });

    const data = transposeMatrix<string>(columns);

    return {
        data,
        columns,
    };
};
