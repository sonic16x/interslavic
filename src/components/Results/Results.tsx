import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { tablesData } from 'consts';

import { t } from 'translations';

import { Dictionary, ITranslateResult } from 'services/dictionary';

import { useFromText } from 'hooks/useFromText';
import { useLang } from 'hooks/useLang';
import { usePosFilter } from 'hooks/usePosFilter';
import { useResults } from 'hooks/useResults';
import { useScrollbarWidth } from 'hooks/useScrollbarWidth';
import { useShortCardView } from 'hooks/useShortCardView';
import { getTablePublicUrl } from 'utils/getTablePublicUrl';
import { isScrollBarVisible } from 'utils/isScrollBarVisible';

import { ResultsCard } from 'components/ResultsCard';
import { ResultsEmpty } from 'components/ResultsEmpty';

import { useIntelligibilityFilter } from "../../hooks/useIntelligibilityFilter";

import './Results.scss';

export const Results =
    () => {
        const worksheetUrl = getTablePublicUrl(tablesData[0].spreadsheetId, tablesData[0].sheetId);
        const results = useResults();
        const posFilter = usePosFilter();
        const intelligibilityFilter = useIntelligibilityFilter();
        const lang = useLang();
        const containerRef = useRef<HTMLDivElement>();
        const fromText = useFromText();
        const short = useShortCardView();
        const empty = results.length === 0 && fromText.length !== 0;
        const scrollWidth = useScrollbarWidth();
        const [scrollIsVisible, setScrollBarVisible] = useState(false);

        useEffect(() => {
            setScrollBarVisible(isScrollBarVisible(containerRef));
        }, [containerRef, setScrollBarVisible, results.length]);

        if (!results || !results.length) {
            if (empty) {
                return (
                    <ResultsEmpty showReset={posFilter !== '' || intelligibilityFilter !== ''}/>
                );
            }

            return null;
        }

        const translatedPart = Dictionary.getPercentsOfTranslated()[lang.from === 'isv' ? lang.to : lang.from];

        return (
            <div
                className={classNames('results', { short })}
                style={{
                    paddingLeft: scrollIsVisible ? scrollWidth : 0,
                }}
                ref={containerRef}
            >
                {results.map((item: ITranslateResult, index) => (
                    <ResultsCard
                        item={item}
                        key={index}
                        index={index}
                    />
                ))}
                {results.some((item) => !item.checked) && (
                    <div className="results__message-for-users">
                        {t('notVerifiedText').replace('part%', `${translatedPart}%`)}
                        {` `}
                        <a target="_blank" href={worksheetUrl} rel="noreferrer">{t('notVerifiedTableLinkText')}</a>
                    </div>
                )}
            </div>
        );
    };
