import cn from 'classnames'

import { IAlphabets } from 'reducers'

import { ITranslateResult } from 'services'

import {
    Clipboard,
    ResultsCardActions,
    ResultsCardCheckBadge,
    ResultsCardOriginal,
    ResultsCardPos,
    ResultsCardWordStatus
} from 'components'

import './ResultsCard.scss'

interface IResultsCardProps {
    item: ITranslateResult;
    alphabets: IAlphabets;
    caseQuestions: boolean;
    short: boolean;
    index: number;
}

export const ResultsCard =
    ({ item, alphabets, caseQuestions, short, index }: IResultsCardProps) => (
        <div
            className={cn('results-card', { short })}
            tabIndex={index}
            data-testid={`result-${index}`}
        >
            <div className="results-card__text translate">
                {item.to !== 'isv' ? (
                    <Clipboard str={item.translate} lang={item.to} />
                ) : (
                    <ResultsCardOriginal
                        item={item}
                        alphabets={alphabets}
                        caseQuestions={caseQuestions}
                        short={short}
                    />
                )}
                <ResultsCardWordStatus item={item} />
                {item.to === 'isv' && short && (
                    <ResultsCardPos details={item.details} />
                )}
            </div>
            {!short && (
                <ResultsCardPos details={item.details} />
            )}
            <div className="results-card__bottom">
                <div className="results-card__text original">
                    {item.to === 'isv' ? (
                        <Clipboard str={item.translate} lang={item.from} />
                    ) : (
                        <ResultsCardOriginal
                            item={item}
                            alphabets={alphabets}
                            caseQuestions={caseQuestions}
                            short={short}
                        />
                    )}
                    {item.to !== 'isv' && short && (
                        <ResultsCardPos details={item.details} />
                    )}
                </div>
                <ResultsCardActions
                    item={item}
                    short={short}
                />
            </div>
            <ResultsCardCheckBadge item={item} short={short}/>
        </div>
    )
