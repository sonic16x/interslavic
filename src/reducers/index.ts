import { translate, formatTranslate, ITranslateResult } from 'utils/translator';
import { ActionTypes } from 'actions';
import { getPageFromPath, getPathFromPage, goToPage } from 'routing';

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
    rawResults: string[][];
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
    rawResults: [],
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
    if (type === ActionTypes.SET_PAGE) {
        goToPage(getPathFromPage(data));
    }
    if (type === ActionTypes.FLAVORISATION_TYPE) {
        const { rawResults, lang, flavorisationType} = newState;
        return {
            ...newState,
            results: formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
        };
    }
    if (needUpdateResult) {
        const { fromText, lang, flavorisationType, searchType } = newState;
        const rawResults = translate(fromText, lang.from, lang.to, searchType);
        newState = {
            ...newState,
            rawResults,
            results: formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
        };
    }
    return newState;
}
