import * as React from 'react';
import './index.scss';
import classNames from 'classnames';
import { t } from 'translations';
import { useLoading } from 'hooks/useLoading';

export const Loader =
    () => {
        const loading = useLoading();

        return (
            <div className={classNames('loader', {loading})}>
                <div className={'loader__spinner'}>
                    <span />
                </div>
                <span className={'loader__title'}>{t('loading')}</span>
            </div>
        );
    };
