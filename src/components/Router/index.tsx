import { About } from 'components/About';
import { Dictionary } from 'components/Dictionary';
import { Settings } from 'components/Settings';
import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { toBCP47 } from 'utils/bcp47';

const Grammar = lazy(() => import(/* webpackChunkName: "grammarComponent" */'components/Grammar'));

import { setPageAction } from 'actions';
import { getPageFromPath, getPathFromPage } from 'routing';
import './index.scss';

interface IRouterProps {
    lang: string;
    isLoading: boolean;
    page: string;
    setPage: (page: string) => void;
}

interface IRouterState {
    prevPage: string;
}

class Router extends React.Component<IRouterProps, IRouterState> {
    constructor(props) {
        super(props);
        this.onChangeUrl = this.onChangeUrl.bind(this);
        window.onpopstate = this.onChangeUrl;
        this.state = {
            prevPage: props.page,
        };
    }
    public componentDidMount() {
      this.updateDocumentLanguage();
    }
    public componentDidUpdate() {
      this.updateDocumentLanguage();
    }
    public render() {
        const { page } = this.props;
        const { prevPage } = this.state;
        const addClass = page !== prevPage ? 'hide' : 'show';
        return (
            <div
                className={`animationContainer ${addClass} ${prevPage}Route`}
                onAnimationEnd={() => {
                    if (page !== prevPage) {
                        this.setState({prevPage: page});
                    }
                }}
            >
                {this.renderContent(prevPage)}
            </div>
        );
    }
    public renderContent(page) {
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
    private onChangeUrl() {
        const page = getPageFromPath();
        if (getPathFromPage(this.props.page) !== page) {
            this.props.setPage(page);
        }
    }
    private updateDocumentLanguage() {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = this.props.lang;
      }
    }
}

function mapStateToProps({ interfaceLang, isLoading, page }) {
    return {
      lang: toBCP47(interfaceLang),
      isLoading,
      page,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPage: (page) => dispatch(setPageAction(page)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
