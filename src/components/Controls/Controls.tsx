import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { fromTextAction, setSearchExpand } from 'actions';

import { useFromText } from 'hooks/useFromText';
import { useLang } from 'hooks/useLang';
import { useSearchExpanded } from 'hooks/useSearchExpanded';
import { useShortCardView } from 'hooks/useShortCardView';
import { toBCP47 } from 'utils/bcp47';

import { FlavorisationSelector } from 'components/FlavorisationSelector';
import { InputText } from 'components/InputText';
import { LangSelector } from 'components/LangSelector';
import { POSSelector } from 'components/POSSelector';
import { SearchTypeSelector } from 'components/SearchTypeSelector';

import './Controls.scss';

import ExpandIcon from './images/expand-icon.svg';

export const Controls =
    () => {
        const dispatch = useDispatch();
        const expand = useSearchExpanded();
        const [expanded, setExpanded] = useState<boolean>(expand);
        const short = useShortCardView();

        const lang = useLang();
        const fromText = useFromText();
        const spellCheck = lang.from !== 'isv';
        const searchLanguage = toBCP47(lang.from);

        const onChange = useCallback((value) => {
            dispatch(fromTextAction(value));
        }, [dispatch]);

        const onCLick = () => {
            dispatch(setSearchExpand(!expanded));
        };

        return (
            <div
                className={classNames('controls', { expand, short })}
            >
                <LangSelector/>
                <InputText
                    size="L"
                    value={fromText}
                    onChange={onChange}
                    placeholder={t('typeWordLabel')}
                    type="search"
                    lang={searchLanguage}
                    autoCapitalize="off"
                    autoComplete={spellCheck ? 'on' : 'off'}
                    autoCorrect={spellCheck ? 'on' : 'off'}
                    spellCheck={spellCheck}
                />
                <div
                    role="region"
                    aria-labelledby="expandControls"
                    className={classNames('controls__expand-container', { expand })}
                    onTransitionEnd={(e: any) => setExpanded(getComputedStyle(e.target).opacity === '1')}
                >
                    {(expand || expanded) && (
                        <>
                            <SearchTypeSelector key="searchType" />
                            <FlavorisationSelector key="flavorisation" />
                            <POSSelector key="posFilter" />
                        </>
                    )}
                </div>
                <div
                    className="controls__expand-button-container"
                    onClick={onCLick}
                >
                    <button
                        id="expandControls"
                        type="button"
                        aria-label="Expand search"
                        aria-expanded={expand}
                        className="controls__expand-button"
                        onClick={onCLick}
                    >
                        <ExpandIcon />
                    </button>
                </div>
            </div>
        );
    };
