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

interface IDictionaryPropsInternal {
    searchExpanded: boolean;
    setSearchExpand: (data: boolean) => void;
}

const DictionaryInternal: React.FC<IDictionaryPropsInternal> =
    ({searchExpanded, setSearchExpand}: IDictionaryPropsInternal) => {
        const [expanded, setExpanded] = React.useState<boolean>(searchExpanded);

        return (
            <main className={'dictionary'}>
                <section className={'controls shadow' + (searchExpanded ? ' expand' : '')}>
                    <LangSelector/>
                    <InputText/>
                    <div
                        role={'region'}
                        aria-labelledby={'expandControls'}
                        className={'expandContainer'}
                        onTransitionEnd={(e: any) => setExpanded(getComputedStyle(e.target).opacity === '1')}
                    >
                        {(searchExpanded || expanded) && (
                            <>
                                <SearchTypeSelector key={'searchType'} />
                                <FlavorisationSelector key={'flavorisation'} />
                                <POSSelector key={'posFilter'} />
                            </>
                        )}
                    </div>
                    <div
                        className={'expandButtonContainer'}
                        onClick={() => setSearchExpand(!searchExpanded)}
                    >
                        <button
                            id={'expandControls'}
                            type={'button'}
                            aria-label={'Expand search'}
                            aria-expanded={searchExpanded}
                            className={'btn expandButton'}
                            onClick={() => setSearchExpand(!searchExpanded)}
                        />
                    </div>
                </section>
                <Results/>
            </main>
        );
    };

function mapDispatchToProps(dispatch) {
    return {
        setSearchExpand: (data) => dispatch(setSearchExpand(data)),
    };
}

function mapStateToProps({searchExpanded}) {
    return { searchExpanded };
}

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryInternal);
