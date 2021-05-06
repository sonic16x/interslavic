import { dictionaryUrl, dictionaryUrlAdd } from 'consts';
import { getFirstLineLink } from 'utils/getFirstLineLink';
import { getFirstColumnLink } from 'utils/getFirstColumnLink';
import { tableStrToArray } from 'utils/tableStrToArray';
import { getHeaderMap } from 'utils/getHeaderMap';
import { getColumnMap } from 'utils/getColumnMap';

export const loadTablesMap = new Promise((resolve, reject) => {
    try {
        const tablesMaps = {
            main: {
                columns: undefined,
                header: undefined,
            },
            add: {
                columns: undefined,
                header: undefined,
            },
        };

        Promise.all([
            fetch(getFirstLineLink(dictionaryUrl)).then((res) => res.text()),
            fetch(getFirstColumnLink(dictionaryUrl)).then((res) => res.text()),
            fetch(getFirstLineLink(dictionaryUrlAdd)).then((res) => res.text()),
            fetch(getFirstColumnLink(dictionaryUrlAdd)).then((res) => res.text()),
        ]).then((results) => {
            results.forEach((result, i) => {
                const data = tableStrToArray(result);

                switch (i) {
                    case 0:
                        return tablesMaps.main.header = getHeaderMap(data);
                    case 1:
                        return tablesMaps.main.columns = getColumnMap(data);
                    case 2:
                        return tablesMaps.add.header = getHeaderMap(data);
                    case 3:
                        return tablesMaps.add.columns = getColumnMap(data);
                }
            });

            resolve(tablesMaps);
        });
    } catch (e) {
        reject(e);
    }
});
