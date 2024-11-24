import { tablesData } from 'consts';

import { getAllDataFromResults, IAllData } from 'utils/getAllDataFromResults';
import { getTableDataUrl } from 'utils/getTableDataUrl';

async function doLoadTablesData(): Promise<IAllData> {
    const results = await Promise.all(
        tablesData.map(async ({ spreadsheetId, sheetId }) => {
            const res = await fetch(getTableDataUrl(spreadsheetId, sheetId));

            return res.text();
        })
    );

    return getAllDataFromResults(results);
}

export const loadTablesData = doLoadTablesData();

