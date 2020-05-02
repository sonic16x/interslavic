import { setSearchExpand } from 'actions';
import { FlavorisationSelector } from 'components/FlavorisationSelector';
import { InputText } from 'components/InputText';
import { LangSelector } from 'components/LangSelector';
import { POSSelector } from 'components/POSSelector';
import SearchTypeSelector from 'components/SearchTypeSelector';
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './index.scss';

interface IControlsPropsInternal {
    searchExpanded: boolean;
    setSearchExpand: (data: boolean) => void;
}

const ControlsInternal: React.FC<IControlsPropsInternal> =
    ({searchExpanded, setSearchExpand}: IControlsPropsInternal) => {
        const [expanded, setExpanded] = React.useState<boolean>(searchExpanded);

        return (
            <div
                className={classNames('controls', {expand: searchExpanded})}
            >
                <LangSelector/>
                <InputText/>
                <div
                    role={'region'}
                    aria-labelledby={'expandControls'}
                    className={classNames('controls__expand-container', {expand: searchExpanded})}
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
                    className={'controls__expand-button-container'}
                    onClick={() => setSearchExpand(!searchExpanded)}
                >
                    <button
                        id={'expandControls'}
                        type={'button'}
                        aria-label={'Expand search'}
                        aria-expanded={searchExpanded}
                        className={'controls__expand-button'}
                        onClick={() => setSearchExpand(!searchExpanded)}
                    />
                </div>
            </div>
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

export const Controls = connect(mapStateToProps, mapDispatchToProps)(ControlsInternal);
