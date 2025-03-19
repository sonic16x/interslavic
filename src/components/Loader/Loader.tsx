import classNames from 'classnames'
import { useState } from 'react'

import { t } from 'translations'

import { useLoading } from 'hooks'

import { Spinner } from 'components'

import './Loader.scss'

export const Loader =
    () => {
        const loading = useLoading()
        const [visible, setVisible] = useState(true)

        if (!visible) {
            return null
        }

        return (
            <div className={classNames('loader', { loading })} onTransitionEnd={() => setVisible(false)}>
                <Spinner
                    size="4rem"
                    borderWidth=".3em"
                />
                <span className="loader__title" data-testid="dictionary-loading">{t('loading')}</span>
            </div>
        )
    }
