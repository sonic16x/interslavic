import classNames from 'classnames';
import { t } from 'translations';
import { Dictionary, ITranslateResult } from 'services/dictionary';
import './index.scss';
import { ResultsCard } from 'components/ResultsCard';
import { ResultsEmpty } from 'components/ResultsEmpty';
import { useResults } from 'hooks/useResults';
import { usePosFilter } from 'hooks/usePosFilter';
import { useLang } from 'hooks/useLang';
import { useFromText } from 'hooks/useFromText';
import { useShortCardView } from 'hooks/useShortCardView';
import { useScrollbarWidth } from 'hooks/useScrollbarWidth';
import { isScrollBarVisible } from 'utils/isScrollBarVisible';
import { useRef, useEffect, useState } from 'react';
import { getTablePublicUrl } from 'utils/getTablePublicUrl';
import { tablesData } from 'consts';

export const Results: React.FC =
    () => {
        const worksheetUrl = getTablePublicUrl(tablesData[0].spreadsheetId, tablesData[0].sheetId);
        const results = useResults();
        const posFilter = usePosFilter();
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
                    <ResultsEmpty showReset={posFilter !== ''}/>
                );
            }

            return null;
        }

        const translatedPart = Dictionary.getPercentsOfTranslated()[lang.from === 'isv' ? lang.to : lang.from];

        return (
            <div
                className={classNames('results', {short})}
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
                    <div className={'results__message-for-users'}>
                        {t('notVerifiedText').replace('part%', `${translatedPart}%`)}
                        {` `}
                        <a target={'_blank'} href={worksheetUrl}>{t('notVerifiedTableLinkText')}</a>
                    </div>
                )}
            </div>
        );
    };
