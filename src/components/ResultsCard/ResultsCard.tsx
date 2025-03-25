import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { showModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { ITranslateResult } from 'services'

import {
    useAlphabets,
    useCaseQuestions,
} from 'hooks'
import {
    expandAbbr,
    getWordStatus,
    translateAbbr,
} from 'utils'

import { Clipboard, Hint, ResultsCardActions, ResultsCardOriginal } from 'components'

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
        const wordStatus = getWordStatus(item)
        const dispatch = useDispatch()

        const showTranslations = () => {
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
                data: { id: item.id },
            }))
        }

        return (
            <div
                className={classNames('results-card', { short })}
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
                    {wordStatus && (
                        <button
                            key="wordStatus"
                            onClick={showTranslations}
                            className="results-card__status"
                            title={t(wordStatus.text)}
                        >
                            {wordStatus.icon}
                        </button>
                    )}
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
                {!item.checked && (
                    <div className={classNames('results-card__status-badge', { verified: item.checked })}>
                        {!short && (item.checked ? t('verified') : t('autoTranslation'))}
                    </div>
                )}
            </div>
        )
    }
