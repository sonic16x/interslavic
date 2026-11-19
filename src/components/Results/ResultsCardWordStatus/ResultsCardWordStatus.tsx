import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { showModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { ITranslateResult } from 'services'

import { getWordStatus } from 'utils/getWordStatus'

import { Tooltip } from 'components/Tooltip'

import './ResultsCardWordStatus.scss'

interface IResultsCardWordStatusProps {
    item: ITranslateResult;
}

export const ResultsCardWordStatus = ({ item }: IResultsCardWordStatusProps) => {
    const wordStatus = getWordStatus(item)
    const dispatch = useDispatch()
    const showTranslations = () => {
        dispatch(showModalDialog({
            type: MODAL_DIALOG_TYPES.MODAL_DIALOG_TRANSLATION,
            data: { id: item.id },
        }))
    }
    
    if (wordStatus) {
        return (
            <Tooltip key="wordStatus" content={t(wordStatus.text)}>
                <button onClick={showTranslations} className="results-card-status" aria-label={t(wordStatus.text)}>
                    {wordStatus.icon}
                </button>
            </Tooltip>
        )
    }
}
