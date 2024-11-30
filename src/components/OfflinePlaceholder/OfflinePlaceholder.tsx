import classNames from 'classnames'

import { t } from 'translations'

import './OfflinePlaceholder.scss'

import CrossedCLoudIcon from './images/crossed-cloud-icon.svg'

interface IOfflinePlaceholder {
    className?: string;
    onClick?: () => void;
}

export const OfflinePlaceholder =
    ({ className, onClick }: IOfflinePlaceholder) => (
        <div className={classNames('offline-placeholder', className)} onClick={onClick}>
            <CrossedCLoudIcon/>
            <h4>{t('offline-title')}</h4>
            <h5>{t('offline-message')}</h5>
        </div>
    )
