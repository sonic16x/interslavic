import { lazy, Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setPageAction } from 'actions'

import { useInterfaceLang, usePage } from 'hooks'
import { getPageFromPath, getPathFromPage } from 'routing'
import { toBCP47 } from 'utils'

import './Router.scss'

const Grammar = lazy(() => import('components/Pages/Grammar/Grammar'))
const Viewer = lazy(() => import('components/Pages/Viewer/Viewer'))
const About = lazy(() => import('components/Pages/About/About'))
const DictionaryPage = lazy(() => import('components/Pages/DictionaryPage/DictionaryPage'))
const Settings = lazy(() => import('components/Pages/Settings/Settings'))

function renderPageContent(page: string) {
    switch (page) {
        case 'grammar':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <Grammar/>
                </Suspense>
            )
        case 'dictionary':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <DictionaryPage/>
                </Suspense>
            )
        case 'viewer':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <Viewer/>
                </Suspense>
            )
        case 'settings':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <Settings/>
                </Suspense>
            )
        case 'about':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <About/>
                </Suspense>
            )

    }
}

export const Router =
    () => {
        const dispatch = useDispatch()
        const interfaceLang = useInterfaceLang()
        const page = usePage()
        const [prevPage, setPrevPage] = useState(page)
        const addClass = page !== prevPage ? 'hide' : 'show'

        const onTransitionEnd = () => {
            if (page !== prevPage) {
                setPrevPage(page)
            }
        }

        const onChangeUrl = () => {
            const currentPage = getPageFromPath()

            if (getPathFromPage(page) !== `/${currentPage}`) {
                dispatch(setPageAction(currentPage))
            }
        }

        useEffect(() => {
            window.onpopstate = onChangeUrl
        }, [onChangeUrl])

        useEffect(() => {
            if (typeof document !== 'undefined') {
                document.documentElement.lang = toBCP47(interfaceLang)
            }
        }, [interfaceLang])

        return (
            <main
                className={`animation-container ${addClass} ${prevPage}Route`}
                onTransitionEnd={onTransitionEnd}
            >
                {renderPageContent(prevPage)}
            </main>
        )
    }
