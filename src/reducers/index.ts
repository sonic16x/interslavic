import { translate, ITransalteResult } from 'utils/translator';

import {
    FROM,
    TO,
    SEARCH_TYPE,
    FROM_TEXT,
    FLAVORISATION_TYPE,
    SHOW_INFO,
    IS_LOADING,
} from 'actions';

export interface IMainState {
    from: string;
    to: string;
    fromText: string;
    searchType: string;
    flavorisationType: string;
    showInfo: boolean;
    isLoading: boolean;
    results: ITransalteResult[];
}

const defaultState = {
    from: 'en',
    to: 'isv',
    fromText: '',
    searchType: 'begin',
    flavorisationType: '3',
    showInfo: false,
    isLoading: true,
    results: [],
};

const actionTypeFieldMap = {
    [SEARCH_TYPE]: 'searchType',
    [FROM_TEXT]: 'fromText',
    [FLAVORISATION_TYPE]: 'flavorisationType',
    [SHOW_INFO]: 'showInfo',
    [IS_LOADING]: 'isLoading',
    [FROM]: 'from',
    [TO]: 'to',
};

export function mainReducer(state: IMainState = defaultState, action) {
    const { type, data } = action;
    if (type === FROM_TEXT) {
        const { from, to, flavorisationType, searchType } = state;
        return {
            ...state,
            fromText: data,
            results: data ? translate(data, from, to, searchType, flavorisationType) : [],
        };
    }
    return {
        ...state,
        [actionTypeFieldMap[type]]: data,
    };
}
