import { worksheetUrl } from 'consts';
import * as React from 'react';
import { t } from 'translations';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import './index.scss';
import { ResultsCard } from 'components/ResultsCard';
import { ResultsEmpty } from 'components/ResultsEmpty';
import { useResults } from 'hooks/useResults';
import { usePosFilter } from 'hooks/usePosFilter';
import { useLang } from 'hooks/useLang';
import { useFromText } from 'hooks/useFromText';

export const Results: React.FC =
    () => {
        const results = useResults();
        const posFilter = usePosFilter();
        const lang = useLang();
        const fromText = useFromText();
        const empty = results.length === 0 && fromText.length !== 0;

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
            <div className={'results'}>
                {results.map((item: ITranslateResult, index) => (
                    <ResultsCard
                        item={item}
                        key={index}
                        index={index}
                        lang={lang}
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
