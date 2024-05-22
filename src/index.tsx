import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import { langs } from 'consts';

import { setLang } from 'translations';

import { IMainState, mainReducer } from 'reducers';

import { Dictionary } from 'services/dictionary';

import { analyticsMiddleware } from 'middlewares/analyticsMiddleware';
import { localStorageMiddleware } from 'middlewares/localStorageMiddleware';
import { urlParamsMiddleware } from 'middlewares/urlParamsMiddleware';
import { setInitialPage } from 'routing';
import { getPageFromPath } from 'routing';
import { getPreferredLanguage } from 'utils/getPreferredLanguage';
import { getPreferredTheme } from "utils/getPreferredTheme";
import { validateLang } from 'utils/validateLang';

import { Main } from 'components/Main';

import './index.scss';

import md5 from 'md5';

declare global {
    const VERSION: string;
    const BASE_URL: string;
    const SW: boolean;
    const CLIENT: boolean;
    // eslint-disable-next-line
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

setInitialPage();

if (SW) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`sw.js`)
            .then((registration) => {
                // eslint-disable-next-line no-console
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('Service worker registration failed, error:', error);
            });
    }
}

export const defaultState: IMainState = {
    lang: {
        from: 'en',
        to: 'isv',
    },
    interfaceLang: getPreferredLanguage(),
    colorTheme: getPreferredTheme(),
    clientId: md5(`${Date.now() * Math.random()}`),
    isvSearchLetters: {
        from: [],
        to: [],
    },
    isvSearchByWordForms: true,
    caseQuestions: true,
    fromText: '',
    searchType: 'begin',
    posFilter: '',
    dictionaryLanguages: langs,
    flavorisationType: '3',
    alphabetType: 'latin',
    page: 'dictionary',
    isLoading: true,
    loadingProgress: 0,
    modalDialog: {
        type: null,
        data: null,
    },
    searchExpanded: false,
    rawResults: [],
    results: [],
    alphabets: {
        latin: true,
        cyrillic: true,
        glagolitic: false,
    },
    orderOfCases: ['nom','acc','gen','loc','dat','ins','voc'],
    enabledPages: [],
    communityLinks: [],
    badges: [],
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

        const urlParams = new URLSearchParams(window.location.search);
        const text = urlParams.get('text');
        const lang = urlParams.get('lang');

        if (validateLang(lang)) {
            const [from, to] = lang.split('-');

            const loadedLangs = ['en', ...savedState.dictionaryLanguages];

            if (loadedLangs.includes(from) || loadedLangs.includes(to)) {
                savedState.lang = {
                    from,
                    to,
                };
            }
        }

        if (text) {
            savedState.fromText = text;
        }

        state = {
            ...defaultState,
            page: getPageFromPath(),
            ...savedState,
        };
    } catch (e) {

    }

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
            urlParamsMiddleware,
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
