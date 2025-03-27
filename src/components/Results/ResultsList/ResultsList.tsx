import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { tablesData } from 'consts'

import { t } from 'translations'

import { Dictionary, ITranslateResult } from 'services'

import {
    useAlphabets, useCaseQuestions,
    useFromText,
    useLang, useLoading,
    usePosFilter,
    useResults,
    useScrollbarWidth,
    useShortCardView,
} from 'hooks'
import { getTablePublicUrl, isScrollBarVisible } from 'utils'

import { ResultsCard, ResultsEmpty } from 'components'

import './ResultsList.scss'

export const ResultsList =
    () => {
        const alphabets = useAlphabets()
        const caseQuestions = useCaseQuestions()
        const worksheetUrl = getTablePublicUrl(tablesData[0].spreadsheetId, tablesData[0].sheetId)
        const results = useResults()
        const posFilter = usePosFilter()
        const lang = useLang()
        const containerRef = useRef<HTMLDivElement>()
        const fromText = useFromText()
        const short = useShortCardView()
        const empty = results.length === 0 && fromText.length !== 0
        const scrollWidth = useScrollbarWidth()
        const [scrollIsVisible, setScrollBarVisible] = useState(false)
        const loading = useLoading()

        useEffect(() => {
            setScrollBarVisible(isScrollBarVisible(containerRef))
        }, [containerRef, results.length])

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
                className={classNames('results-list', { short })}
                data-testid="results-list"
                style={{
                    paddingLeft: scrollIsVisible ? scrollWidth : 0,
                }}
                ref={containerRef}
            >
                {results.map((item: ITranslateResult, index) => (
                    <ResultsCard
                        item={item}
                        short={short}
                        key={item.id}
                        index={index}
                        alphabets={alphabets}
                        caseQuestions={caseQuestions}
                    />
                ))}
                {results.some((item) => !item.checked) && (
                    <div className="results-list__message-for-users">
                        {t('notVerifiedText').replace('part%', `${translatedPart}%`)}
                        {' '}
                        <a target="_blank" href={worksheetUrl} rel="noreferrer">{t('notVerifiedTableLinkText')}</a>
                    </div>
                )}
            </div>
        )
    }
