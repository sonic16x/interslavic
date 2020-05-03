import * as React from 'react';
import './index.scss';
import classNames from 'classnames';
import { t } from 'translations';
import { useLoading } from 'hooks/useLoading';
import { useLoadingProgress } from 'hooks/useLoadingProgress';

export const Loader =
    () => {
        const loading = useLoading();
        const progress = useLoadingProgress();

        return (
            <div className={classNames('loader', {loading})}>
                <span className={'loader__progress'}>
                    {progress}%
                </span>
                <div className={'loader__spinner'}>
                    <span />
                </div>
                <span className={'loader__title'}>{t('loading')}</span>
            </div>
        );
    };
