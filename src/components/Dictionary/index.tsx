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
        const expanded = this.props.searchExpanded;

        return (
            <main className={'dictionary'}>
                <section className={'controls shadow' + (expanded ? ' expand' : '')}>
                    <LangSelector/>
                    <InputText/>
                    <div role={'region'} aria-labelledby={'expandControls'} className={'expandContainer'}>
                        {expanded && <SearchTypeSelector key={'searchType'} />}
                        {expanded && <FlavorisationSelector key={'flavorisation'} />}
                    </div>
                    <button
                        id={'expandControls'}
                        type={'button'}
                        aria-label={'Expand search'}
                        aria-expanded={expanded}
                        className={'btn expandButton'}
                        onClick={() => this.props.setSearchExpand(!expanded)}
                    />
                </section>
                <Results/>
            </main>
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
