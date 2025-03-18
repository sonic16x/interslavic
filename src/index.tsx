import { createRoot, hydrateRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { setInitialPage } from 'routing'

import { Main } from 'components'

import './index.scss'

import { store } from './store'

declare global {
    const VERSION: string
    // eslint-disable-next-line
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

setInitialPage()

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '.' })
}

const rootElement = document.getElementById('app')

if (rootElement.children.length === 0) {
    createRoot(rootElement).render(
        <Provider store={store}>
            <Main />
        </Provider>
    )
} else {
    hydrateRoot(
        rootElement,
        <Provider store={store}>
            <Main />
        </Provider>
    )
}
