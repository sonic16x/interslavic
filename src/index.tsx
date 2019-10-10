import * as React from 'react';
import { render } from 'react-dom';
import Main from './components/Main';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mainReducer } from 'reducers';

/* tslint:disable */
declare global {
    const HASH_ID: string;
    const DATE: string;
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
        webvisor: true,
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
