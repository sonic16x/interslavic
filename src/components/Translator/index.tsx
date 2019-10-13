import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import LangSelector from 'components/LangSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import InputText from 'components/InputText';
import FlavorisationSelector from 'components/FlavorisationSelector';
import Results from 'components/Results';

interface ITranslatorProps {
    isVisible: boolean;
}

class Translator extends React.Component<ITranslatorProps> {
    public render() {
        return (
            <div className={'translator' + (this.props.isVisible ? ' show' : '')}>
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

function mapStateToProps({page, isLoading}) {
    return {
        isVisible: page === 'translator' && !isLoading,
    };
}

export default connect(mapStateToProps)(Translator);
