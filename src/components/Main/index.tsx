import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import Header from 'components/Header';
import DetailModal from 'components/DetailModal';
import About from 'components/About';
import { Loader } from 'components/Loader';
import Dictionary from 'components/Dictionary';
import GDPR from 'components/GDPR';
const GrammarImport = import(
    /* webpackChunkName: "grammarComponent" */
    'components/Grammar');

const Grammar = lazy(() => GrammarImport);

import './index.scss';
import { dictionaryUrl } from 'consts';
import { fetchDictionary, setPageAction } from 'actions';
import { getPageFromPath, getPathFromPage } from 'routing';

interface IMainProps {
    isLoading: boolean;
    page: string;
    loadDictionary: () => void;
    setPage: (page: string) => void;
}

class Main extends React.Component<IMainProps> {
    constructor(props) {
        super(props);
        this.props.loadDictionary();
        this.onChangeUrl = this.onChangeUrl.bind(this);
        window.onpopstate = this.onChangeUrl;
    }
    public render() {
        return (
            <>
                <GDPR/>
                <Loader title={'Loading dictionary'} isLoading={this.props.isLoading}/>
                <Header/>
                <DetailModal/>
                <About/>
                <Dictionary/>
                <Suspense fallback={<div>Loading...</div>}>
                    <Grammar/>
                </Suspense>
            </>
        );
    }
    private onChangeUrl() {
        const page = getPageFromPath();
        if (getPathFromPage(this.props.page) !== page) {
            this.props.setPage(page);
        }
    }
}

function mapStateToProps({ isLoading, page }) {
    return { isLoading, page };
}

function mapDispatchToProps(dispatch) {
    return {
        loadDictionary: () => fetchDictionary(dictionaryUrl)(dispatch),
        setPage: (page) => dispatch(setPageAction(page)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
