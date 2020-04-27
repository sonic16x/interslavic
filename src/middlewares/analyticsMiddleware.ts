import { ActionTypes } from '../actions';
import biReporter from '../utils/analytics';

export function analyticsMiddleware({ getState }) {
    return (next) => (action) => {
        const result = next(action);

        switch (action.type) {
            case ActionTypes.FROM_TEXT:
            case ActionTypes.POS_FILTER:
            case ActionTypes.SEARCH_TYPE:
            case ActionTypes.LANG:
                biReporter.search(getState());
                break;
        }

        return result;
    };
}
