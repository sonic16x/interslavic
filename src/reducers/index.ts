import { translate, ITranslateResult } from 'utils/translator';
import { ActionTypes } from 'actions';

export const pages = [
    'dictionary',
    'grammar',
    'about',
];

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

export function getPage(): string {
    const path = window.location.pathname.slice(1);
    if (pages.indexOf(path) !== -1) {
        return path;
    }
    return 'dictionary';
}

const defaultState: IMainState = {
    lang: {
        from: 'en',
        to: 'isv',
    },
    fromText: '',
    searchType: 'begin',
    flavorisationType: '3',
    page: getPage(),
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
            window.history.pushState({}, document.title, data);
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
