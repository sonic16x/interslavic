import { toQueryString } from 'utils/toQueryString';

export function urlParamsMiddleware({ getState }) {
    return (next) => (action) => {
        const result = next(action);

        if (action.type === 'IS_LOADING') {
            return result;
        }

        const { fromText, lang } = getState();
        const query = toQueryString({
            text: fromText,
            lang: `${lang.from}-${lang.to}`,
        })

        const { protocol, host, pathname } = window.location;
        const path = `${protocol}//${host}${pathname}?${query}`;
        window.history.pushState({ path },'', path);

        return result;
    };
}
