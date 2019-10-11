import { translate, ITranslateResult } from 'utils/translator';
import { ActionTypes } from 'actions';

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
    [ActionTypes.SEARCH_TYPE]: 'searchType',
    [ActionTypes.FROM_TEXT]: 'fromText',
    [ActionTypes.FLAVORISATION_TYPE]: 'flavorisationType',
    [ActionTypes.SHOW_INFO]: 'showInfo',
    [ActionTypes.IS_LOADING]: 'isLoading',
    [ActionTypes.LANG]: 'lang',
};

export function mainReducer(state: IMainState = defaultState, { type, data }) {
    let newState = state;
    let needUpdateResult = false;
    switch (type) {
        case ActionTypes.LANG:
        case ActionTypes.SEARCH_TYPE:
        case ActionTypes.FROM_TEXT:
        case ActionTypes.FLAVORISATION_TYPE:
            needUpdateResult = true;
        case ActionTypes.SHOW_INFO:
        case ActionTypes.IS_LOADING:
            newState = {
                ...newState,
                [actionTypeFieldMap[type]]: data,
            };
    }
    if (needUpdateResult) {
        const { fromText, lang, flavorisationType, searchType } = newState;
        const results = translate(fromText, lang.from, lang.to, searchType, flavorisationType);
        newState = {
            ...newState,
            results,
        };
    }
    return newState;
}
