import * as React from 'react';
import { connect } from 'react-redux';
import Header from 'components/Header';
import InfoPage from 'components/InfoPage';
import LangSelector from 'components/LangSelector';
import { Loader } from 'components/Loader';
import Results from 'components/Results';
import InputText from 'components/InputText';
import FlavorisationSelector from 'components/FlavorisationSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import './index.scss';
import { fetchDictionary } from 'actions';

interface IMainProps {
    isLoading: boolean;
    loadWordsList: (url) => void;
}

const wordsListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwmAFvs2FmTYZfaS6VMe3X0VbvuKCs5F94YbvcyRfD070GZ0eNvYZAZXoPuZyT4s6Wqho2wyVzeeeu/pub?gid=1987833874&single=true&output=tsv';

class Main extends React.Component<IMainProps> {
    constructor(props) {
        super(props);
        this.props.loadWordsList(wordsListUrl);
    }
    public render() {
        return (
            <>
                <Loader title={'Loading dictionary'} isLoading={this.props.isLoading}/>
                <InfoPage/>
                <Header/>
                <div className={'container shadow'}>
                    <LangSelector/>
                    <SearchTypeSelector/>
                    <InputText/>
                    <FlavorisationSelector/>
                </div>
                <Results/>
            </>
        );
    }
}

function mapStateToProps({ isLoading }) {
    return { isLoading };
}

function mapDispatchToProps(dispatch) {
    return {
        loadWordsList: (url) => fetchDictionary(url)(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
