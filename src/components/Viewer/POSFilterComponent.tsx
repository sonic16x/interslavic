import { render } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from 'translations';
import { Checkbox } from 'components/Checkbox';
import { partOfSpeechList, genderList, Gender, getPartOfSpeech, getGender } from 'utils/wordDetails';

import './POSFilterComponent.scss';

const allFilterList = [
    ...partOfSpeechList,
    ...genderList,
];

let globalFilterList = new Set(allFilterList);
let isGenderFilter = false;

const POSFilterComponentReact = ({ agParams, resetEvent }: { agParams: any, resetEvent: (callback: any) => void }) => {
    const [filterList, setFilterList] = useState(allFilterList);

    const filterResetCallback = useCallback((event) => {
        setFilterList(allFilterList);
    }, []);

    useEffect(() => {
        resetEvent(filterResetCallback);
    }, []);

    useEffect(() => {
        globalFilterList = new Set(filterList);
        isGenderFilter = Array.from(globalFilterList).length === genderList.length;
        agParams.filterChangedCallback();
    }, [filterList]);

    const onChange = useCallback((filterKey) => {
        if (filterKey === 'all') {
            if (filterList.length === 0) {
                setFilterList(allFilterList);
            } else {
                setFilterList([]);
            }

            return;
        }

        if (filterList.includes(filterKey)) {
            if (filterKey === 'noun') {
                setFilterList([
                    ...filterList.filter((filter ) => (filter !== filterKey && !genderList.includes(filter as Gender))),
                ]);
            } else {
                setFilterList([
                    ...filterList.filter((filter) => filter !== filterKey),
                ]);
            }
        } else {
            if (filterKey === 'noun') {
                setFilterList([...filterList, filterKey, ...genderList]);
            } else {
                setFilterList([...filterList, filterKey]);
            }
        }
    }, [filterList, setFilterList]);

    return (
        <>
            <p className={'bold text-s'}>
                {t('viewerPosFilter')}
            </p>
            <div className={'viewer-pos-filter__list'}>
                <Checkbox
                    key={'all'}
                    className={'text-xs'}
                    title={t('viewerFiltersAll')}
                    checked={filterList.length !== 0}
                    part={filterList.length !== allFilterList.length}
                    onChange={() => onChange('all')}
                />
                {partOfSpeechList.map((pos, i) => (
                    <>
                        <Checkbox
                            key={pos}
                            title={t(pos)}
                            checked={filterList.includes(pos)}
                            part={pos === 'noun' ? filterList.filter((filter) => genderList.includes(filter as Gender)).length !== genderList.length : false}
                            onChange={() => onChange(pos)}
                        />
                        <div
                            className={'viewer-pos-filter__sub-list'}
                        >
                            {pos === 'noun' && (
                                genderList.map((gender) => (
                                    <Checkbox
                                        key={gender}
                                        title={t(`noun-${gender}`)}
                                        checked={filterList.includes(gender)}
                                        onChange={() => onChange(gender)}
                                    />
                                ))
                            )}
                        </div>
                    </>
                ))}
            </div>
        </>
    );
};

export class POSFilterComponent {
    private agParams: any;
    private mainElement: HTMLDivElement;
    private resetCallback: () => void;

    public init(agParams) {
        this.agParams = agParams;
        this.mainElement = document.createElement('div');
        this.mainElement.className = 'viewer-pos-filter';

        this.resetEvent = this.resetEvent.bind(this);

        render(<POSFilterComponentReact agParams={agParams} resetEvent={this.resetEvent} />, this.mainElement);
    }

    public doesFilterPass(params) {
        let passed = true;

        const value = this.agParams.valueGetter(params);
        const pos = getPartOfSpeech(value);
        const gender = getGender(value);

        if (pos === 'noun') {
            if (isGenderFilter) {
                if (!globalFilterList.has(pos)) {
                    passed = false;
                }
            } else {
                if (!globalFilterList.has(gender)) {
                    passed = false;
                }
            }
        } else {
            if (!globalFilterList.has(pos)) {
                passed = false;
            }
        }

        return passed;
    }

    public isFilterActive() {
        return Array.from(globalFilterList).filter(Boolean).length !== allFilterList.length;
    }

    public setModel(model) {
        if (!model && this.resetCallback) {
            this.resetCallback();
        }
    }

    public getModel() {
        return Array.from(globalFilterList);
    }

    public getGui() {
        return this.mainElement;
    }

    private resetEvent(callback) {
        this.resetCallback = callback;
    }
}
