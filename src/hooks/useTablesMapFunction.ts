import { useState, useEffect, useCallback } from 'react';
import { loadTablesMap } from 'utils/loadTablesMap';
import { getCeilGoogleSheetsLink } from 'utils/getCeilGoogleSheetsLink';

export function useTablesMapFunction(): [boolean, (id: string, field: string) => string] {
    const [tablesMap, setTablesMap] = useState(null);

    useEffect(() => {
        loadTablesMap.then((data) => setTablesMap(data));
    }, []);

    const callback = useCallback(
        (id, field) => getCeilGoogleSheetsLink(tablesMap, id, field),
        [tablesMap],
        )
    ;

    return [
        !tablesMap,
        callback,
    ];
}
