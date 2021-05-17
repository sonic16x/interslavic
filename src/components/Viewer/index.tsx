import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { HeaderComponent } from './HeaderComponent';
import { POSFilterComponent } from './POSFilterComponent';
import { Spinner } from 'components/Spinner';
import { setNotificationAction } from 'actions';
import { useTablesMapFunction } from 'hooks/useTablesMapFunction';
import { loadTablesData } from 'services/loadTablesData';

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
    } else if (langs.includes(field) || addLangs.includes(field)) {
        return (a: string, b: string) => removeExclamationMark(a).localeCompare(removeExclamationMark(b), `${field}`);
    } else {
        return undefined;
    }
};

const customFilterParams = (field: string) => {
    if (field === 'isv' || langs.includes(field) || addLangs.includes(field)) {
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
                const valueLowerCase = removeExclamationMark(value.toString().toLowerCase());
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

export const Viewer =
    () => {
        const dispatch = useDispatch();
        const allDataRef = useRef<string[][]>();
        const [isLoadingAllData, setLoadingAllData] = useState(true);
        const { initTablesMapFunction, getGoogleSheetsLink } = useTablesMapFunction();
        const containerRef = useRef<HTMLDivElement>();
        const [resultsCount, setResultsCount] = useState<number>();
        const [contextMenu, setContextMenu] = useState<{ x: number, y: number, value: string, href: string }>();
        const isLoading = useLoading();
        const allLoaded = !isLoading && !isLoadingAllData;

        const onFilterChanged = useCallback(() => {
            setResultsCount(gridOptions.api.getDisplayedRowCount());
        }, [setResultsCount]);

        const onBodyScroll = (params) => {
            setContextMenu(null);
        };

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
                x: box.x,
                y: box.y - box.height,
                value: data.value,
                href: getGoogleSheetsLink(data.data.id, data.colDef.field),
            });
        }, [getGoogleSheetsLink, contextMenu]);

        const onResetFiltersClick = useCallback(() => {
            gridOptions.api.setFilterModel(null);
        }, []);

        const onResetSortClick = useCallback(() => {
            gridOptions.api.setSortModel([{
                colId: 'isv',
                sort: 'asc',
            }]);
        }, []);

        const closeContext = useCallback(() => {
            if (contextMenu) {
                setContextMenu(null);
            }
        }, [contextMenu]);

        const onClipboardClick = useCallback(() => {
            navigator.clipboard.writeText(contextMenu.value).then(() => {
                const notificationText = t('clipboardCopyNotification', {
                    str: contextMenu.value,
                });
                dispatch(setNotificationAction(notificationText));
                closeContext();
            });
        }, [contextMenu]);

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
                        agColumnHeader: HeaderComponent,
                        posFilter: POSFilterComponent,
                    },
                    columnDefs: prepareColumnDefs(validFields),
                    rowData: prepareRowData(validFields, allDataRef.current),
                    onFilterChanged,
                    onCellClicked,
                    onBodyScroll,
                };

                /* tslint:disable */
                new Grid(containerRef.current, gridOptions);
            }
        }, [containerRef, allLoaded]);

        return (
            <div className={'viewer'}>
                {(!allLoaded) && (
                    <div className={'viewer__loader'}>
                        <Spinner
                            size={'4rem'}
                            borderWidth={'.3em'}
                        />
                    </div>
                )}
                {contextMenu && (
                    <div
                        className={'viewer__context-menu'}
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                        }}
                    >
                        {contextMenu.value && (
                            <>
                                <p className={'viewer__context-menu-text'}>
                                    {contextMenu.value}
                                </p>
                                <button
                                    className={'viewer__context-menu-item button button-m'}
                                    onClick={onClipboardClick}
                                >
                                    {t('viewerCopyToClipboard')}
                                </button>
                            </>
                        )}
                        <a
                            className={'viewer__context-menu-item button button-m'}
                            href={contextMenu.href}
                            onClick={closeContext}
                            target={'_blank'}
                        >
                            {t('viewerOpenCeilInGoogleSheets')}
                        </a>
                    </div>
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
