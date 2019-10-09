import { initDictionary } from 'utils/translator';

export const FROM = 'FROM';
export const TO = 'TO';
export const FROM_TEXT = 'FROM_TEXT';
export const SEARCH_TYPE = 'SEARCH_TYPE';
export const FLAVORISATION_TYPE = 'FLAVORISATION_TYPE';
export const SHOW_INFO = 'SHOW_INFO';
export const IS_LOADING = 'IS_LOADING';

export function fromAction(data: string) {
    return {
        type: FROM,
        data,
    };
}

export function toAction(data: string) {
    return {
        type: TO,
        data,
    };
}

export function fromTextAction(data: string) {
    return {
        type: FROM_TEXT,
        data,
    };
}

export function searchTypeAction(data: string) {
    return {
        type: SEARCH_TYPE,
        data,
    };
}

export function flavorisationTypeAction(data: string) {
    return {
        type: FLAVORISATION_TYPE,
        data,
    };
}

export function showInfoAction(data: boolean) {
    return {
        type: SHOW_INFO,
        data,
    };
}

export function isLoadingAction(data: boolean) {
    return {
        type: IS_LOADING,
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
            .catch(() => location.reload())
        ;
    };
}
