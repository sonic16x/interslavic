export function localStorageMiddleware({getState}) {
    return (next) => (action) => {
        const result = next(action);
        if (action.type === 'IS_LOADING') {
            return result;
        }
        const stateForSave = {
            ...getState(),
        };
        delete stateForSave.rawResults;
        delete stateForSave.results;
        delete stateForSave.page;
        delete stateForSave.isLoading;
        delete stateForSave.loadingProgress;
        localStorage.setItem('reduxState', JSON.stringify(stateForSave));
        return result;
    };
}
