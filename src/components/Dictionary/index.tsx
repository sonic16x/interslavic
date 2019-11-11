import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import LangSelector from 'components/LangSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import InputText from 'components/InputText';
import FlavorisationSelector from 'components/FlavorisationSelector';
import Results from 'components/Results';

interface IDictionaryState {
    expand: boolean;
}

class Dictionary extends React.Component<{}, IDictionaryState> {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
        };
    }
    public render() {
        return (
            <div className={'dictionary'}>
                <div className={'controls shadow' + (this.state.expand ? ' expand' : '')}>
                    <LangSelector/>
                    <InputText/>
                    <div className={'expandContainer'}>
                        <SearchTypeSelector/>
                        <FlavorisationSelector/>
                    </div>
                    <button
                        className={'btn expandButton'}
                        onClick={() => this.setState({expand: !this.state.expand})}
                    />
                </div>
                <Results/>
            </div>
        );
    }
}

export default Dictionary;
