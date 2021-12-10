import { useCallback, useEffect, useRef, useState } from 'react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Grid, GridOptions,ModuleRegistry  } from '@ag-grid-community/core';

import { addLangs, initialFields, langs,validFields } from 'consts';

import { t } from 'translations';

import { Dictionary } from 'services/dictionary';
import { loadTablesData } from 'services/loadTablesData';

import { useLoading } from 'hooks/useLoading';
import { useTablesMapFunction } from 'hooks/useTablesMapFunction';
import { removeBrackets } from 'utils/removeBrackets';
import { removeExclamationMark } from 'utils/removeExclamationMark';
import { wordHasForms } from 'utils/wordHasForms';

import { Button } from 'components/Button';
import { Spinner } from 'components/Spinner';

import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import './Viewer.scss';

import { ViewerContextMenu } from './ViewerContextMenu';
import { ViewerHeaderComponent } from './ViewerHeaderComponent';
import { initPOSFilterIdTypesMap, ViewerPOSFilterComponent } from './ViewerPOSFilterComponent';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
]);

const fieldWidthMap = {
    id: 80,
    addition: 80,
    partOfSpeech: 110,
    type: 10,
    sameInLanguages: 60,
    genesis: 60,
};

const getFieldWidth = (field: string): number => {
    if (field in fieldWidthMap) {
        return fieldWidthMap[field];
    }

    return 100;
};

const customSort = (field: string) => {
    if (field === 'id') {
        return (a: number, b: number) => a - b;
    } else if (field === 'isv') {
        return (a: string, b: string) => removeExclamationMark(a).localeCompare(removeExclamationMark(b), 'sk');
    } else if (field === 'en' || langs.includes(field) || addLangs.includes(field)) {
        return (a: string, b: string) => removeExclamationMark(a).localeCompare(removeExclamationMark(b), `${field}`);
    } else {
        return undefined;
    }
};

const customFilterParams = (field: string) => {
    if (field === 'isv' || field === 'en' || langs.includes(field) || addLangs.includes(field)) {
        return {
            filterOptions: [
                'equals', 'notEqual', 'contains', 'notContains', 'startsWith', 'endsWith',
                {
                    displayKey: 'verified',
                    displayName: 'Verified translations',
                    test: (filterValue, cellValue) => cellValue && (cellValue.charAt(0) !== '!'),
                    hideFilterInput: true,
                },
                {
                    displayKey: 'unverified',
                    displayName: 'Unverified translations',
                    test: (filterValue, cellValue) => cellValue && (cellValue.charAt(0) === '!'),
                    hideFilterInput: true,
                },
            ],
            textCustomComparator: (filter, value, filterText) => {
                const filterTextLowerCase = Dictionary.inputPrepare(`${field}`, filterText.toLowerCase());
                let valueLowerCase = value.toString().toLowerCase();
                valueLowerCase = removeExclamationMark(valueLowerCase);
                valueLowerCase = removeBrackets(valueLowerCase, '[', ']');
                valueLowerCase = removeBrackets(valueLowerCase, '(', ')');
                
                return Dictionary.splitWords(valueLowerCase).some((word) => {
                    const wordPrepared = Dictionary.searchPrepare(`${field}`, word);
                    switch (filter) {
                        case 'contains':
                            return wordPrepared.indexOf(filterTextLowerCase) >= 0;
                        case 'notContains':
                            return wordPrepared.indexOf(filterTextLowerCase) === -1;
                        case 'equals':
                            return wordPrepared === filterTextLowerCase;
                        case 'notEqual':
                            return wordPrepared !== filterTextLowerCase;
                        case 'startsWith':
                            return wordPrepared.indexOf(filterTextLowerCase) === 0;
                        case 'endsWith': {
                            const index = wordPrepared.lastIndexOf(filterTextLowerCase);
                            
                            return index >= 0 && index === (wordPrepared.length - filterTextLowerCase.length);
                        }
                        default:
                            // should never happen
                            // console.warn('invalid filter type ' + filter);
                            return false;
                    }
                });
            },
        };
    } else if (field === 'id') {
        return {
            filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange'],
            defaultOption: 'equals',
        };
    } else {
        return undefined;
    }
};

const prepareRowData = (wordList) => {
    const header = wordList.slice(0, 1)[0];

    return wordList.slice(1).map((line) => {
        return header.reduce((obj, field) => {
            obj[field] = line[header.indexOf(field)];

            return obj;
        }, {});
    });
};

const getCellStyle = (params) => (
    params.value[0] === '!' ? { backgroundColor: '#ffcccb' } : null
);

const removeUnverifiedSymbol = (params) =>
    params.value && params.value[0] === '!' ? params.value.slice(1) : params.value
;

const prepareColumnDefs = (displayFields) => {
    return displayFields
        .map((field) => (
            {
                comparator: customSort(field),
                headerName: field,
                field,
                resizable: true,
                sortable: true,
                suppressMovable: true,
                filter: field === 'partOfSpeech' ? 'posFilter' : 'agTextColumnFilter',
                filterParams: field === 'partOfSpeech' ? undefined : customFilterParams(field),
                suppressMenu: true,
                valueFormatter: removeUnverifiedSymbol,
                sort: field === 'isv' ? 'asc' : '',
                pinned: initialFields.includes(field) ? 'left' : false,
                lockPinned: initialFields.includes(field),
                cellClass: initialFields.includes(field) ? 'lock-pinned' : '',
                headerTooltip: ['isv', ...langs, ...addLangs].includes(field) ? t(`${field}Lang`) : field,
                tooltipField: field,
                width: getFieldWidth(field),
                cellStyle: getCellStyle,
            }
        ));
};

let gridOptions: GridOptions;

interface IContextState {
    buttonRef: HTMLElement;
    formsData?: any;
    text: string;
    googleLink: string;
}

const Viewer =
    () => {
        const allDataRef = useRef<string[][]>();
        const [isLoadingAllData, setLoadingAllData] = useState(true);
        const [isSortEnabled, setSortEnabled] = useState(false);
        const [isGridReady, setGridReady] = useState(false);
        const { initTablesMapFunction, getGoogleSheetsLink } = useTablesMapFunction();
        const containerRef = useRef<HTMLDivElement>();
        const [resultsCount, setResultsCount] = useState<number>();
        const [contextMenu, setContextMenu] = useState<IContextState>();
        const isLoading = useLoading();
        const allLoaded = !isLoading && !isLoadingAllData;

        const onFilterChanged = useCallback(() => {
            setResultsCount(gridOptions.api.getDisplayedRowCount());
        }, [setResultsCount]);

        const onSortChanged = useCallback(() => {
            const isvColumnState = gridOptions.columnApi
                .getColumnState()
                .find(({ colId }) => colId === 'isv')
            ;

            setSortEnabled(isvColumnState.sort !== 'asc');
        }, [setSortEnabled]);

        const onGridReady = useCallback(() => {
            setGridReady(true);
        }, [setGridReady]);

        const closeContext = useCallback(() => {
            setContextMenu(null);
        }, []);

        useEffect(() => {
            loadTablesData.then(({ data, rangesMap }) => {
                allDataRef.current = data;
                initTablesMapFunction(rangesMap);
                setLoadingAllData(false);
            });
        }, [setLoadingAllData, initTablesMapFunction]);

        const onCellClicked = useCallback((data) => {
            let formsData;
            const hasForms = wordHasForms(data.data.isv, data.data.partOfSpeech);
            const isvCol = data.colDef.field === 'isv';

            if (isvCol && hasForms) {
                formsData = {
                    details: data.data.partOfSpeech,
                    word: data.data.isv,
                    add: data.data.addition,
                };
            }

            setContextMenu({
                buttonRef: data.event.target,
                formsData,
                text: removeUnverifiedSymbol(data),
                googleLink: getGoogleSheetsLink(data.data.id, data.colDef.field),
            });
        }, [getGoogleSheetsLink]);

        const onResetFiltersClick = useCallback(() => {
            gridOptions.api.setFilterModel(null);
        }, []);

        const onResetSortClick = useCallback(() => {
            gridOptions.columnApi.resetColumnState();
        }, []);

        useEffect(() => {
            if (
                containerRef &&
                containerRef.current &&
                allLoaded &&
                allDataRef &&
                allDataRef.current
            ) {
                setResultsCount(allDataRef.current.length - 1);

                initPOSFilterIdTypesMap(allDataRef.current);

                gridOptions = {
                    enableBrowserTooltips: true,
                    components: {
                        agColumnHeader: ViewerHeaderComponent,
                        posFilter: ViewerPOSFilterComponent,
                    },
                    columnDefs: prepareColumnDefs(validFields),
                    rowData: prepareRowData(allDataRef.current),
                    onFilterChanged,
                    onSortChanged,
                    onCellClicked,
                    onBodyScroll: closeContext,
                    onGridReady,
                };

                new Grid(containerRef.current, gridOptions);
            }
        }, [containerRef, allLoaded, closeContext, onCellClicked, onFilterChanged, onGridReady, onSortChanged]);

        return (
            <div className="viewer">
                {(!allLoaded && !isGridReady) && (
                    <div className="viewer__loader">
                        <Spinner
                            size="4rem"
                            borderWidth=".3em"
                        />
                    </div>
                )}
                {contextMenu && (
                    <ViewerContextMenu
                        buttonRef={contextMenu.buttonRef}
                        text={contextMenu.text}
                        googleLink={contextMenu.googleLink}
                        formsData={contextMenu.formsData}
                        onClose={closeContext}
                    />
                )}
                <div className="viewer__controls">
                    <Button
                        onClick={onResetFiltersClick}
                        title={t('viewerResetFilters')}
                        disabled={allDataRef && allDataRef.current && resultsCount === allDataRef.current.length - 1}
                    />
                    <Button
                        onClick={onResetSortClick}
                        disabled={!isSortEnabled}
                        title={t('viewerResetSorting')}
                    />
                    <span className="text-l">
                        {t('viewerResultsNumber')}: {resultsCount}
                    </span>
                </div>
                <div
                    className="viewer__container ag-theme-balham"
                    ref={containerRef}
                />
            </div>
        );
    };

export default Viewer;
