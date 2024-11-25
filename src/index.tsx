import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { setInitialPage } from 'routing';

import { Main } from 'components/Main';

import './index.scss';

import { store } from './store'

declare global {
    const VERSION: string;
    // eslint-disable-next-line
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

setInitialPage();

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register(`sw.js`, { scope: '.' });
}

const root = createRoot(document.getElementById('app'));

root.render(
    <Provider store={store}>
        <Main />
    </Provider>
);
