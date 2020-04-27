import { IMainState } from '../reducers';

declare function ga(...args: any[]): void;

interface IAnalyticsDimensions {
    searchValue: string;
    searchLanguageFrom: string;
    searchLanguageTo: string;
    searchLanguage: string;
    searchFilterPos: string;
    searchFilterPart: string;
}

export class BiReporter {
    public search(state: IMainState) {
        this._setDimensions({
            searchValue: state.fromText,
            searchLanguageFrom: state.lang.from,
            searchLanguageTo: state.lang.to,
            searchLanguage: state.lang.from === 'isv' ? state.lang.to : state.lang.from,
            searchFilterPos: state.posFilter,
            searchFilterPart: state.searchType,
        });

        this._send('search', `search ${state.lang.from}`, state.fromText);
    }

    private _setDimensions(dimensions: IAnalyticsDimensions) {
        if (typeof ga !== 'function') {
            return;
        }

        ga('set', 'dimension1', dimensions.searchValue);
        ga('set', 'dimension2', dimensions.searchLanguageFrom);
        ga('set', 'dimension3', dimensions.searchLanguageTo);
        ga('set', 'dimension4', dimensions.searchLanguage);
        ga('set', 'dimension5', dimensions.searchFilterPos);
        ga('set', 'dimension6', dimensions.searchFilterPart);
    }

    private _send(category: string, action: string, label: string) {
        if (typeof ga !== 'function') {
            return;
        }

        ga('send', 'event', category, action, label);
    }
}

export default new BiReporter();
