import * as React from 'react';
import { t } from 'translations';
import classNames from 'classnames';
import './index.scss';

export const GDPR: React.FC =
    () => {
        const [visible, setVisible] = React.useState(localStorage.getItem('analyticsAlert') !== 'false');
        const yandexMetrikaLink = 'https://yandex.com/legal/metrica_agreement/';
        const googleAnalyticsLink = 'https://marketingplatform.google.com/about/analytics/terms/us/';

        return (
            <div
                className={classNames('gdpr-alert', {hide: !visible})}
                role={'alert'}
            >
                <h2 className={'gdpr-alert__app-name'}>
                    {t('mainTitle')}
                </h2>
                <div className={'gdpr-alert__title'}>{t('gdprAlertTitle')}</div>
                <div className={'gdpr-alert__text'}>{t('gdprAlertText')}</div>
                <div className={'gdpr-alert__links'}>
                    {t('gdprAlertReadMore')}
                    <a className={'gdpr-alert__link'} rel={'noreferrer'} href={yandexMetrikaLink} target={'_blank'}>
                        {t('gdprAlertYandex')}
                    </a>
                    ,
                    <a className={'gdpr-alert__link'} rel={'noreferrer'} href={googleAnalyticsLink} target={'_blank'}>
                        {t('gdprAlertGoogle')}
                    </a>
                </div>
                <button
                    type={'button'}
                    className={'gdpr-alert__button'}
                    aria-label={'Hide alert'}
                    onClick={() => {
                        setVisible(false);
                        localStorage.setItem('analyticsAlert', 'false');
                    }}
                >
                    {t('gdprAlertOk')}
                </button>
            </div>
        );
    };
