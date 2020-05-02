import * as React from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { posFilterAction } from 'actions';

interface IResultsEmptyProps {
    showReset?: boolean;
}

export const ResultsEmpty: React.FC<IResultsEmptyProps> =
    ({showReset}: IResultsEmptyProps) => {
        const dispatch = useDispatch();

        return (
            <div className={'results-empty'}>
                {t('resultsNotFound')} <span className={'results-empty__smile'}>:(</span>
                <div className={'results-empty__filter'}>
                    {t(showReset ? 'resultsNotFoundMessageFilters' : 'resultsNotFoundMessage')}
                </div>
                {showReset && (
                    <button
                        type={'button'}
                        className={'results-empty__button'}
                        aria-label={'Reset filters'}
                        onClick={() => dispatch(posFilterAction(''))}
                    >
                        {t('resultsNotFoundResetFilters')}
                    </button>
                )}
            </div>
        );
    };
