import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import LangSelector from 'components/LangSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import InputText from 'components/InputText';
import FlavorisationSelector from 'components/FlavorisationSelector';
import Results from 'components/Results';
import { setSearchExpand } from 'actions';

interface IDictionaryProps {
    searchExpanded: boolean;
    setSearchExpand: (data: boolean) => void;
}

class Dictionary extends React.Component<IDictionaryProps> {
    public render() {
        return (
            <div className={'dictionary'}>
                <div className={'controls shadow' + (this.props.searchExpanded ? ' expand' : '')}>
                    <LangSelector/>
                    <InputText/>
                    <div className={'expandContainer'}>
                        <SearchTypeSelector/>
                        <FlavorisationSelector/>
                    </div>
                    <button
                        type={'button'}
                        aria-label={'Expand search'}
                        className={'btn expandButton'}
                        onClick={() => this.props.setSearchExpand(!this.props.searchExpanded)}
                    />
                </div>
                <Results/>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSearchExpand: (data) => dispatch(setSearchExpand(data)),
    };
}

function mapStateToProps({searchExpanded}) {
    return { searchExpanded };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dictionary);
