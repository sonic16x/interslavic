import * as React from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './index.scss';
import { posFilterAction } from 'actions';

export const ResultsEmpty: React.FC =
    () => {
        const dispatch = useDispatch();

        return (
            <div className={'results-empty'}>
                {t('resultsNotFound')} :(
                <div className={'results-empty__filter'}>
                    {t('resultsNotFoundFilters')}
                </div>
                <button
                    type={'button'}
                    className={'results-empty__button'}
                    aria-label={'Reset filters'}
                    onClick={() => dispatch(posFilterAction(''))}
                >
                    {t('resultsNotFoundResetFilters')}
                </button>
            </div>
        );
    };
