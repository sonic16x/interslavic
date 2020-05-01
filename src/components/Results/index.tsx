import { connect } from 'react-redux';
import { worksheetUrl } from 'consts';
import * as React from 'react';
import { t } from 'translations';
import { Dictionary, ITranslateResult } from 'utils/dictionary';
import './index.scss';
import { ResultsCard } from 'components/ResultsCard';
import { ResultsEmpty } from 'components/ResultsEmpty';
import { IMainState, ILang, IAlphabets } from 'reducers';

interface IResultsInternalProps {
    results: ITranslateResult[];
    alphabets: IAlphabets;
    lang: ILang;
    empty: boolean;
    favoriteList: {
        [key: string]: boolean;
    };
}

const ResultsInternal: React.FC<IResultsInternalProps> =
    ({results, lang, alphabets, favoriteList, empty}: IResultsInternalProps) => {
        if (!results || !results.length) {
            if (empty) {
                return (
                    <ResultsEmpty />
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
                        alphabets={alphabets}
                        key={index}
                        index={index}
                        lang={lang}
                        isFavorite={favoriteList[Dictionary.getField(item.raw, 'id').toString()]}
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

function mapStateToProps({results, lang, alphabets, favoriteList, fromText, posFilter}: IMainState) {
    return {
        results,
        lang,
        alphabets,
        favoriteList,
        empty: results.length === 0 && fromText.length !== 0,
    };
}

export const Results = connect(mapStateToProps, null)(ResultsInternal);
