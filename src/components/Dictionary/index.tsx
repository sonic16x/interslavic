import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import LangSelector from 'components/LangSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import InputText from 'components/InputText';
import FlavorisationSelector from 'components/FlavorisationSelector';
import Results from 'components/Results';

interface IDictionaryProps {
    isVisible: boolean;
}

class Dictionary extends React.Component<IDictionaryProps> {
    public render() {
        return (
            <div className={'dictionary' + (this.props.isVisible ? ' show' : '')}>
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
        isVisible: page === 'dictionary' && !isLoading,
    };
}

export default connect(mapStateToProps)(Dictionary);
