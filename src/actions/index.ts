import { initDictionary } from 'utils/translator';

export enum ActionTypes {
    LANG = 'LANG',
    FROM_TEXT = 'FROM_TEXT',
    SEARCH_TYPE = 'SEARCH_TYPE',
    FLAVORISATION_TYPE = 'FLAVORISATION_TYPE',
    SET_PAGE = 'SET_PAGE',
    IS_LOADING = 'IS_LOADING',
    SHOW_DETAIL= 'SHOW_DETAIL',
}

export function langAction(data: {from: string, to: string}) {
    return {
        type: ActionTypes.LANG,
        data,
    };
}

export function showDetailAction(data: number) {
    return {
        type: ActionTypes.SHOW_DETAIL,
        data,
    };
}

export function hideDetailAction() {
    return {
        type: ActionTypes.SHOW_DETAIL,
        data: undefined,
    };
}

export function fromTextAction(data: string) {
    return {
        type: ActionTypes.FROM_TEXT,
        data,
    };
}

export function searchTypeAction(data: string) {
    return {
        type: ActionTypes.SEARCH_TYPE,
        data,
    };
}

export function flavorisationTypeAction(data: string) {
    return {
        type: ActionTypes.FLAVORISATION_TYPE,
        data,
    };
}

export function setPageAction(data: string) {
    return {
        type: ActionTypes.SET_PAGE,
        data,
    };
}

export function isLoadingAction(data: boolean) {
    return {
        type: ActionTypes.IS_LOADING,
        data,
    };
}

export function fetchDictionary(wordsListUrl) {
    return (dispatch) => {
        return fetch(wordsListUrl)
            .then((res) => res.text())
            .then((data) => {
                const wordList = data.split('\n').map((l) => l.split('\t'));
                dispatch(isLoadingAction(false));
                initDictionary(wordList);
            })
            .catch(() => location.reload(true))
        ;
    };
}
