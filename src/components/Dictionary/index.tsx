import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import LangSelector from 'components/LangSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import InputText from 'components/InputText';
import FlavorisationSelector from 'components/FlavorisationSelector';
import Results from 'components/Results';

class Dictionary extends React.Component {
    public render() {
        return (
            <div className={'dictionary'}>
                <div className={'controls shadow'}>
                    <LangSelector/>
                    <SearchTypeSelector/>
                    <InputText/>
                    <FlavorisationSelector/>
                </div>
                <Results/>
            </div>
        );
    }
}

export default Dictionary;
