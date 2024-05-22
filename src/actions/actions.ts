import { IModalDialog } from 'reducers';

export enum ActionTypes {
    LANG = 'LANG',
    FROM_TEXT = 'FROM_TEXT',
    SEARCH_TYPE = 'SEARCH_TYPE',
    FLAVORISATION_TYPE = 'FLAVORISATION_TYPE',
    SET_PAGE = 'SET_PAGE',
    SET_INTERFACE_LANG = 'SET_INTERFACE_LANG',
    IS_LOADING = 'IS_LOADING',
    LOADING_PROGRESS = 'LOADING_PROGRESS',
    SET_SEARCH_EXPAND = 'SET_SEARCH_EXPAND',
    ALPHABET_TYPE = 'ALPHABET_TYPE',
    RUN_SEARCH = 'RUN_SEARCH',
    CHANGE_ISV_SEARCH_LETTERS = 'CHANGE_ISV_SEARCH_LETTERS',
    CHANGE_ISV_SEARCH_BY_WORDFORMS = 'CHANGE_ISV_SEARCH_BY_WORDFORMS',
    POS_FILTER = 'POS_FILTER',
    SET_ALPHABETS = 'SET_ALPHABETS',
    SHOW_MODAL_DIALOG = 'SHOW_MODAL_DIALOG',
    HIDE_MODAL_DIALOG = 'HIDE_MODAL_DIALOG',
    SET_NOTIFICATION = 'SET_NOTIFICATION',
    CHANGE_CARD_VIEW = 'CHANGE_CARD_VIEW',
    CHANGE_ORDER_OF_CASES = 'CHANGE_ORDER_OF_CASES',
    CHANGE_CASE_QUESTIONS = 'CHANGE_CASE_QUESTIONS',
    DICTIONARY_LANGUAGES = 'DICTIONARY_LANGUAGES',
    TOGGLE_PAGE = 'TOGGLE_PAGE',
    SET_COMMUNITY_LINKS = 'SET_COMMUNITY_LINKS',
    SET_BADGES = 'SET_BADGES',
    TOGGLE_THEME = 'TOGGLE_THEME',
}

export function langAction(data: {from: string, to: string}) {
    return {
        type: ActionTypes.LANG,
        data,
    };
}

export function showModalDialog(data: IModalDialog) {
    return {
        type: ActionTypes.SHOW_MODAL_DIALOG,
        data,
    };
}

export function hideModalDialog() {
    return {
        type: ActionTypes.HIDE_MODAL_DIALOG,
    };
}

export function setNotificationAction(data) {
    return {
        type: ActionTypes.SET_NOTIFICATION,
        data,
    };
}

export function setAlphabetTypeAction(data: number) {
    return {
        type: ActionTypes.ALPHABET_TYPE,
        data,
    };
}

export function setSearchExpand(data) {
    return {
        type: ActionTypes.SET_SEARCH_EXPAND,
        data,
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

export function changeCardViewAction() {
    return {
        type: ActionTypes.CHANGE_CARD_VIEW,
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

export function loadingProgressAction(data: number) {
    return {
        type: ActionTypes.LOADING_PROGRESS,
        data,
    };
}

export function setInterfaceLang(data: string) {
    return {
        type: ActionTypes.SET_INTERFACE_LANG,
        data,
    };
}

export function changeIsvSearchLetters(data: string) {
    return {
        type: ActionTypes.CHANGE_ISV_SEARCH_LETTERS,
        data,
    };
}

export function changeIsvSearchByWordForms(data: boolean) {
    return {
        type: ActionTypes.CHANGE_ISV_SEARCH_BY_WORDFORMS,
        data,
    };
}

export function posFilterAction(data: string) {
    return {
        type: ActionTypes.POS_FILTER,
        data,
    };
}

export function runSearch() {
    return {
        type: ActionTypes.RUN_SEARCH,
    };
}

export function setAlphabets(data) {
    return {
        type: ActionTypes.SET_ALPHABETS,
        data,
    };
}

export function changeOrderOfCases(data) {
    return {
        type: ActionTypes.CHANGE_ORDER_OF_CASES,
        data,
    };
}

export function changeCaseQuestions(data) {
    return {
        type: ActionTypes.CHANGE_CASE_QUESTIONS,
        data,
    };
}

export function changeDictionaryLangAction(data) {
    return {
        type: ActionTypes.DICTIONARY_LANGUAGES,
        data,
    };
}

export function togglePage(data) {
    return {
        type: ActionTypes.TOGGLE_PAGE,
        data,
    };
}

export function setCommunityLinks(data) {
    return {
        type: ActionTypes.SET_COMMUNITY_LINKS,
        data,
    };
}

export function setBadges(data) {
    return {
        type: ActionTypes.SET_BADGES,
        data,
    };
}

export function toggleThemeAction(data: 'dark' | 'light') {
    return {
        type: ActionTypes.TOGGLE_THEME,
        data,
    }
}
