import cn from 'classnames'

import { t } from 'translations'

import { ITranslateResult } from 'services'

import './ResultsCardCheckBadge.scss'

interface IResultsCardCheckBadgeProps {
    item: ITranslateResult;
    short: boolean;
}

export const ResultsCardCheckBadge = ({ item, short }: IResultsCardCheckBadgeProps) => {
    if (!item.checked) {
        return (
            <div className={cn('results-card-check-badge', { verified: item.checked, short })}>
                {!short && (item.checked ? t('verified') : t('autoTranslation'))}
            </div>
        )
    }
}
