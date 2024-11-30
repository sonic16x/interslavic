import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { posFilterAction } from 'actions'

import { usePosFilter } from 'hooks'

import { Selector } from 'components'

import './POSSelector.scss'

const POSList = [
    {
        name: 'anyPartOfSpeech',
        value: '',
    },
    {
        name: 'noun',
        value: 'noun',
    },
    {
        name: 'pronoun',
        value: 'pron',
    },
    {
        name: 'adjective',
        value: 'adj',
    },
    {
        name: 'verb',
        value: 'v',
    },
    {
        name: 'adverb',
        value: 'adv',
    },
    {
        name: 'numeral',
        value: 'num',
    },
    {
        name: 'preposition',
        value: 'prep',
    },
    {
        name: 'conjunction',
        value: 'conj',
    },
    {
        name: 'interjection',
        value: 'intj',
    },
]

export const POSSelector =
    () => {
        const dispatch = useDispatch()
        const posFilter = usePosFilter()
        const options = POSList.map(({ name, value }) => ({
            name: t(name),
            value,
        }))
        const onSelect = useCallback((pos) => {
            dispatch(posFilterAction(pos))
        }, [dispatch])

        return (
            <Selector
                className="pos-selector"
                options={options}
                onSelect={onSelect}
                value={posFilter}
                label={t('partOfSpeech')}
            />
        )
    }
