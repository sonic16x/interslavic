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

declare global {
    interface Window { dataLayer: any[]; }
}

function gtag(...args){
    window.dataLayer.push(...args);
}

if (process.env.NODE_ENV === 'production') {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-B3K87B1ZBD');
    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());

    gtag('config', 'G-B3K87B1ZBD');
}

render(
    <Main />,
    document.getElementById('app'),
);
