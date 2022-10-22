import classNames from 'classnames';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { fromTextAction, setSearchExpand } from 'actions';

import { useFromText } from 'hooks/useFromText';
import { useLang } from 'hooks/useLang';
import { useSearchExpanded } from 'hooks/useSearchExpanded';
import { useShortCardView } from 'hooks/useShortCardView';
import { toBCP47 } from 'utils/bcp47';

import { Expand } from 'components/Expand';
import { FlavorisationSelector } from 'components/FlavorisationSelector';
import { InputText } from 'components/InputText';
import { LangSelector } from 'components/LangSelector';
import { POSSelector } from 'components/POSSelector';
import { SearchTypeSelector } from 'components/SearchTypeSelector';

import { IntelligibilitySelector } from "../IntelligibilitySelector";

import './Controls.scss';

export const Controls =
    () => {
        const dispatch = useDispatch();
        const expand = useSearchExpanded();
        const short = useShortCardView();

        const lang = useLang();
        const fromText = useFromText();
        const spellCheck = lang.from !== 'isv';
        const searchLanguage = toBCP47(lang.from);

        const onChange = useCallback((value) => {
            dispatch(fromTextAction(value));
        }, [dispatch]);

        const onChangeExpand = useCallback(() => {
            dispatch(setSearchExpand(!expand));
        }, [expand]);

        return (
            <div
                className={classNames('controls', { short })}
            >
                <LangSelector/>
                <InputText
                    size="L"
                    value={fromText}
                    onChange={onChange}
                    placeholder={t('typeWordLabel')}
                    type="search"
                    lang={searchLanguage}
                    autoCapitalize="false"
                    autoComplete={spellCheck ? 'true' : 'false'}
                    autoCorrect={spellCheck ? 'true' : 'false'}
                    spellCheck={spellCheck}
                />
                <Expand
                    isExpanded={expand}
                    onChange={onChangeExpand}
                >
                    <SearchTypeSelector key="searchType" />
                    <FlavorisationSelector key="flavorisation" />
                    <POSSelector key="posFilter" />
                    <IntelligibilitySelector key="intelligibilityFilter" />
                </Expand>
            </div>
        );
    };
