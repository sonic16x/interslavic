import * as React from 'react';
import { render } from 'react-dom';
import { Main } from './components/Main';

/* tslint:disable */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js')
        .then((registration) => {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch((error) => {
            console.log('Service worker registration failed, error:', error);
        });
}

declare const ga: (a: string, b: string, c?: string) => void;

if (process.env.NODE_ENV === 'production') {
    ga('create', 'G-B3K87B1ZBD', 'auto');
    ga('send', 'pageview');
}

render(
    <Main />,
    document.getElementById('app'),
);
