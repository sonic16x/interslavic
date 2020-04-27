import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IMainState, mainReducer } from 'reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import { setInitialPage } from 'routing';
import { getPageFromPath } from 'routing';
import { setLang } from 'translations';
import Main from './components/Main';
import './customBootstrap.scss';
import { Dictionary } from './utils/dictionary';
import { analyticsMiddleware } from './middlewares/analyticsMiddleware';

/* tslint:disable */
declare global {
    const HASH_ID: string;
    const DATE: string;
    const BASE_URL: string;
    const ym: (id: number, type: string, params: any) => void;
    interface Window {
        HASH_ID: string;
        dataLayer: any[];
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`./sw.${HASH_ID}.js`)
        .then((registration) => {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch((error) => {
            console.log('Service worker registration failed, error:', error);
        });
}

setInitialPage();

if (process.env.NODE_ENV === 'production') {
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () {
            (m[i].a = m[i].a || []).push(arguments)
        };
        m[i].l = new Date().getTime();
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = true;
        k.src = r;
        a.parentNode.insertBefore(k, a);
    })
    (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(55692481, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
    });
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
    fromText: '',
    searchType: 'begin',
    posFilter: '',
    flavorisationType: '3',
    alphabetType: 'latin',
    page: 'dictionary',
    isLoading: true,
    isDetailModal: false,
    searchExpanded: false,
    rawResults: [],
    results: [],
    alphabets: {
        latin: true,
        cyrillic: true,
        glagolitic: false,
    },
};

function reduxDevTools() {
    if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        return window.__REDUX_DEVTOOLS_EXTENSION__();
    } else {
        return f => f;
    }
}

function localStorageMiddleware({getState}) {
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
        delete stateForSave.isLoading;
        localStorage.setItem('reduxState', JSON.stringify(stateForSave));
        return result;
    };
}

function getInitialState(): IMainState {
    let state = defaultState;
    try {
        const savedState = JSON.parse(localStorage.getItem('reduxState')) || {};
        state = {
            ...defaultState,
            page: getPageFromPath(),
            ...savedState,
        };
    } catch (e) {}

    setLang(state.interfaceLang);
    Dictionary.setIsvSearchLetters(state.isvSearchLetters);

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
