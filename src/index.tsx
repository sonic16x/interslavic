import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { setInitialPage } from 'routing';

import { Main } from 'components/Main';

import './index.scss';

import { store } from './store'

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


const root = createRoot(document.getElementById('app'));

root.render(
    <Provider store={store}>
        <Main />
    </Provider>
);
