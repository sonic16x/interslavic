import { ActionTypes } from 'actions';
import { getPageFromPath, getPathFromPage, goToPage } from 'routing';
import { Dictionary, ITranslateResult } from 'utils/dictionary';

export interface IMainState {
    lang: {
        from: string;
        to: string;
    };
    interfaceLang: string;
    fromText: string;
    searchType: string;
    flavorisationType: string;
    page: string;
    isLoading: boolean;
    isDetailModal: boolean;
    searchExpanded: boolean;
    alphabetType: string;
    detailModal?: number;
    rawResults: string[][];
    results: ITranslateResult[];
}

export function mainReducer(state: IMainState, { type, data }) {
    switch (type) {
        case ActionTypes.LANG: {
            const { fromText, flavorisationType, searchType } = state;
            const lang = data;
            const rawResults = Dictionary.translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                lang,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.SEARCH_TYPE: {
            const { flavorisationType, lang, fromText } = state;
            const searchType = data;
            const rawResults = Dictionary.translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                searchType,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FROM_TEXT: {
            const { searchType, flavorisationType, lang } = state;
            const fromText = data;
            const rawResults = Dictionary.translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                fromText,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.RUN_SEARCH: {
            const { searchType, flavorisationType, lang, fromText } = state;
            const rawResults = Dictionary.translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                rawResults,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FLAVORISATION_TYPE:
            const { rawResults, lang} = state;
            return {
                ...state,
                flavorisationType: data,
                results: Dictionary.formatTranslate(rawResults, lang.from, lang.to, data),
            };
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
            return {
                ...state,
                interfaceLang: data,
            };
        case ActionTypes.SET_DETAIL:
            return {
                ...state,
                detailModal: data,
            };
        default:
            return state;
    }
}
