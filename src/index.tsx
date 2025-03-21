import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { setInitialPage } from 'routing'

import { Main } from 'components'

import './index.scss'

import { store } from './store'
import { Workbox } from 'workbox-window'

declare global {
    const __PRODUCTION__: boolean
    const __VERSION__: string
    const __PR_NUMBER__: string
    // eslint-disable-next-line
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

setInitialPage()

if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js')

    wb.register()
}

const root = createRoot(document.getElementById('app'))

root.render(
    <Provider store={store}>
        <Main />
    </Provider>
)
