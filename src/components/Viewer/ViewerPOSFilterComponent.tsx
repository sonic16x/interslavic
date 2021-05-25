import { render } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from 'translations';
import { Checkbox } from 'components/Checkbox';
import {
    getPartOfSpeech,
    getGender,
    isAnimated,
    getPronounType,
    getNumeralType,
    getVerbDetails,
    isPlural,
    isIndeclinable,
    isSingular,
    isCountable,
} from 'utils/wordDetails';
import ExpandSubListIcon from './images/expand-sub-list-icon.svg';

import './ViewerPOSFilterComponent.scss';
import classNames from 'classnames';

const globalFiltersState = {
    noun: {
        masculine: true,
        feminine: true,
        neuter: true,
        masculineOrFeminine: true,

        animated: true,
        inanimate: true,

        countable: true,
        plural: true,
        singular: true,

        indeclinable: true,
        declinable: true,
    },
    pronoun: {
        personal: true,
        demonstrative: true,
        indefinite: true,
        reflexive: true,
        relative: true,
        possessive: true,
        interrogative: true,
        negative: true,
        universal: true,
    },
    verb: {
        intransitive: true,
        transitive: true,
        reflexive: true,

        imperfective: true,
        perfective: true,
        imperfectiveOrPerfective: true,

        main: true,
        auxiliar: true,
    },
    numeral: {
        cardinal: true,
        collective: true,
        fractional: true,
        substantivized: true,
        differential: true,
        multiplicative: true,
        ordinal: true,
    },
    adjective: true,
    adverb: true,
    conjunction: true,
    preposition: true,
    interjection: true,
    particle: true,
    prefix: true,
    suffix: true,
    phrase: true,
};

const splitLineKeys = [
    'noun-animated',
    'noun-countable',
    'noun-indeclinable',

    'verb-imperfective',
    'verb-main',
];

const fixAllFalse = (value: any, group: string[]) => {
    if (group.filter((key) => value[key]).length === 0) {
        group.forEach((key) => {
            value[key] = true;
        });
    }
};

const setFiltersAll = (value: boolean) => Object.keys(globalFiltersState).forEach((key) => {
    if (typeof globalFiltersState[key] === 'boolean') {
        globalFiltersState[key] = value;
    } else {
        Object.keys(globalFiltersState[key]).forEach((subKey) => {
            globalFiltersState[key][subKey] = value;
        });
    }
});

const getAllCheckedLength = () => {
    return Object.keys(globalFiltersState).filter((key) => {
        const value = globalFiltersState[key];
        if (typeof value === 'boolean') {
            return value;
        } else {
            return Object.values(value).filter(Boolean).length !== 0;
        }
    }).length;
};

const getAllCheckedPartLength = () => {
    return Object.keys(globalFiltersState).filter((key) => {
        const value = globalFiltersState[key];
        if (typeof value === 'boolean') {
            return value;
        } else {
            return Object.values(value).filter(Boolean).length === Object.keys(value).length;
        }
    }).length;
};

interface IWordTypes {
    pos: string;
    verbTypes?: string[];
    nounTypes?: any;
    type?: string;
}

const idTypesMap = new Map<string, IWordTypes>();

export function initPOSFilterIdTypesMap(data: string[][]) {
    const header = data.slice(0, 1)[0];
    const idIndex = header.indexOf('id');
    const detailsIndex = header.indexOf('partOfSpeech');

    data.slice(1).forEach((line) => {
        const id = line[idIndex];
        const details = line[detailsIndex];
        const pos = getPartOfSpeech(details);
        const obj: IWordTypes = { pos };

        switch (pos) {
            case 'noun':
                obj.nounTypes = {
                    gender: getGender(details),
                    animated: isAnimated(details),
                    plural: isPlural(details),
                    singular: isSingular(details),
                    countable: isCountable(details),
                    indeclinable: isIndeclinable(details),
                };
                break;
            case 'verb':
                obj.verbTypes = getVerbDetails(details);
                break;
            case 'numeral':
                obj.type = getNumeralType(details);
                break;
            case 'pronoun':
                obj.type = getPronounType(details);
                break;
        }

        idTypesMap.set(id, obj);
    });
}

function getTypesById(id: string) {
    return idTypesMap.get(id);
}

const POSFilterComponentReact = ({ agParams, resetEvent }: { agParams: any, resetEvent: (callback: any) => void }) => {
    const [rerender, setRerender] = useState(false);
    const expandedState = useRef(new Map(Object.keys(globalFiltersState).filter((key) => typeof globalFiltersState[key] !== 'boolean').map((key) => [key, false])));

    const filterResetCallback = useCallback((event) => {
        setFiltersAll(true);
        setRerender((rerender) => !rerender);
    }, []);

    useEffect(() => {
        resetEvent(filterResetCallback);
    }, []);

    useEffect(() => {
        agParams.filterChangedCallback();
    }, [rerender]);

    const allCheckedLength = getAllCheckedLength();
    const allChecked = allCheckedLength !== 0;
    const allPart = Object.keys(globalFiltersState).length !== getAllCheckedPartLength();

    const onChange = useCallback((key: string, subKey?: string) => {
        if (key === 'all') {
            const allCheckedLength = getAllCheckedLength();

            setFiltersAll(allCheckedLength === 0);
            setRerender(!rerender);
            return;
        }
        const value = globalFiltersState[key];

        if (typeof subKey === 'undefined') {
            const hasFilter = typeof value !== 'boolean';
            if (hasFilter) {
                const subKeys = Object.keys(value);
                const newValue = subKeys.filter((subKey) => value[subKey]).length === 0;

                Object.keys(value).forEach((subKey) => {
                    value[subKey] = newValue;
                });
            } else {
                globalFiltersState[key] = !globalFiltersState[key];
            }
        } else {
            value[subKey] = !value[subKey];

            if (key === 'noun') {
                fixAllFalse(value, [
                    'masculine',
                    'feminine',
                    'neuter',
                    'masculineOrFeminine',
                ]);

                fixAllFalse(value, [
                    'inanimate',
                    'animated',
                ]);

                fixAllFalse(value, [
                    'countable',
                    'singular',
                    'plural',
                ]);

                fixAllFalse(value, [
                    'indeclinable',
                    'declinable',
                ]);
            }

            if (key === 'verb') {
                fixAllFalse(value, [
                    'intransitive',
                    'transitive',
                    'reflexive',
                ]);

                fixAllFalse(value, [
                    'imperfective',
                    'perfective',
                    'imperfectiveOrPerfective',
                ]);

                fixAllFalse(value, [
                    'main',
                    'auxiliar',
                ]);
            }
        }

        setRerender(!rerender);
    }, [rerender]);

    const onExpandClick = useCallback((key) => {
        expandedState.current.set(key, !expandedState.current.get(key));
        // console.log(key, expandedState.current.get(key));
        setRerender(!rerender);
    }, [rerender]);

    return (
        <>
            <p className={'bold text-s'}>
                {t('viewerPosFilter')}
            </p>
            <div className={'viewer-pos-filter__list'}>
                <Checkbox
                    key={'all'}
                    title={t('viewerFiltersAll')}
                    checked={allChecked}
                    part={allPart}
                    onChange={() => (onChange('all'))}
                />
                {Object.keys(globalFiltersState).map((key) => {
                    const value = globalFiltersState[key];
                    const subFilter = typeof value !== 'boolean';
                    const subFilterKeys = Object.keys(value);
                    const subFilterValuesLength = Object.values(value).filter(Boolean).length;
                    const checked = subFilter ? subFilterValuesLength !== 0 : value;
                    const part = subFilter && subFilterValuesLength !== subFilterKeys.length;

                    return (
                        <>
                            <div className={'viewer-pos-filter__line'}>
                                <Checkbox
                                    key={key}
                                    title={t(key)}
                                    checked={checked}
                                    part={part}
                                    onChange={() => onChange(key)}
                                />
                                {subFilter && (
                                    <span
                                        className={classNames('viewer-pos-filter__expand-btn', {
                                            expanded: expandedState.current.get(key),
                                        })}
                                        onClick={() => onExpandClick(key)}
                                    >
                                        <ExpandSubListIcon/>
                                    </span>
                                )}
                            </div>
                            {subFilter && (
                                <div
                                    className={classNames('viewer-pos-filter__sub-list', {
                                        expanded: expandedState.current.get(key),
                                    })}
                                >
                                    {Object.keys(value).map((subKey) => (
                                        <>
                                            {splitLineKeys.includes(`${key}-${subKey}`) && <hr/>}
                                            <Checkbox
                                                key={subKey}
                                                title={t(`${key}-${subKey}`)}
                                                checked={value[subKey]}
                                                onChange={() => onChange(key, subKey)}
                                            />
                                        </>
                                    ))}
                                </div>
                            )}
                        </>
                    );
                })}
            </div>
        </>
    );
};

export class ViewerPOSFilterComponent {
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

    public doesFilterPass({ data }) {
        const details = data.partOfSpeech;
        const id = data.id;
        const { pos, nounTypes, verbTypes, type } = getTypesById(id);
        const value: any = globalFiltersState[pos];

        if (typeof pos === 'undefined') {
            return true;
        }

        if (typeof value === 'boolean') {
            return value;
        }

        if (Object.values(value).filter(Boolean).length === 0) {
            return false;
        }

        if (Object.values(value).filter(Boolean).length === Object.keys(value).length) {
            return true;
        }

        switch (pos) {
            case 'noun':
                const {
                    gender,
                    animated,
                    plural,
                    singular,
                    countable,
                    indeclinable,
                } = nounTypes;

                // gender
                if (!value[gender]) {
                    return false;
                }

                // animated
                if (!value.animated && animated) {
                    return false;
                }

                if (!value.inanimate && !animated) {
                    return false;
                }

                // plural
                if (!value.plural && plural) {
                    return false;
                }

                if (!value.singular && singular) {
                    return false;
                }

                if (!value.countable && countable) {
                    return false;
                }

                // indeclinable
                if (!value.indeclinable && indeclinable) {
                    return false;
                }

                if (!value.declinable && !indeclinable) {
                    return false;
                }

                return true;
            case 'verb':
                for (const verbType of verbTypes) {
                    if (!value[verbType]) {
                        return false;
                    }
                }

                return true;
            case 'pronoun':
            case 'numeral':
                return value[type];
        }

        return true;
    }

    public isFilterActive() {
        const allCheckedLength = getAllCheckedLength();
        const allChecked = allCheckedLength !== 0;
        const allPart = Object.keys(globalFiltersState).length !== getAllCheckedPartLength();

        return !allChecked || allPart;
    }

    public setModel(model) {
        if (!model && this.resetCallback) {
            this.resetCallback();
        }
    }

    public getModel() {
        return JSON.stringify(globalFiltersState);
    }

    public getGui() {
        return this.mainElement;
    }

    private resetEvent(callback) {
        this.resetCallback = callback;
    }
}
