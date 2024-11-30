import classNames from 'classnames'

import { t } from 'translations'

import { useLoading } from 'hooks'

import { Spinner } from 'components'

import './Loader.scss'

export const Loader =
    () => {
        const loading = useLoading()

        return (
            <div className={classNames('loader', { loading })}>
                <Spinner
                    size="4rem"
                    borderWidth=".3em"
                />
                <span className="loader__title" data-testid="dictionary-loading">{t('loading')}</span>
            </div>
        )
    }
