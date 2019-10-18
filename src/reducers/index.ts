import { translate, ITranslateResult } from 'utils/translator';
import { ActionTypes } from 'actions';
import { getPageFromPath, getPathFromPage } from 'routing';

export interface IMainState {
    lang: {
        from: string;
        to: string;
    };
    fromText: string;
    searchType: string;
    flavorisationType: string;
    page: string;
    isLoading: boolean;
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
    page: getPageFromPath(),
    isLoading: true,
    results: [],
};

const actionTypeFieldMap = {
    [ActionTypes.SEARCH_TYPE]: 'searchType',
    [ActionTypes.FROM_TEXT]: 'fromText',
    [ActionTypes.FLAVORISATION_TYPE]: 'flavorisationType',
    [ActionTypes.SET_PAGE]: 'page',
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
        case ActionTypes.SET_PAGE:
        case ActionTypes.IS_LOADING:
            newState = {
                ...newState,
                [actionTypeFieldMap[type]]: data,
            };
    }
    if (ActionTypes.SET_PAGE === type) {
        window.history.pushState({}, document.title, getPathFromPage(data));
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
