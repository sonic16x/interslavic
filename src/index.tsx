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

render(
    <Main />,
    document.getElementById('app'),
);
