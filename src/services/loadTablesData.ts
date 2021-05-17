// tslint:disable:no-var-requires
// @ts-ignore
const fetch = typeof CLIENT !== 'undefined' && CLIENT ? window.fetch : require('node-fetch');

import { getTableDataUrl } from 'utils/getTableDataUrl';
import { tablesData } from 'consts';
import { getAllDataFromResults, IAllData } from 'utils/getAllDataFromResults';

export const loadTablesData = new Promise<IAllData>((resolve, reject) => {
    try {
        Promise.all(
            tablesData.map(({ spreadsheetId, sheetId }) => (
                fetch(getTableDataUrl(spreadsheetId, sheetId)).then((res) => res.text())
            )),
        ).then((results: string[]) => resolve(getAllDataFromResults(results)));
    } catch (e) {
        reject(e);
    }
});
