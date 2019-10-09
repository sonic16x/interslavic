import { translate, ITranslateResult } from 'utils/translator';

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
    results: ITranslateResult[];
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
        case SEARCH_TYPE:
        case FROM_TEXT:
        case FLAVORISATION_TYPE:
            needUpdateResult = true;
        case SHOW_INFO:
        case IS_LOADING:
            newState = {
                ...newState,
                [actionTypeFieldMap[type]]: data,
            };
    }
    if (needUpdateResult) {
        const { fromText, lang, flavorisationType, searchType } = newState;
        const results = fromText ? translate(fromText, lang.from, lang.to, searchType, flavorisationType) : [];
        newState = {
            ...newState,
            results,
        };
    }
    return newState;
}
