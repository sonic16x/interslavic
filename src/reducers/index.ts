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
    page: 'translator' | 'info';
    isLoading: boolean;
    menuIsVisible: boolean;
    results: ITranslateResult[];
}

const defaultState: IMainState = {
    lang: {
        from: 'en',
        to: 'isv',
    },
    fromText: '',
    searchType: 'begin',
    flavorisationType: '3',
    page: 'translator',
    isLoading: true,
    menuIsVisible: false,
    results: [],
};

const actionTypeFieldMap = {
    [ActionTypes.SEARCH_TYPE]: 'searchType',
    [ActionTypes.FROM_TEXT]: 'fromText',
    [ActionTypes.FLAVORISATION_TYPE]: 'flavorisationType',
    [ActionTypes.SET_PAGE]: 'page',
    [ActionTypes.IS_LOADING]: 'isLoading',
    [ActionTypes.TOGGLE_MENU]: 'menuIsVisible',
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
        case ActionTypes.SET_PAGE:
        case ActionTypes.TOGGLE_MENU:
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
