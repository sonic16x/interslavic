import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { showModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { ITranslateResult } from 'services'

import { useIntelligibilityFilter } from 'hooks'
import { getWordStatuses, getWordStatusText } from 'utils/getWordStatus'

import './ResultsCardWordStatus.scss'

interface IResultsCardWordStatusProps {
    item: ITranslateResult;
}

export const ResultsCardWordStatus = ({ item }: IResultsCardWordStatusProps) => {
    const targetLangs = useIntelligibilityFilter()
    const wordStatuses = getWordStatuses(item, targetLangs)
    const dispatch = useDispatch()
    const showTranslations = () => {
        dispatch(showModalDialog({
            type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
            data: { id: item.id },
        }))
    }

    return wordStatuses.map((wordStatus) => (
        <button
            key={wordStatus.text}
            onClick={showTranslations}
            className="results-card-status"
            title={getWordStatusText(t, wordStatus)}
        >
            {wordStatus.icon}
        </button>
    ))
}
