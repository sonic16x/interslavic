import { IAlphabets, IMainState } from '../reducers';
import debounce from 'lodash/debounce';
import { objectSetToString } from './objectSetToString';
import { toQueryString } from './toQueryString';

declare function ga(...args: any[]): void;

interface IAnalyticsDimensions {
    searchValue: string;
    searchLanguageFrom: string;
    searchLanguageTo: string;
    searchLanguage: string;
    searchFilterPos: string;
    searchFilterPart: string;
    interfaceLanguage: string;
    flavorisationType: string;
    alphabets: IAlphabets;
}

export class BiReporter {
    constructor() {
        this.search = debounce(this.search.bind(this), 3000);
        this.emptySearch = debounce(this.emptySearch.bind(this), 600);
    }

    public search(state: IMainState) {
        this._sendEvent('search', `search ${state.lang.from}`, state.fromText);
    }

    public performanceInit(time: number) {
        this._sendEvent('performance', 'performance init', undefined, time);
    }

    public performanceFID(time: number) {
        this._sendEvent('performance', 'performance fid', undefined, time);
    }

    public performanceSearch(time: number) {
        this._sendEvent('performance', 'performance search', undefined, time);
    }

    public emptySearch(state: IMainState) {
        this._sendEvent('search', `empty ${state.lang.from}`, state.fromText);
    }

    public clipboardCard(clipboardContent: string, wordId: string, cardIndex: number, word, lang) {
        ga('set', 'metric1', cardIndex.toString());
        ga('set', 'dimension11', wordId);
        ga('set', 'dimension12', clipboardContent);

        this._sendEvent('clipboard card', `card copy ${lang}`, word);

        ga('set', 'metric1', '-1');
        ga('set', 'dimension11', '');
        ga('set', 'dimension12', '');
    }

    public clipboardModal(clipboardContent: string, wordId: string, cardIndex: number, word, lang) {
        ga('set', 'metric1', cardIndex.toString());
        ga('set', 'dimension11', wordId);
        ga('set', 'dimension12', clipboardContent);

        this._sendEvent('clipboard modal', `modal copy ${lang}`, word);

        ga('set', 'metric1', '-1');
        ga('set', 'dimension11', '');
        ga('set', 'dimension12', '');
    }

    public setDimensions(state: IMainState) {
        this._setGaDimensions({
            searchValue: state.fromText,
            searchLanguageFrom: state.lang.from,
            searchLanguageTo: state.lang.to,
            searchLanguage: state.lang.from === 'isv' ? state.lang.to : state.lang.from,
            searchFilterPos: state.posFilter,
            searchFilterPart: state.searchType,
            interfaceLanguage: state.interfaceLang,
            alphabets: state.alphabets,
            flavorisationType: state.flavorisationType,
        });
    }

    private _setGaDimensions(dimensions: IAnalyticsDimensions) {
        if (typeof ga !== 'function') {
            return;
        }

        const alphabetsString = objectSetToString(dimensions.alphabets);

        ga('set', 'dimension1', dimensions.searchValue);
        ga('set', 'dimension2', dimensions.searchLanguageFrom);
        ga('set', 'dimension3', dimensions.searchLanguageTo);
        ga('set', 'dimension4', dimensions.searchLanguage);
        ga('set', 'dimension5', dimensions.searchFilterPos);
        ga('set', 'dimension6', dimensions.searchFilterPart);
        ga('set', 'dimension7', dimensions.interfaceLanguage);
        ga('set', 'dimension8', alphabetsString);
        ga('set', 'dimension9', dimensions.flavorisationType);

        // NOTE: for Google Analytics ease of filtering (uiLang=isv&fromLang=isv...)
        const complexStateValue = toQueryString({
            uiLang: dimensions.interfaceLanguage,
            alphabets: alphabetsString,
            fromLang: dimensions.searchLanguageFrom,
            toLang: dimensions.searchLanguageTo,
            search: dimensions.searchValue,
            filterPart: dimensions.searchFilterPart,
            flavor: dimensions.flavorisationType,
            filterPos: dimensions.searchFilterPos,
        });

        ga('set', 'dimension10', complexStateValue);
    }

    private _sendEvent(eventCategory: string, eventAction: string, eventLabel: string, eventValue?: number) {
        if (typeof ga !== 'function') {
            return;
        }

        ga('send', {
            hitType: 'event',
            eventCategory,
            eventAction,
            eventLabel,
            eventValue,
        });
    }
}

export default new BiReporter();
