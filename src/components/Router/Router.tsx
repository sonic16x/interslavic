import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setPageAction } from 'actions'

import { useInterfaceLang, useLoading, usePage } from 'hooks'
import { getPageFromPath, getPathFromPage } from 'routing'
import { toBCP47 } from 'utils'

import { Spinner } from 'components'

import './Router.scss'

const Grammar = lazy(() => import('components/Pages/Grammar'))
const Viewer = lazy(() => import('components/Pages/Viewer'))
const About = lazy(() => import('components/Pages/About'))
const DictionaryPage = lazy(() => import('components/Pages/DictionaryPage'))
const Settings = lazy(() => import('components/Pages/Settings'))
const TranslatorPage = lazy(() => import('components/Pages/TranslatorPage'))

const PageLoader = () => {
    const loading = useRef(useLoading())

    if (loading.current) {
        return
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Spinner size="4em" borderWidth="0.3em" />
        </div>
    )
}

function renderPageContent(page: string) {
    switch (page) {
        case 'grammar':
            return (
                <Suspense fallback={<PageLoader />}>
                    <Grammar/>
                </Suspense>
            )
        case 'dictionary':
            return (
                <Suspense fallback={<PageLoader />}>
                    <DictionaryPage/>
                </Suspense>
            )
        case 'translator':
            return (
                <Suspense fallback={<PageLoader />}>
                    <TranslatorPage/>
                </Suspense>
            )
        case 'viewer':
            return (
                <Suspense fallback={<PageLoader />}>
                    <Viewer/>
                </Suspense>
            )
        case 'settings':
            return (
                <Suspense fallback={<PageLoader />}>
                    <Settings/>
                </Suspense>
            )
        case 'about':
            return (
                <Suspense fallback={<PageLoader />}>
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
