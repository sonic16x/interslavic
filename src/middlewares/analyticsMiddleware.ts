import { ActionTypes } from 'actions';
import { biReporter } from 'services/biReporter';
import { IMainState } from 'reducers';

export function analyticsMiddleware({ getState }) {
    return (next) => (action) => {
        const result = next(action);

        switch (action.type) {
            case ActionTypes.FROM_TEXT:
            case ActionTypes.POS_FILTER:
            case ActionTypes.SEARCH_TYPE:
            case ActionTypes.LANG:
                const state: IMainState = getState();
                biReporter.setSearchDimensions(state);

                if (state.fromText) {
                    biReporter.search(state);

                    if (state.results.length === 0) {
                        biReporter.emptySearch(state);
                    }
                }
                break;
        }

        return result;
    };
}
