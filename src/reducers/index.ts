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
    isDetailModal: boolean;
    searchExpanded: boolean;
    alphabetType: string;
    detailModal?: number;
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
    alphabetType: 'latin',
    page: getPageFromPath(),
    isLoading: true,
    isDetailModal: false,
    searchExpanded: false,
    rawResults: [],
    results: [],
};

export function mainReducer(state: IMainState = defaultState, { type, data }) {
    switch (type) {
        case ActionTypes.LANG: {
            const { fromText, flavorisationType, searchType } = state;
            const lang = data;
            const rawResults = translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                lang,
                rawResults,
                results: formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.SEARCH_TYPE: {
            const { flavorisationType, lang, fromText } = state;
            const searchType = data;
            const rawResults = translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                searchType,
                rawResults,
                results: formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FROM_TEXT: {
            const { searchType, flavorisationType, lang } = state;
            const fromText = data;
            const rawResults = translate(fromText, lang.from, lang.to, searchType);
            return {
                ...state,
                fromText,
                rawResults,
                results: formatTranslate(rawResults, lang.from, lang.to, flavorisationType),
            };
        }
        case ActionTypes.FLAVORISATION_TYPE:
            const { rawResults, lang} = state;
            return {
                ...state,
                flavorisationType: data,
                results: formatTranslate(rawResults, lang.from, lang.to, data),
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
        case ActionTypes.SET_DETAIL:
            return {
                ...state,
                detailModal: data,
            };
        default:
            return defaultState;
    }
}
