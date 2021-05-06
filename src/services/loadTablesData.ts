// tslint:disable:no-var-requires
// @ts-ignore
const fetch = typeof CLIENT !== 'undefined' && CLIENT ? window.fetch : require('node-fetch');
import { dictionaryUrl, dictionaryUrlAdd } from 'consts';
import { getAllDataFromResults, IAllData } from 'utils/getAllDataFromResults';

export const loadTablesData = new Promise<IAllData>((resolve, reject) => {
    try {
        Promise.all([
            fetch(dictionaryUrl).then((res) => res.text()),
            fetch(dictionaryUrlAdd).then((res) => res.text()),
        ]).then((results: string[]) => resolve(getAllDataFromResults(results)));
    } catch (e) {
        reject(e);
    }
});
