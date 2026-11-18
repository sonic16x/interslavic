import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { showModalDialog } from 'actions'
import { MODAL_DIALOG_TYPES } from 'reducers'

import { ITranslateResult } from 'services'

import { decodeVotes, lemmaScore, shareBand, splitLemmas } from 'utils'
import { getWordStatus } from 'utils/getWordStatus'

import { Tooltip } from 'components/Tooltip'

import './ResultsCardWordStatus.scss'

interface IResultsCardWordStatusProps {
    item: ITranslateResult;
}

/** The card shows a pill after each lemma when the lemmas split cleanly ("uho, uško"). */
export const showsLemmaPills = (item: ITranslateResult) => (
    item.original.split(', ').length === splitLemmas(item.isv).length
)

/** Lucide Bot (ISC): the score stands on machine votes only, as it marks machine translations in the lemma window */
const Bot = () => (
    <svg
        className="results-card-status__bot"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 8V4H8M2 14h2M20 14h2M15 13v2M9 13v2"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
    </svg>
)

/**
 * Intelligibility of one synset member, the same number as in its window (lemmaScore);
 * a bot before the number when only the machine voted, grey "?" when nobody did.
 */
export const LemmaPill = ({ item, index }: { item: ITranslateResult, index: number }) => {
    const dispatch = useDispatch()
    // people's and the machine's answers come with the row: no Levenshtein while typing
    const { percent, people, total } = lemmaScore(decodeVotes(item.intelligibility, index))
    const machineOnly = percent != null && !people
    const title = people
        ? t('intelligibilityPill', { percent: String(percent), people: String(people) })
        : t(machineOnly ? 'intelligibilityMachineVote' : 'intelligibilityNotRated')

    return (
        <Tooltip content={title}>
            <button
                className={cn(
                    'results-card-status',
                    'results-card-status__pill',
                    percent == null ? 'none' : shareBand(total / 100),
                )}
                onClick={() => dispatch(showModalDialog({
                    type: MODAL_DIALOG_TYPES.MODAL_DIALOG_INTELLIGIBILITY,
                    data: { id: item.id, lemma: String(index), tab: 'match' },
                }))}
            >
                {percent == null ? '?' : <>{machineOnly && <Bot/>}{percent}%</>}
            </button>
        </Tooltip>
    )
}

export const ResultsCardWordStatus = ({ item }: IResultsCardWordStatusProps) => {
    const wordStatus = getWordStatus(item)
    const dispatch = useDispatch()
    const showTranslations = () => {
        dispatch(showModalDialog({
            type: MODAL_DIALOG_TYPES.MODAL_DIALOG_INTELLIGIBILITY,
            data: { id: item.id, tab: 'translations' },
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
