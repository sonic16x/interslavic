import * as React from 'react';
import { connect } from 'react-redux';
import Header from 'components/Header';
import DetailModal from 'components/DetailModal';
import About from 'components/About';
import { Loader } from 'components/Loader';
import Dictionary from 'components/Dictionary';
import GDPR from 'components/GDPR';
import Grammar from 'components/Grammar';
import './index.scss';
import { fetchDictionary, setPageAction } from 'actions';
import { getPageFromPath, getPathFromPage } from 'routing';

interface IMainProps {
    isLoading: boolean;
    page: string;
    loadDictionary: () => void;
    setPage: (page: string) => void;
}

const dictionaryUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwmAFvs2FmTYZfaS6VMe3X0VbvuKCs5F94YbvcyRfD070GZ0eNvYZAZXoPuZyT4s6Wqho2wyVzeeeu/pub?gid=1987833874&single=true&output=tsv';

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
                <Grammar/>
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
