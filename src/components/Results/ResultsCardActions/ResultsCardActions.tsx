import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { setNotificationAction, showModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { Dictionary, ITranslateResult } from 'services'

import {
    useLang,
} from 'hooks'
import {
    getPartOfSpeech,
    toQueryString,
    wordHasForms,
} from 'utils'

import './ResultsCardActions.scss'

import ErrorIcon from './images/error-icon.svg'
import FormsIcon from './images/forms-icon.svg'
import ShareIcon from './images/share-icon.svg'
import TranslationsIcon from './images/translations-icon.svg'

interface IResultsCardActionsProps {
    item: ITranslateResult;
    short: boolean;
}

export const ResultsCardActions = ({ item, short }: IResultsCardActionsProps) => {
    const pos = getPartOfSpeech(item.details)
    const dispatch = useDispatch()
    const lang = useLang()

    const showTranslations = () => {
        dispatch(showModalDialog({
            type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
            data: { id: item.id },
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
        <div className={cn('results-card-actions', { short })}>
            <button
                className="action-button"
                type="button"
                aria-label={t('shareWord')}
                onClick={shareWord}
            >
                {short ? <ShareIcon/> : t('shareWord')}
            </button>
            <button
                className="action-button"
                type="button"
                aria-label={t('reportWordError')}
                onClick={showWordErrorModal}
            >
                {short ? <ErrorIcon/> : t('reportWordError')}
            </button>
            <button
                className="action-button"
                type="button"
                aria-label={t('translates')}
                onClick={showTranslations}
            >
                {short ? <TranslationsIcon/> : t('translates')}
            </button>
            {wordHasForms(item.original, item.details) && (
                <button
                    className="action-button"
                    type="button"
                    aria-label={t('declensions')}
                    onClick={showDetail}
                >
                    {short ? (
                        <FormsIcon/>
                    ) : (
                        pos === 'verb' ? t('conjugation') : t('declensions')
                    )}
                </button>
            )}
        </div>
    )
}
