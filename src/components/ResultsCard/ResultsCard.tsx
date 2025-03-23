import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { setNotificationAction, showModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { Dictionary, ITranslateResult } from 'services'

import {
    useAlphabets,
    useCaseQuestions,
    useLang,
} from 'hooks'
import {
    expandAbbr,
    getPartOfSpeech,
    getWordStatus,
    toQueryString,
    translateAbbr,
    wordHasForms,
} from 'utils'

import { Clipboard, Hint } from 'components'

import './ResultsCard.scss'

import ErrorIcon from './images/error-icon.svg'
import FormsIcon from './images/forms-icon.svg'
import ShareIcon from './images/share-icon.svg'
import TranslationsIcon from './images/translations-icon.svg'

interface IResultsCardProps {
    item: ITranslateResult;
    short: boolean;
    index: number;
}

function renderOriginal(item, alphabets, caseQuestions) {
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
        const pos = getPartOfSpeech(item.details)
        const dispatch = useDispatch()
        const lang = useLang()

        const showTranslations = () => {
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
                data: { index },
            }))
        }

        const showWordErrorModal = () => {
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_ERROR,
                data: {
                    wordId: item.id,
                    isvWord: item.original,
                    translatedWord: item.translate,
                },
            }))
        }

        const showDetail = () => {
            dispatch(showModalDialog({
                type: MODAL_DIALOG_TYPES.MODAL_DIALOG_WORD_FORMS,
                data: {
                    word: item.isv,
                    add: Dictionary.getField(item.raw, 'addition'),
                    details: Dictionary.getField(item.raw, 'partOfSpeech'),
                },
            }))
        }

        const shareWord = () => {
            const { origin, pathname } = window.location
            const query = toQueryString({
                text: `id${item.id}`,
                lang: `${lang.from}-${lang.to}`,
            })

            const url = `${origin}${pathname}?${query}`

            if (navigator.share) {
                navigator.share({
                    url,
                })
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    const notificationText = t('wordLinkCopied', {
                        str: url,
                    })
                    dispatch(setNotificationAction({ text: notificationText }))
                })
            }
        }

        return (
            <div
                className={classNames('results-card', { short })}
                tabIndex={0}
                data-testid={`result-${index}`}
            >
                <div className="results-card__translate">
                    {item.to !== 'isv' ? (
                        <Clipboard str={item.translate} />
                    ) : renderOriginal(item, alphabets, caseQuestions)}
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
                        ) : renderOriginal(item, alphabets, caseQuestions)}
                        {item.to !== 'isv' && short && (
                            <Hint
                                title={expandAbbr(t, item.details)}
                                shortTitle={translateAbbr(t, item.details)}
                            />
                        )}
                    </div>
                    <div className="results-card__actions">
                        <button
                            className="results-card__action-button"
                            type="button"
                            aria-label={t('shareWord')}
                            onClick={shareWord}
                        >
                            {short ? <ShareIcon /> : t('shareWord')}
                        </button>
                        <button
                            className="results-card__action-button"
                            type="button"
                            aria-label={t('reportWordError')}
                            onClick={showWordErrorModal}
                        >
                            {short ? <ErrorIcon /> : t('reportWordError')}
                        </button>
                        <button
                            className="results-card__action-button"
                            type="button"
                            aria-label={t('translates')}
                            onClick={showTranslations}
                        >
                            {short ? <TranslationsIcon /> : t('translates')}
                        </button>
                        {wordHasForms(item.original, item.details) && (
                            <button
                                className="results-card__action-button"
                                type="button"
                                aria-label={t('declensions')}
                                onClick={showDetail}
                            >
                                {short ? (
                                    <FormsIcon />
                                ) : (
                                    pos === 'verb' ? t('conjugation') : t('declensions')
                                )}
                            </button>
                        )}
                    </div>
                </div>
                {!item.checked && (
                    <div className={classNames('results-card__status-badge', { verified: item.checked })}>
                        {!short && (item.checked ? t('verified') : t('autoTranslation'))}
                    </div>
                )}
            </div>
        )
    }
