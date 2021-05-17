import { useState, useCallback } from 'react';
import { IRangeMap } from 'utils/getAllDataFromResults';
import { tablesData } from 'consts';
import { getTablePublicUrl } from 'utils/getTablePublicUrl';

export function useTablesMapFunction(): {
    initTablesMapFunction: (rangesMap: IRangeMap[]) => void,
    getGoogleSheetsLink: (id: string, field: string) => string,
} {
    const [tablesMap, setTablesMap] = useState(true);

    const initTablesMapFunction = useCallback(
        (rangesMap) => setTablesMap(rangesMap),
        [tablesMap],
        )
    ;

    const getGoogleSheetsLink = useCallback(
        (id, field) => {
            let tableIndex;
            let spreadsheetId;
            let sheetId;
            let rangeMap;

            for (let i = 0; i < tablesData.length; i++) {
                if (tablesData[i].fields.includes(field)) {
                    tableIndex = i;
                    spreadsheetId = tablesData[i].spreadsheetId;
                    sheetId = tablesData[i].sheetId;
                    rangeMap = tablesMap[i];

                    break;
                }
            }

            const publicUrl = getTablePublicUrl(spreadsheetId, sheetId);
            const letter = rangeMap.header.get(field);
            const index = rangeMap.columns.get(id);

            return `${publicUrl}&range=${letter}${index}`;
        },
        [tablesMap],
    );

    return {
        initTablesMapFunction,
        getGoogleSheetsLink,
    };
}
