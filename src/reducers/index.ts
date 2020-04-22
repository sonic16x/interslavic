import { ActionTypes } from 'actions';
import { defaultState } from 'index';
import { getPathFromPage, goToPage } from 'routing';
import { setLang } from 'translations';
import { Dictionary, ITranslateResult } from 'utils/dictionary';

export interface IMainState {
    lang: {
        from: string;
        to: string;
    };
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
    isDetailModal: boolean;
    searchExpanded: boolean;
    alphabetType: string;
    detailModal?: number;
    rawResults: string[][];
    results: ITranslateResult[];
    alphabets: {
        latin: boolean;
        cyrillic: boolean;
        glagolitic: boolean;
    };
}

export function mainReducer(state: IMainState, { type, data }) {
    switch (type) {
        case ActionTypes.LANG: {
            const { fromText, flavorisationType, searchType, posFilter } = state;
            const lang = data;
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });
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
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });
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
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });
            return {
                ...state,
                fromText,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.RUN_SEARCH: {
            const { searchType, flavorisationType, lang, fromText, posFilter } = state;
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });
            return {
                ...state,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.CHANGE_ISV_SEARCH_LETTERS: {
            const { searchType, flavorisationType, lang, fromText, posFilter} = state;
            const isvSearchLetters = Dictionary.changeIsvSearchLetters(data);
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType,
            });
            return {
                ...state,
                isvSearchLetters,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FLAVORISATION_TYPE: {
            const { searchType, lang, fromText, posFilter } = state;
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                posFilter,
                flavorisationType: data,
            });
            return {
                ...state,
                flavorisationType: data,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, data),
            };
        }
        case ActionTypes.POS_FILTER: {
            const { searchType, lang, fromText, flavorisationType } = state;
            const rawResults = Dictionary.translate({
                inputText: fromText,
                ...lang,
                searchType,
                flavorisationType,
                posFilter: data,
            });
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
        case ActionTypes.IS_LOADING:
            return {
                ...state,
                isLoading: data,
            };
        case ActionTypes.ALPHABET_TYPE:
            return {
                ...state,
                alphabetType: data,
            };
        case ActionTypes.DETAIL_IS_VISIBLE:
            return {
                ...state,
                isDetailModal: data,
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
        case ActionTypes.SET_DETAIL:
            return {
                ...state,
                detailModal: data,
            };
        case ActionTypes.SET_ALPHABETS:
            const alphabets = {
                ...state.alphabets,
                ...data,
            };
            if (!Object.values(alphabets).some(Boolean)) {
                alphabets.latin = true;
            }
            return {
                ...state,
                alphabets,
            };
        default:
            return state;
    }
}
