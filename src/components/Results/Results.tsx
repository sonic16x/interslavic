import classNames from 'classnames'
import { useRef } from 'react'

import { tablesData } from 'consts'

import { t } from 'translations'

import { Dictionary, ITranslateResult } from 'services'

import {
    useFromText,
    useLang, useLoading,
    usePosFilter,
    useResults,
    useShortCardView,
} from 'hooks'
import { getTablePublicUrl } from 'utils'

import { ResultsCard, ResultsEmpty } from 'components'

import './Results.scss'

import { useResultsStyles } from './useResultsStyles'

export const Results =
    () => {
        const worksheetUrl = getTablePublicUrl(tablesData[0].spreadsheetId, tablesData[0].sheetId)
        const results = useResults()
        const posFilter = usePosFilter()
        const lang = useLang()
        const containerRef = useRef<HTMLDivElement>()
        const fromText = useFromText()
        const short = useShortCardView()
        const empty = results.length === 0 && fromText.length !== 0
        const loading = useLoading()
        const resultsStyles = useResultsStyles({
            containerRef,
            resultsCount: results.length,
            short,
        })

        if (!results || !results.length) {
            if (empty && !loading) {
                return (
                    <ResultsEmpty showReset={posFilter !== ''}/>
                )
            }

            return null
        }

        const translatedPart = Dictionary.getPercentsOfTranslated()[lang.from === 'isv' ? lang.to : lang.from]

        return (
            <div
                className={classNames('results', { short })}
                data-testid="results"
                style={resultsStyles}
                ref={containerRef}
            >
                {results.map((item: ITranslateResult, index) => (
                    <ResultsCard
                        item={item}
                        short={short}
                        key={item.id}
                        index={index}
                    />
                ))}
                {results.some((item) => !item.checked) && (
                    <div className="results__message-for-users">
                        {t('notVerifiedText').replace('part%', `${translatedPart}%`)}
                        {' '}
                        <a target="_blank" href={worksheetUrl} rel="noreferrer">{t('notVerifiedTableLinkText')}</a>
                    </div>
                )}
            </div>
        )
    }
