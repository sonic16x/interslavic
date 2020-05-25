import { IMainState } from '../reducers';
import debounce from 'lodash/debounce';
import { objectSetToString } from './objectSetToString';
import { toQueryString } from './toQueryString';

declare function ga(...args: any[]): void;

export interface ICardAnalytics {
    index: number;
    wordId: string;
    isv: string;
    checked: boolean;
}

export interface IClipboardAnalytics extends ICardAnalytics {
    content: string;
    lang: string;
}

export class BiReporter {
    // tslint:disable-next-line:no-empty
    private ga = typeof ga === 'function' ? ga : () => {};
    private shownCards = new Set<string>();

    constructor() {
        this.search = debounce(this.search.bind(this), 3000);
        this.emptySearch = debounce(this.emptySearch.bind(this), 600);
    }

    public search(state: IMainState) {
        this._sendEvent('search', `search ${state.lang.from}`, state.fromText);
    }

    public emptySearch(state: IMainState) {
        this._sendEvent('search', `empty ${state.lang.from}`, state.fromText);
    }

    public showCard(card: ICardAnalytics) {
        if (this.shownCards.has(card.wordId)) {
            return;
        }

        this._setCardDimensions(card);
        this._sendEvent('card', `show card`, card.isv);
        if (!card.checked) {
            this._sendEvent('card', `show autotranslate`, card.isv);
        }
        this._setCardDimensions(null);
        this.shownCards.add(card.wordId);
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

    public cardInteraction(action: string, details: ICardAnalytics) {
        this._setCardDimensions(details);
        this._sendEvent('card', action, details.isv);
        this._setCardDimensions(null);
    }

    public clipboardCard(details: IClipboardAnalytics) {
        this._setClipboardDimensions(details);
        this._sendEvent('clipboard card', `card copy ${details.lang}`, details.isv);
        this._setClipboardDimensions(null);
    }

    public clipboardModal(details: IClipboardAnalytics) {
        this._setClipboardDimensions(details);
        this._sendEvent('clipboard modal', `modal copy ${details.lang}`, details.isv);
        this._setClipboardDimensions(null);
    }

    public setSearchDimensions(state: IMainState) {
        const dimensions = {
            searchValue: state.fromText,
            searchLanguageFrom: state.lang.from,
            searchLanguageTo: state.lang.to,
            searchLanguage: state.lang.from === 'isv' ? state.lang.to : state.lang.from,
            searchFilterPos: state.posFilter,
            searchFilterPart: state.searchType,
            searchByWordForms: state.isvSearchByWordForms,
            interfaceLanguage: state.interfaceLang,
            alphabets: objectSetToString(state.alphabets),
            flavorisationType: state.flavorisationType,
            isShortView: state.isShortCardView,
        };

        this._setCustomDimensions({
            ...dimensions,

            // NOTE: for Google Analytics ease of filtering (uiLang=isv&fromLang=isv...)
            appState: toQueryString({
                uiLang: dimensions.interfaceLanguage,
                alphabets: dimensions.alphabets,
                fromLang: dimensions.searchLanguageFrom,
                toLang: dimensions.searchLanguageTo,
                search: dimensions.searchValue,
                filterPart: dimensions.searchFilterPart,
                flavor: dimensions.flavorisationType,
                filterPos: dimensions.searchFilterPos,
                wordForms: dimensions.searchByWordForms ? 1 : 0,
                shortView: dimensions.isShortView ? 1 : 0,
            }),
        });
    }

    private _setCardDimensions(card: ICardAnalytics | null) {
        this._setCustomDimensions({
            wordId: card ? card.wordId : '',
            cardIndex: card ? card.index : -1,
        });
    }

    private _setClipboardDimensions(clipboard: IClipboardAnalytics | null) {
        this._setCustomDimensions({
            wordId: clipboard ? clipboard.wordId : '',
            cardIndex: clipboard ? clipboard.index : -1,
            clipboardContent: clipboard ? clipboard.content : '',
        });
    }

    private _setCustomDimensions(dimensions: Partial<ICustomAnalytics>) {
        if (dimensions.searchValue !== undefined) {
            this.ga('set', 'dimension1', dimensions.searchValue);
        }

        if (dimensions.searchLanguageFrom !== undefined) {
            this.ga('set', 'dimension2', dimensions.searchLanguageFrom);
        }

        if (dimensions.searchLanguageTo !== undefined) {
            this.ga('set', 'dimension3', dimensions.searchLanguageTo);
        }

        if (dimensions.searchLanguage !== undefined) {
            this.ga('set', 'dimension4', dimensions.searchLanguage);
        }

        if (dimensions.searchFilterPos !== undefined) {
            this.ga('set', 'dimension5', dimensions.searchFilterPos);
        }

        if (dimensions.searchFilterPart !== undefined) {
            this.ga('set', 'dimension6', dimensions.searchFilterPart);
        }

        if (dimensions.interfaceLanguage !== undefined) {
            this.ga('set', 'dimension7', dimensions.interfaceLanguage);
        }

        if (dimensions.alphabets !== undefined) {
            this.ga('set', 'dimension8', dimensions.alphabets);
        }

        if (dimensions.flavorisationType !== undefined) {
            this.ga('set', 'dimension9', dimensions.flavorisationType);
        }

        if (dimensions.appState !== undefined) {
            this.ga('set', 'dimension10', dimensions.appState);
        }

        if (dimensions.wordId !== undefined) {
            this.ga('set', 'dimension11', dimensions.wordId);
        }

        if (dimensions.clipboardContent !== undefined) {
            this.ga('set', 'dimension12', dimensions.clipboardContent);
        }

        if (dimensions.cardIndex !== undefined) {
            this.ga('set', 'metric1', dimensions.cardIndex);
        }

        if (dimensions.searchByWordForms !== undefined) {
            this.ga('set', 'metric2', dimensions.searchByWordForms ? 1 : 0);
        }

        if (dimensions.isShortView !== undefined) {
            this.ga('set', 'metric3', dimensions.isShortView ? 1 : 0);
        }
    }

    private _sendEvent(eventCategory: string, eventAction: string, eventLabel: string, eventValue?: number) {
        this.ga('send', {
            hitType: 'event',
            eventCategory,
            eventAction,
            eventLabel,
            eventValue,
        });
    }
}

interface ICustomAnalytics {
    searchValue: string;
    searchLanguageFrom: string;
    searchLanguageTo: string;
    searchLanguage: string;
    searchFilterPos: string;
    searchFilterPart: string;
    searchByWordForms: boolean;
    interfaceLanguage: string;
    flavorisationType: string;
    isShortView: boolean;
    alphabets: string;
    appState: string;
    wordId: string;
    clipboardContent: string;
    cardIndex: number;
}

export const biReporter = new BiReporter();
