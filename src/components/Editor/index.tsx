import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Grid, ModuleRegistry, GridOptions  } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import './index.scss';
import { Dictionary, initialFields } from 'services/dictionary';
import { useLoading } from 'hooks/useLoading';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';
import { addLangs, langs } from 'consts';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
]);

const fieldWidth = {
    id: 80,
    addition: 80,
    partOfSpeech: 80,
    type: 10,
    sameInLanguages: 60,
    genesis: 60,
};
const getWidth = (field) => {
    if (fieldWidth.hasOwnProperty(field)) {
        return fieldWidth[field];
    }

    return 100;
};

export const Editor: React.FC =
    () => {
        const dictionaryLanguages = useDictionaryLanguages();
        const containerRef = useRef<HTMLDivElement>();
        const isLoading = useLoading();

        const displayFields = [
            ...initialFields,
            ...langs,
            ...addLangs.filter((lang) => dictionaryLanguages.includes(lang)),
        ];

        useEffect(() => {
            if (containerRef && containerRef.current && !isLoading) {
                const gridOptions: GridOptions = {
                    enableBrowserTooltips: true,
                    columnDefs: displayFields
                        .map((field) => (
                            {
                                headerName: field,
                                field,
                                resizable: true,
                                sortable: true,
                                suppressMovable: true,
                                filter: true,
                                sort: field === 'isv' ? 'asc' : '',
                                pinned: initialFields.includes(field) ? 'left' : false,
                                lockPinned: initialFields.includes(field),
                                cellClass: initialFields.includes(field) ? 'lock-pinned' : '',
                                headerTooltip: field,
                                tooltipField: field,
                                width: getWidth(field),
                                cellStyle: (params) => {
                                    if (params.value[0] === '!') {
                                        return {backgroundColor: '#ffcccb'};
                                    }

                                    return null;
                                },
                            }
                        )),
                    rowData: Dictionary.getWordList().map((line) => {
                        return displayFields.reduce((obj, field) => {
                            obj[field] = Dictionary.getField(line, field);

                            return obj;
                        }, {});
                    }),
                };

                /* tslint:disable */
                new Grid(containerRef.current, gridOptions);
            }
        }, [containerRef, isLoading]);

        return (
            <div
                className={'editor ag-theme-balham'}
                ref={containerRef}
            />
        );
    };
