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
    loadDictionary: () => void;
}

class Main extends React.Component<IMainProps> {
    constructor(props) {
        super(props);
        this.props.loadDictionary();
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
        loadDictionary: () => fetchDictionary('dictionary.csv')(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
