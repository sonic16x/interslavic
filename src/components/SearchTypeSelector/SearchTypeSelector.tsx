import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { searchTypeAction } from 'actions'

import { useSearchType } from 'hooks'

import { LineSelector } from '../LineSelector'

import './SearchTypeSelector.scss'

const searchTypes = [
    {
        name: 'searchTypeBegin',
        value: 'begin',
    },
    {
        name: 'searchTypeEntire',
        value: 'full',
    },
    // {
    //     name: 'searchTypeEnd',
    //     value: 'end',
    // },
    {
        name: 'searchTypeAny',
        value: 'some',
    },
]

export const SearchTypeSelector =
    () => {
        const dispatch = useDispatch()
        const searchType = useSearchType()
        const onSelect = useCallback((searchType) => {
            dispatch(searchTypeAction(searchType))
        }, [dispatch])
        const options = searchTypes.map((item) => ({
            name: t(item.name),
            value: item.value,
        }))

        return (
            <LineSelector
                className="search-type-selector"
                options={options}
                value={searchType}
                onSelect={onSelect}
            />
        )
    }
