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
const appComponent = (
    <Provider store={store}>
        <Main />
    </Provider>
)

if (rootElement.children.length === 0) {
    createRoot(rootElement).render(appComponent)
} else {
    hydrateRoot(rootElement, appComponent)
}
