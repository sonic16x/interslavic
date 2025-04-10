import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { setInitialPage } from 'routing'

import { Main } from 'components'

import './index.scss'

import { store } from './store'

declare global {
    const __PRODUCTION__: boolean
    const __VERSION__: string
    const __PR_NUMBER__: string
    const __DICTIONARY_UPDATE_TIME: string
    // eslint-disable-next-line
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

setInitialPage()

if (__PRODUCTION__ && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '.' })
}

const root = createRoot(document.getElementById('app'))

root.render(
    <Provider store={store}>
        <Main />
    </Provider>
)
