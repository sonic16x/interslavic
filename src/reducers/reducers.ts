import { setLang } from 'translations'

import { ActionTypes } from 'actions'

import { Dictionary, ITranslateResult } from 'services'

import { getPathFromPage, goToPage } from 'routing'

export interface IAlphabets {
    latin: boolean;
    cyrillic: boolean;
    glagolitic: boolean;
}

export interface ILang {
    from: string;
    to: string;
}

export enum MODAL_DIALOG_TYPES {
    MODAL_DIALOG_TRANSLATION = 'MODAL_DIALOG_TRANSLATION',
    MODAL_DIALOG_WORD_FORMS = 'MODAL_DIALOG_WORD_FORMS',
    MODAL_DIALOG_WORD_ERROR = 'MODAL_DIALOG_WORD_ERROR',
}

export interface IModalDialog {
    type: MODAL_DIALOG_TYPES;
    data: any;
    show?: boolean;
}

export interface INotification {
    text: string;
    type?: 'error' | 'valid';
}

export interface IMainState {
    lang: ILang;
    interfaceLang: string;
    clientId: string;
    isShortCardView?: boolean;
    colorTheme: 'dark' | 'light';
    isvSearchLetters: {
        from: string[];
        to: string[]
    };
    isvSearchByWordForms: boolean;
    caseQuestions: boolean;
    displayImperfect: boolean;
    fromText: string;
    searchType: string;
    posFilter: string;
    flavorisationType: string;
    dictionaryLanguages: string[];
    page: string;
    isLoading: boolean;
    loadingProgress: number;
    searchExpanded: boolean;
    alphabetType: string;
    rawResults: string[][];
    results: ITranslateResult[];
    alphabets: IAlphabets;
    notification?: INotification;
    modalDialog: IModalDialog;
    orderOfCases: string[];
    enabledPages: string[];
    badges: string[];
}

export function mainReducer(state: IMainState, { type, data }) {
    switch (type) {
        case ActionTypes.LANG: {
            const { fromText, flavorisationType, searchType, posFilter } = state
            const lang = data
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                lang,
                rawResults,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.SEARCH_TYPE: {
            const { flavorisationType, lang, fromText, posFilter } = state
            const searchType = data
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                searchType,
                rawResults,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.FROM_TEXT: {
            const { searchType, flavorisationType, lang, posFilter } = state
            const fromText = data
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                fromText,
                rawResults,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.RUN_SEARCH: {
            const { searchType, flavorisationType, lang, fromText, posFilter } = state
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                rawResults,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.CHANGE_ISV_SEARCH_LETTERS: {
            const { searchType, flavorisationType, lang, fromText, posFilter } = state
            const isvSearchLetters = Dictionary.changeIsvSearchLetters(data)
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                isvSearchLetters,
                rawResults,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.CHANGE_ISV_SEARCH_BY_WORDFORMS: {
            const { searchType, flavorisationType, lang, fromText, posFilter } = state
            const isvSearchByWordForms = data
            Dictionary.setIsvSearchByWordForms(data)
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                isvSearchByWordForms,
                rawResults,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }

        case ActionTypes.FLAVORISATION_TYPE: {
            const { searchType, lang, fromText, posFilter } = state
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType: data,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                flavorisationType: data,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    data,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.POS_FILTER: {
            const { searchType, lang, fromText, flavorisationType } = state
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                flavorisationType,
                posFilter: data,
            })

            if (__PRODUCTION__) {
                // eslint-disable-next-line no-console
                console.info('TRANSLATE', `${translateTime}ms`)
            }

            return {
                ...state,
                posFilter: data,
                results: Dictionary.formatTranslate(
                    rawResults,
                    lang.from,
                    lang.to,
                    flavorisationType,
                    state.alphabets,
                    state.caseQuestions,
                ),
            }
        }
        case ActionTypes.SET_PAGE:
            goToPage(getPathFromPage(data))

            return {
                ...state,
                page: data,
            }
        case ActionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notification: data,
            }
        case ActionTypes.IS_LOADING:
            return {
                ...state,
                isLoading: data,
            }
        case ActionTypes.LOADING_PROGRESS:
            return {
                ...state,
                loadingProgress: data,
            }
        case ActionTypes.ALPHABET_TYPE:
            return {
                ...state,
                alphabetType: data,
            }
        case ActionTypes.SET_SEARCH_EXPAND:
            return {
                ...state,
                searchExpanded: data,
            }
        case ActionTypes.SET_INTERFACE_LANG:
            setLang(data)

            return {
                ...state,
                interfaceLang: data,
            }
        case ActionTypes.SHOW_MODAL_DIALOG:
            return {
                ...state,
                modalDialog: {
                    ...data,
                    show: true,
                },
            }
        case ActionTypes.CHANGE_CARD_VIEW:
            return {
                ...state,
                isShortCardView: !state.isShortCardView,
            }
        case ActionTypes.TOGGLE_THEME:
            return {
                ...state,
                colorTheme: data,
            }
        case ActionTypes.HIDE_MODAL_DIALOG:
            return {
                ...state,
                modalDialog: {
                    ...state.modalDialog,
                    show: false,
                },
            }
        case ActionTypes.DICTIONARY_LANGUAGES: {
            const { dictionaryLanguages } = state

            return {
                ...state,
                dictionaryLanguages:
                    dictionaryLanguages.includes(data) ?
                        dictionaryLanguages.filter((lang) => (lang !== data)) :
                        [...dictionaryLanguages, data],
            }
        }
        case ActionTypes.SET_ALPHABETS: {
            let alphabetType = state.alphabetType
            const alphabets = {
                ...state.alphabets,
                ...data,
            }

            if (Object.values(alphabets).every((value) => !value)) {
                alphabets.latin = true
            }

            if (!alphabets[state.alphabetType]) {
                alphabetType = Object.keys(alphabets).filter((key) => alphabets[key])[0]
            }

            return {
                ...state,
                alphabets,
                alphabetType,
                results: Dictionary.formatTranslate(
                    state.rawResults,
                    state.lang.from,
                    state.lang.to,
                    state.flavorisationType,
                    alphabets,
                    state.caseQuestions,
                ),
            }
        }

        case ActionTypes.CHANGE_CASE_QUESTIONS: {
            const caseQuestions = data
            
            return {
                ...state,
                caseQuestions,
                results: Dictionary.formatTranslate(
                    state.rawResults,
                    state.lang.from,
                    state.lang.to,
                    state.flavorisationType,
                    state.alphabets,
                    caseQuestions,
                ),
            }
        }
        
        case ActionTypes.CHANGE_ORDER_OF_CASES:
            return {
                ...state,
                orderOfCases: data,
            }

        case ActionTypes.CHANGE_DISPLAY_IMPERFECT: {
            return {
                ...state,
                displayImperfect: data,
            }
        }
            
        case ActionTypes.TOGGLE_PAGE: {
            const { enabledPages } = state

            return {
                ...state,
                enabledPages:
                    enabledPages.includes(data) ?
                        enabledPages.filter((page) => (page !== data)) :
                        [...enabledPages, data],
            }
        }
        case ActionTypes.SET_BADGES: {
            return {
                ...state,
                badges: data,
            }
        }
        default:
            return state
    }
}
