import { setSearchExpand } from 'actions';
import { FlavorisationSelector } from 'components/FlavorisationSelector';
import { InputText } from 'components/InputText';
import { LangSelector } from 'components/LangSelector';
import { POSSelector } from 'components/POSSelector';
import { SearchTypeSelector } from 'components/SearchTypeSelector';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchExpanded } from 'hooks/useSearchExpanded';
import { useShortCardView } from 'hooks/useShortCardView';
import classNames from 'classnames';
import './index.scss';
import ExpandIcon from './images/expand-icon.svg';

export const Controls =
    () => {
        const dispatch = useDispatch();
        const expand = useSearchExpanded();
        const [expanded, setExpanded] = useState<boolean>(expand);
        const short = useShortCardView();

        const onCLick = useCallback(() => {
            dispatch(setSearchExpand(!expanded));
        }, [dispatch, expanded, expanded]);

        return (
            <div
                className={classNames('controls', {expand, short})}
            >
                <LangSelector/>
                <InputText/>
                <div
                    role={'region'}
                    aria-labelledby={'expandControls'}
                    className={classNames('controls__expand-container', {expand})}
                    onTransitionEnd={(e: any) => setExpanded(getComputedStyle(e.target).opacity === '1')}
                >
                    {(expand || expanded) && (
                        <>
                            <SearchTypeSelector key={'searchType'} />
                            <FlavorisationSelector key={'flavorisation'} />
                            <POSSelector key={'posFilter'} />
                        </>
                    )}
                </div>
                <div
                    className={'controls__expand-button-container'}
                    onClick={onCLick}
                >
                    <button
                        id={'expandControls'}
                        type={'button'}
                        aria-label={'Expand search'}
                        aria-expanded={expand}
                        className={'controls__expand-button'}
                        onClick={onCLick}
                    >
                        <ExpandIcon />
                    </button>
                </div>
            </div>
        );
    };
