import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, ModuleRegistry, GridOptions  } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import './index.scss';
import { Dictionary, initialFields } from 'services/dictionary';
import { useLoading } from 'hooks/useLoading';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';
import { addLangs, langs } from 'consts';
import { t } from 'translations';
import { node } from 'webpack';
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
        return (a: string, b: string) => a.localeCompare(b, 'sk');
    } else if (langs.includes(field) || addLangs.includes(field)) {
        return (a: string, b: string) => a.localeCompare(b, `${field}`);
    } else {
        return undefined;
    }
};

const customFilterParams = (field: string) => {
    if (field === 'isv' || langs.includes(field) || addLangs.includes(field)) {
        return {
            textFormatter: (gridValue: string): string => {
                return Dictionary.searchPrepare(`${field}`, gridValue);
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
        const dictionaryLanguages = useDictionaryLanguages();
        const allDataRef = useRef<string[][]>();
        const [isLoadingAllData, setLoadingAllData] = useState(true);
        const [isTablesMapLoading, getGoogleSheetsLink] = useTablesMapFunction();
        const containerRef = useRef<HTMLDivElement>();
        const [resultsCount, setResultsCount] = useState<number>();
        const [contextMenu, setContextMenu] = useState<{ x: number, y: number, value: string, href: string }>();
        const isLoading = useLoading();
        const allLoaded = !isLoading && !isLoadingAllData && !isTablesMapLoading;

        const displayFields = [
            ...initialFields,
            ...langs,
            ...addLangs.filter((lang) => dictionaryLanguages.includes(lang)),
        ];

        const onFilterChanged = useCallback(() => {
            setResultsCount(gridOptions.api.getDisplayedRowCount());
        }, [setResultsCount]);

        const onBodyScroll = (params) => {
            setContextMenu(null);
        };

        useEffect(() => {
            loadTablesData.then(({ data }) => {
                allDataRef.current = data;
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
                    columnDefs: prepareColumnDefs(displayFields),
                    rowData: prepareRowData(displayFields, allDataRef.current),
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
