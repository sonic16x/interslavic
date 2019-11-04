import * as React from 'react';
import { render } from 'react-dom';
import Main from './components/Main';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mainReducer } from 'reducers';
import { setInitialPage } from 'routing';

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

function reduxDevTools() {
    if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        return window.__REDUX_DEVTOOLS_EXTENSION__();
    }
}

const store = createStore(mainReducer, reduxDevTools());

render(
    <Provider store={store}>
        <Main />
    </Provider>,
    document.getElementById('app'),
);
