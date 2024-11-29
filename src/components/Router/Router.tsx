import { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setPageAction } from 'actions';

import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { usePage } from 'hooks/usePage';
import { getPageFromPath, getPathFromPage } from 'routing';
import { toBCP47 } from 'utils/bcp47';

import { About } from 'components/Pages/About';
import { DictionaryPage } from 'components/Pages/DictionaryPage';
import { Settings } from 'components/Pages/Settings';

import './Router.scss';

const Grammar = lazy(() => import(/* webpackChunkName: "grammarComponent" */'components/Pages/Grammar/Grammar'));
const Viewer = lazy(() => import(/* webpackChunkName: "viewerComponent" */'components/Pages/Viewer/Viewer'));

function renderPageContent(page: string) {
    switch (page) {
        case 'grammar':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <Grammar/>
                </Suspense>
            );
        case 'dictionary':
            return (
                <DictionaryPage/>
            );
        case 'viewer':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <Viewer/>
                </Suspense>
            );
        case 'settings':
            return (
                <Settings/>
            );
        case 'about':
            return (
                <About/>
            );

    }
}

export const Router =
    () => {
        const dispatch = useDispatch();
        const interfaceLang = useInterfaceLang();
        const page = usePage();
        const [prevPage, setPrevPage] = useState(page);
        const addClass = page !== prevPage ? 'hide' : 'show';

        const onTransitionEnd = () => {
            if (page !== prevPage) {
                setPrevPage(page);
            }
        }

        const onChangeUrl = () => {
            const currentPage = getPageFromPath();

            if (getPathFromPage(page) !== `/${currentPage}`) {
                dispatch(setPageAction(currentPage));
            }
        };

        useEffect(() => {
            window.onpopstate = onChangeUrl;
        }, [onChangeUrl]);

        useEffect(() => {
            if (typeof document !== 'undefined') {
                document.documentElement.lang = toBCP47(interfaceLang);
            }
        }, [interfaceLang]);

        return (
            <div
                className={`animation-container ${addClass} ${prevPage}Route`}
                onTransitionEnd={onTransitionEnd}
            >
                {renderPageContent(prevPage)}
            </div>
        );
    };
