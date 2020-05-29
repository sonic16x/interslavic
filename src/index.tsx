import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IMainState, mainReducer } from 'reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import { setInitialPage } from 'routing';
import { getPageFromPath } from 'routing';
import { setLang } from 'translations';
import { Main } from 'components/Main';
import './index.scss';
import { Dictionary } from 'services/dictionary';
import { analyticsMiddleware } from 'middlewares/analyticsMiddleware';
import { localStorageMiddleware } from 'middlewares/localStorageMiddleware';

/* tslint:disable */
declare global {
    const HASH_ID: string;
    const VERSION: string;
    const BASE_URL: string;
    const SW: boolean;
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

setInitialPage();

if (SW) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`sw.${HASH_ID}.js`)
            .then((registration) => {
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch((error) => {
                console.log('Service worker registration failed, error:', error);
            });
    }
}

export const defaultState: IMainState = {
    lang: {
        from: 'en',
        to: 'isv',
    },
    interfaceLang: 'en',
    isvSearchLetters: {
        from: [],
        to: [],
    },
    isvSearchByWordForms: true,
    fromText: '',
    searchType: 'begin',
    posFilter: '',
    flavorisationType: '3',
    alphabetType: 'latin',
    page: 'dictionary',
    isLoading: true,
    loadingProgress: 0,
    modalDialog: {
        type: null,
        index: null,
    },
    searchExpanded: false,
    rawResults: [],
    results: [],
    alphabets: {
        latin: true,
        cyrillic: true,
        glagolitic: false,
    },
    favoriteList: {},
};

function reduxDevTools() {
    if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        return window.__REDUX_DEVTOOLS_EXTENSION__();
    } else {
        return f => f;
    }
}

function getInitialState(): IMainState {
    let state = defaultState;
    try {
        const savedState = JSON.parse(localStorage.getItem('reduxState')) || {};

        if (savedState.lang.from !== 'isv' && savedState.lang.to !== 'isv') {
            savedState.lang = {
                from: 'en',
                to: 'isv',
            };
        }

        state = {
            ...defaultState,
            page: getPageFromPath(),
            ...savedState,
        };
    } catch (e) {}

    setLang(state.interfaceLang);
    Dictionary.setIsvSearchLetters(state.isvSearchLetters);
    Dictionary.setIsvSearchByWordForms(state.isvSearchByWordForms);

    return state;
}

const store = createStore(
    mainReducer,
    getInitialState(),
    compose(
        applyMiddleware(
            localStorageMiddleware,
            analyticsMiddleware,
        ),
        reduxDevTools(),
    ),
);

render(
    <Provider store={store}>
        <Main />
    </Provider>,
    document.getElementById('app'),
);
