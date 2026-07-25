import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { LANGS } from 'consts'

import { t } from 'translations'

import { intelligibilityFilterAction } from 'actions'

import { useDictionaryLanguages, useIntelligibilityFilter } from 'hooks'

import { MultiSelector } from 'components/MultiSelector'

import './IntelligibilitySelector.scss'

export const IntelligibilitySelector =
    () => {
        const dispatch = useDispatch()
        const intelligibilityFilter = useIntelligibilityFilter()
        const dictionaryLanguages = useDictionaryLanguages()
        const options = LANGS
            .filter((lang) => dictionaryLanguages.includes(lang))
            .map((value) => ({
                name: t(`${value}Lang`),
                value,
            }))
        const onSelect = useCallback((langs: string[]) => {
            dispatch(intelligibilityFilterAction(langs))
        }, [dispatch])

        return (
            <MultiSelector
                testId="intelligibility-selector"
                className="intelligibility-selector"
                options={options}
                onSelect={onSelect}
                values={intelligibilityFilter}
                emptyText={t('anyLanguage')}
                label={t('targetLanguages')}
            />
        )
    }
