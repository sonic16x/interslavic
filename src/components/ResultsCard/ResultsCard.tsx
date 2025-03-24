import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { showModalDialog } from 'actions'
import { IAlphabets, MODAL_DIALOG_TYPES } from 'reducers'

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

import { Clipboard, Hint, ResultsCardActions } from 'components'

import './ResultsCard.scss'

interface IResultsCardProps {
    item: ITranslateResult;
    short: boolean;
    index: number;
}

interface IResultsCardOriginalProps {
    item: ITranslateResult;
    alphabets: IAlphabets;
    caseQuestions: boolean;
}

const ResultsCardOriginal = ({ item, alphabets, caseQuestions }: IResultsCardOriginalProps) => {
    let latin = item.original
    if (item.add) {
        latin += ` ${item.add}`
    }

    let cyrillic = item.originalCyr
    if (item.addCyr) {
        cyrillic += ` ${item.addCyr}`
    }

    let gla = item.originalGla
    if (item.addGla) {
        gla += ` ${item.addGla}`
    }

    const result = []

    if (alphabets.latin) {
        result.push({
            str: latin,
            caseInfo: caseQuestions && item.caseInfo,
            lang: 'isv-Latin',
        })
    }

    if (alphabets.cyrillic) {
        result.push({
            str: cyrillic,
            caseInfo: item.caseInfoCyr,
            lang: 'isv-Cyrl',
        })
    }

    if (alphabets.glagolitic) {
        result.push({
            str: gla,
            caseInfo: item.caseInfoGla,
            lang: 'isv-Glag',
        })
    }

    return (
        <>
            {result.map(({ str, caseInfo }) => {
                return (
                    <span className="word" key={str}>
                        <Clipboard str={str} />
                        {caseInfo && <span className="caseInfo">({caseInfo})</span>}
                    </span>
                )
            })} 
            {!caseQuestions && item.caseInfo &&
                <span className="caseInfo">(+{t(`case${item.caseInfo.slice(1)}`)})</span>
            }
            {item.ipa && <span className="ipa">[{item.ipa}]</span>}
        </>
    )
}

const WordStatus = ({ item, onClick }: { item: ITranslateResult, onClick: () => void }) => {
    const wordStatus = getWordStatus(item)

    if (wordStatus) {
        return (
            <button
                key="wordStatus"
                onClick={onClick}
                className="results-card__status"
                title={t(wordStatus.text)}
            >
                {wordStatus.icon}
            </button>
        )
    }
}

export const ResultsCard =
    ({ item, short, index }: IResultsCardProps) => {
        const alphabets = useAlphabets()
        const caseQuestions = useCaseQuestions()
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
                <div className="results-card__translate">
                    {item.to !== 'isv' ? (
                        <Clipboard str={item.translate} />
                    ) : (
                        <ResultsCardOriginal item={item} alphabets={alphabets} caseQuestions={caseQuestions}/>
                    )}
                    <WordStatus item={item} onClick={showTranslations}/>
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
                    <div className="results-card__original">
                        {item.to === 'isv' ? (
                            <Clipboard str={item.translate} />
                        ) : (
                            <ResultsCardOriginal item={item} alphabets={alphabets} caseQuestions={caseQuestions}/>
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
