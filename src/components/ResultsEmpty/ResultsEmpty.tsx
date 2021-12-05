import { useDispatch } from 'react-redux';
import { t } from 'translations';
import './ResultsEmpty.scss';
import { posFilterAction } from 'actions';

interface IResultsEmptyProps {
    showReset?: boolean;
}

export const ResultsEmpty =
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
