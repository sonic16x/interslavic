import { setSearchExpand } from 'actions';
import FlavorisationSelector from 'components/FlavorisationSelector';
import InputText from 'components/InputText';
import LangSelector from 'components/LangSelector';
import POSSelector from 'components/POSSelector';
import Results from 'components/Results';
import SearchTypeSelector from 'components/SearchTypeSelector';
import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';

interface IDictionaryProps {
    searchExpanded: boolean;
    setSearchExpand: (data: boolean) => void;
}

interface IDictionaryState {
    expanded: boolean;
}

class Dictionary extends React.Component<IDictionaryProps, IDictionaryState> {
    constructor(props) {
        super(props);
        this.state = {
            expanded: this.props.searchExpanded,
        };
    }
    public render() {
        const expanded = this.props.searchExpanded;
        return (
            <main className={'dictionary'}>
                <section className={'controls shadow' + (expanded ? ' expand' : '')}>
                    <LangSelector/>
                    <InputText/>
                    <div
                        role={'region'}
                        aria-labelledby={'expandControls'}
                        className={'expandContainer'}
                        onTransitionEnd={(e: any) =>
                            this.setState({expanded: getComputedStyle(e.target).opacity === '1'})}
                    >
                        {(expanded || this.state.expanded) && (
                            <>
                                <SearchTypeSelector key={'searchType'} />
                                <FlavorisationSelector key={'flavorisation'} />
                                <POSSelector key={'posFilter'} />
                            </>
                        )}
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
