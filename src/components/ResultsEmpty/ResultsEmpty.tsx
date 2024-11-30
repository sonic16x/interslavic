import { useDispatch } from 'react-redux'

import { t } from 'translations'

import { posFilterAction } from 'actions'

import './ResultsEmpty.scss'

interface IResultsEmptyProps {
    showReset?: boolean;
}

export const ResultsEmpty =
    ({ showReset }: IResultsEmptyProps) => {
        const dispatch = useDispatch()

        return (
            <div className="results-empty" data-testid="result-empty">
                {t('resultsNotFound')} <span className="results-empty__smile">:(</span>
                <div className="results-empty__filter">
                    {t(showReset ? 'resultsNotFoundMessageFilters' : 'resultsNotFoundMessage')}
                </div>
                {showReset && (
                    <button
                        type="button"
                        className="results-empty__button"
                        aria-label="Reset filters"
                        onClick={() => dispatch(posFilterAction(''))}
                    >
                        {t('resultsNotFoundResetFilters')}
                    </button>
                )}
            </div>
        )
    }
