import { About } from 'components/About';
import { Dictionary } from 'components/Dictionary';
import { Settings } from 'components/Settings';
import React, { lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { usePage } from 'hooks/usePage';
import { toBCP47 } from 'utils/bcp47';

const Grammar = lazy(() => import(/* webpackChunkName: "grammarComponent" */'components/Grammar'));

import { setPageAction } from 'actions';
import { getPageFromPath, getPathFromPage } from 'routing';
import './index.scss';
import { useInterfaceLang } from 'hooks/useInterfaceLang';

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

export const Router: React.FC =
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
        }, [onChangeUrl]);

        return (
            <div
                className={`animationContainer ${addClass} ${prevPage}Route`}
                onAnimationEnd={onAnimationEnd}
            >
                {renderPageContent(prevPage)}
            </div>
        );
    };
