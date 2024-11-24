import { tableColumnsLetters, validFields } from 'consts';

import { estimateIntelligibility, hasIntelligibilityIssues } from "../intelligibilityIssues";

import rowmap from '@eaterable/rowmap';
import TSV from '@eaterable/tsv-parser';

export interface IAllData {
    data: string[][];
    columns: string[][];
    rangesMap: IRangeMap[];
}

export interface IRangeMap {
    header: Map<string, string>;
    columns: Map<string, string>;
}

interface IRowType {
    id: string;
    isv: string;
    type: string;
    intelligibility: string;
    [key: string]: string | undefined;
}

/**
 * Parses and merges TSV data from multiple results.
 * @param tsvResults An array of TSV-formatted strings.
 * @returns An object containing the processed data, columns, and range mappings.
 */
export const getAllDataFromResults = (rawTsvResults: string[]): IAllData => {
    const tsvResults = rawTsvResults.map(tsv => tsv.replaceAll('#', ''));
    const tableHeaders = rawTsvResults.map(tsv => TSV.headers(tsv).map(x => x.trim()));
    const rangesMap: IRangeMap[] = tableHeaders.map((headers) => {
        return {
            columns: new Map<string, string>(),
            header: headers.reduce((map, header) => {
                return map.set(header, tableColumnsLetters[map.size]);
            }, new Map<string, string>()),
        };
    });

    const Row = rowmap<IRowType>({ headers: tableHeaders.flat(), preventCollisions: true });
    const rowsById = new Map<string, InstanceType<typeof Row>>();

    for (let k = 0; k < tsvResults.length; k++){
        const raw = tsvResults[k];
        let index = 0;

        for (const line of TSV.parse(raw)) {
            index++;

            const row = new Row(line, index);
            preprocessRow(row);

            const { id } = row;
            if (!id) continue;

            rangesMap[k].columns.set(id, `${index}`);

            const existing = rowsById.get(id);
            if (existing) {
                existing.array.push(...row);
            } else {
                rowsById.set(id, row);
            }
        }
    }

    // Convert the ID map to a sorted array based on IDs
    const rows = sortRowsById(rowsById);

    // Collect all unique, valid field names in the order of uniqueHeaders
    const columnNames = Object.keys(Row.prototype).filter((header) => validFields.includes(header));

    // Build data matrix
    const columns: string[][] = columnNames.map((columnName) => {
        return rows.map((row) => row[columnName] ?? '');
    });

    const data: string[][] = rows.map((row) => {
        return columnNames.map((columnName) => row[columnName] ?? '');
    });

    return {
        data,
        columns,
        rangesMap,
    };
};

/**
 * Preprocesses a row object based on special markers.
 * @param row The row object to preprocess.
 */
function preprocessRow(row: IRowType & { readonly array: string[]; }): void {
    const n = row.array.length;
    for (let i = 0; i < n; i++) {
        row[i] = (row[i] || '').trim();
    }

    const { id, isv, type, intelligibility } = row;

    // Handle addition suggestions (ISV starts with '!')
    if (id.startsWith('-')) {
        row.id = id.slice(1);
        row.type = '9' + (type || '0');
    }

    // Handle deletion suggestions (ID starts with '-')
    if (isv.startsWith('!')) {
        row.isv = isv.slice(1);
        row.type = '99';
    }

    // Mark to show intelligibility issues
    const intelligibilityVector = estimateIntelligibility(intelligibility);
    if (hasIntelligibilityIssues(intelligibilityVector)) {
        row.type = '98';
    }
}

/**
 * Sorts the rows by their IDs.
 * @param rowsById The map of rows by ID.
 * @returns An array of sorted row objects.
 */
function sortRowsById(rowsById: Map<string, IRowType>): IRowType[] {
    return Array.from(rowsById.values()).sort((a, b) => (+a.id - +b.id));
}
