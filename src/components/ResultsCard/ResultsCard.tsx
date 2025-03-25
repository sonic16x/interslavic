import cn from 'classnames'

import { t } from 'translations'

import { ITranslateResult } from 'services'

import {
    useAlphabets,
    useCaseQuestions,
} from 'hooks'
import {
    expandAbbr,
    translateAbbr,
} from 'utils'

import {
    Clipboard,
    Hint,
    ResultsCardActions,
    ResultsCardCheckBadge,
    ResultsCardOriginal,
    ResultsCardWordStatus
} from 'components'

import './ResultsCard.scss'

interface IResultsCardProps {
    item: ITranslateResult;
    short: boolean;
    index: number;
}

export const ResultsCard =
    ({ item, short, index }: IResultsCardProps) => {
        const alphabets = useAlphabets()
        const caseQuestions = useCaseQuestions()

        return (
            <div
                className={cn('results-card', { short })}
                tabIndex={index}
                data-testid={`result-${index}`}
            >
                <div className="results-card__text translate">
                    {item.to !== 'isv' ? (
                        <Clipboard str={item.translate} />
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
                        <Hint
                            title={expandAbbr(t, item.details)}
                            shortTitle={translateAbbr(t, item.details)}
                        />
                    )}
                </div>
                {!short && (
                    <Hint
                        title={expandAbbr(t, item.details)}
                        shortTitle={translateAbbr(t, item.details)}
                    />
                )}
                <div className="results-card__bottom">
                    <div className="results-card__text original">
                        {item.to === 'isv' ? (
                            <Clipboard str={item.translate} />
                        ) : (
                            <ResultsCardOriginal
                                item={item}
                                alphabets={alphabets}
                                caseQuestions={caseQuestions}
                                short={short}
                            />
                        )}
                        {item.to !== 'isv' && short && (
                            <Hint
                                title={expandAbbr(t, item.details)}
                                shortTitle={translateAbbr(t, item.details)}
                            />
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
    }
