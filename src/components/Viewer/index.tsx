import { useCallback, useEffect, useRef, useState } from 'react';
import { Grid, ModuleRegistry, GridOptions  } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import './index.scss';
import { Dictionary } from 'services/dictionary';
import { initialFields, validFields } from 'consts';
import { useLoading } from 'hooks/useLoading';
import { addLangs, langs } from 'consts';
import { t } from 'translations';
import { removeExclamationMark } from 'utils/removeExclamationMark';
import { removeBrackets } from 'utils/removeBrackets';
import { ViewerHeaderComponent } from './ViewerHeaderComponent';
import { ViewerPOSFilterComponent } from './ViewerPOSFilterComponent';
import { Spinner } from 'components/Spinner';
import { useTablesMapFunction } from 'hooks/useTablesMapFunction';
import { loadTablesData } from 'services/loadTablesData';
import { ViewerContextMenu } from './ViewerContextMenu';

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
    if (fieldWidthMap.hasOwnProperty(field)) {
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
                    displayKey: 'unverified',
                    displayName: 'Unverified words',
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
                        case 'endsWith':
                            const index = wordPrepared.lastIndexOf(filterTextLowerCase);
                            return index >= 0 && index === (wordPrepared.length - filterTextLowerCase.length);
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

const prepareRowData = (displayFields, wordList) => {
    return wordList.map((line) => {
        return displayFields.reduce((obj, field) => {
            obj[field] = line[displayFields.indexOf(field)];

            return obj;
        }, {});
    });
};

const getCellStyle = (params) => (
    params.value[0] === '!' ? { backgroundColor: '#ffcccb' } : null
);

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
                sort: field === 'isv' ? 'asc' : '',
                pinned: initialFields.includes(field) ? 'left' : false,
                lockPinned: initialFields.includes(field),
                cellClass: initialFields.includes(field) ? 'lock-pinned' : '',
                headerTooltip: field,
                tooltipField: field,
                width: getFieldWidth(field),
                cellStyle: getCellStyle,
            }
        ));
};

let gridOptions: GridOptions;

interface IContextState {
    position: {
        x: number;
        y: number;
    };
    text: string;
    googleLink: string;
}

export const Viewer =
    () => {
        const allDataRef = useRef<string[][]>();
        const [isLoadingAllData, setLoadingAllData] = useState(true);
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
        }, [setLoadingAllData]);

        const onCellClicked = useCallback((data) => {
            const box = data.event.target.getBoundingClientRect();

            setContextMenu({
                position: {
                    x: box.x,
                    y: box.y - box.height,
                },
                text: data.value,
                googleLink: getGoogleSheetsLink(data.data.id, data.colDef.field),
            });
        }, [getGoogleSheetsLink]);

        const onResetFiltersClick = useCallback(() => {
            gridOptions.api.setFilterModel(null);
        }, []);

        const onResetSortClick = useCallback(() => {
            gridOptions.api.setSortModel([{
                colId: 'isv',
                sort: 'asc',
            }]);
        }, []);

        useEffect(() => {
            if (
                containerRef &&
                containerRef.current &&
                allLoaded &&
                allDataRef &&
                allDataRef.current
            ) {
                setResultsCount(allDataRef.current.length);
                gridOptions = {
                    enableBrowserTooltips: true,
                    components: {
                        agColumnHeader: ViewerHeaderComponent,
                        posFilter: ViewerPOSFilterComponent,
                    },
                    columnDefs: prepareColumnDefs(validFields),
                    rowData: prepareRowData(validFields, allDataRef.current),
                    onFilterChanged,
                    onCellClicked,
                    onBodyScroll: closeContext,
                    onGridReady,
                };

                /* tslint:disable */
                new Grid(containerRef.current, gridOptions);
            }
        }, [containerRef, allLoaded]);

        return (
            <div className={'viewer'}>
                {(!allLoaded && !isGridReady) && (
                    <div className={'viewer__loader'}>
                        <Spinner
                            size={'4rem'}
                            borderWidth={'.3em'}
                        />
                    </div>
                )}
                {contextMenu && (
                    <ViewerContextMenu
                        position={contextMenu.position}
                        text={contextMenu.text}
                        googleLink={contextMenu.googleLink}
                        onClose={closeContext}
                    />
                )}
                <div className={'viewer__controls'}>
                    <button
                        className={'button button-m'}
                        onClick={onResetFiltersClick}
                    >
                        {t('viewerResetFilters')}
                    </button>
                    <button
                        className={'button button-m'}
                        onClick={onResetSortClick}
                    >
                        {t('viewerResetSort')}
                    </button>
                    <span className={'text-l'}>
                        {t('viewerResultsCount')}: {resultsCount}
                    </span>
                </div>
                <div
                    className={'viewer__container ag-theme-balham'}
                    ref={containerRef}
                />
            </div>
        );
    };

export default Viewer;
