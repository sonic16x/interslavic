import React, { lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';

import { setPageAction } from 'actions';

import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { usePage } from 'hooks/usePage';
import { getPageFromPath, getPathFromPage } from 'routing';
import { toBCP47 } from 'utils/bcp47';

import { About } from 'components/About';
import { Dictionary } from 'components/Dictionary';
import { Settings } from 'components/Settings';

import './Router.scss';

const Grammar = lazy(() => import(/* webpackChunkName: "grammarComponent" */'components/Grammar/Grammar'));
const Viewer = lazy(() => import(/* webpackChunkName: "viewerComponent" */'components/Viewer/Viewer'));

function renderPageContent(page) {
    switch (page) {
        case 'grammar':
            return (
                <Suspense fallback={<div>&nbsp;</div>}>
                    <Grammar/>
                </Suspense>
            );
        case 'dictionary':
            return (
                <Dictionary/>
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
        const [prevPage, setPrevPage] = React.useState(page);
        const addClass = page !== prevPage ? 'hide' : 'show';

        const onAnimationEnd = React.useCallback(() => {
            if (page !== prevPage) {
                setPrevPage(page);
            }
        }, [page, prevPage]);

        const onChangeUrl = React.useCallback(() => {
            const currentPage = getPageFromPath();

            if (getPathFromPage(page) !== `${BASE_URL}${currentPage}`) {
                dispatch(setPageAction(currentPage));
            }
        }, [dispatch, page]);

        React.useEffect(() => {
            window.onpopstate = onChangeUrl;
        }, [onChangeUrl]);

        React.useEffect(() => {
            if (typeof document !== 'undefined') {
                document.documentElement.lang = toBCP47(interfaceLang);
            }
        }, [interfaceLang]);

        return (
            <div
                className={`animationContainer ${addClass} ${prevPage}Route`}
                onAnimationEnd={onAnimationEnd}
            >
                {renderPageContent(prevPage)}
            </div>
        );
    };
