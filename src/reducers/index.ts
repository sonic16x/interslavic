import { translate, ITransalteResult } from 'utils/translator';

import {
    SEARCH_TYPE,
    FROM_TEXT,
    FLAVORISATION_TYPE,
    SHOW_INFO,
    IS_LOADING,
    LANG,
} from 'actions';

export interface IMainState {
    lang: {
        from: string;
        to: string;
    };
    fromText: string;
    searchType: string;
    flavorisationType: string;
    showInfo: boolean;
    isLoading: boolean;
    results: ITransalteResult[];
}

const defaultState = {
    lang: {
        from: 'en',
        to: 'isv',
    },
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
    [LANG]: 'lang',
};

export function mainReducer(state: IMainState = defaultState, action) {
    const { type, data } = action;
    let newState = state;
    let needUpdateResult = false;
    switch (type) {
        case LANG:
            needUpdateResult = true;
        case SEARCH_TYPE:
            needUpdateResult = true;
        case FROM_TEXT:
            needUpdateResult = true;
        case FLAVORISATION_TYPE:
            needUpdateResult = true;
        case SHOW_INFO:
        case IS_LOADING:
            newState = {
                ...newState,
                [actionTypeFieldMap[type]]: data,
            };
        default:
            if (needUpdateResult) {
                const { fromText, lang, flavorisationType, searchType } = newState;
                newState = {
                    ...newState,
                    results: fromText ? translate(fromText, lang.from, lang.to, searchType, flavorisationType) : [],
                };
            }
    }
    return newState;
}
