import { ActionTypes } from 'actions';
import { getPathFromPage, goToPage } from 'routing';
import { setLang } from 'translations';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import { biReporter } from 'utils/biReporter';

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
}

export interface IModalDialog {
    type: MODAL_DIALOG_TYPES;
    index: number;
    show?: boolean;
}

export interface IMainState {
    lang: ILang;
    interfaceLang: string;
    isvSearchLetters: {
        from: string[];
        to: string[]
    };
    fromText: string;
    searchType: string;
    posFilter: string;
    flavorisationType: string;
    page: string;
    isLoading: boolean;
    loadingProgress: number;
    searchExpanded: boolean;
    alphabetType: string;
    rawResults: string[][];
    results: ITranslateResult[];
    alphabets: IAlphabets;
    notification?: string;
    modalDialog: IModalDialog;
    favoriteList: {
        [key: string]: boolean;
    };
}

export function mainReducer(state: IMainState, { type, data }) {
    switch (type) {
        case ActionTypes.LANG: {
            const { fromText, flavorisationType, searchType, posFilter } = state;
            const lang = data;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                lang,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.SEARCH_TYPE: {
            const { flavorisationType, lang, fromText, posFilter } = state;
            const searchType = data;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                searchType,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FROM_TEXT: {
            const { searchType, flavorisationType, lang, posFilter } = state;
            const fromText = data;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                fromText,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.RUN_SEARCH: {
            const { searchType, flavorisationType, lang, fromText, posFilter } = state;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.CHANGE_ISV_SEARCH_LETTERS: {
            const { searchType, flavorisationType, lang, fromText, posFilter} = state;
            const isvSearchLetters = Dictionary.changeIsvSearchLetters(data);
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                isvSearchLetters,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FLAVORISATION_TYPE: {
            const { searchType, lang, fromText, posFilter } = state;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType: data,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                flavorisationType: data,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, data),
            };
        }
        case ActionTypes.POS_FILTER: {
            const { searchType, lang, fromText, flavorisationType } = state;
            const [rawResults, translateTime] = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                flavorisationType,
                posFilter: data,
            });

            biReporter.performanceSearch(translateTime);

            return {
                ...state,
                posFilter: data,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, data),
            };
        }
        case ActionTypes.SET_PAGE:
            goToPage(getPathFromPage(data));
            return {
                ...state,
                page: data,
            };
        case ActionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notification: data,
            };
        case ActionTypes.IS_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case ActionTypes.LOADING_PROGRESS:
            return {
                ...state,
                loadingProgress: data,
            };
        case ActionTypes.ALPHABET_TYPE:
            return {
                ...state,
                alphabetType: data,
            };
        case ActionTypes.SET_FAVORITE:
            return {
                ...state,
                favoriteList: {
                    ...state.favoriteList,
                    [data]: !state.favoriteList[data],
                },
            };
        case ActionTypes.SET_SEARCH_EXPAND:
            return {
                ...state,
                searchExpanded: data,
            };
        case ActionTypes.SET_INTERFACE_LANG:
            setLang(data);
            return {
                ...state,
                interfaceLang: data,
            };
        case ActionTypes.SHOW_MODAL_DIALOG:
            return {
                ...state,
                modalDialog: {
                    ...data,
                    show: true,
                },
            };
        case ActionTypes.HIDE_MODAL_DIALOG:
            return {
                ...state,
                modalDialog: {
                    ...state.modalDialog,
                    show: false,
                },
            };
        case ActionTypes.SET_ALPHABETS:
            let alphabetType = state.alphabetType;
            const alphabets = {
                ...state.alphabets,
                ...data,
            };
            if (!Object.values(alphabets).some(Boolean)) {
                alphabets.latin = true;
            }
            if (!alphabets[state.alphabetType]) {
                alphabetType = Object.keys(alphabets)[0];
            }
            return {
                ...state,
                alphabets,
                alphabetType,
            };
        default:
            return state;
    }
}
