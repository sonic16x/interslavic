import classNames from 'classnames';
import { useState } from 'react';

import { REP_LINK } from 'consts';

import { t } from 'translations';

import './ChangeDomain.scss';

export const ChangeDomain =
    () => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        const [visible, setVisible] = useState(!!redirect);

        return (
            <div
                className={classNames('change-domain-alert', { hide: !visible })}
                role="alert"
            >
                <div className="container">
                    <h2 className="change-domain-alert__title">
                        {t('changeDomainTitle')}
                    </h2>
                    <a href="https://interslavic-wordbook.com/" className="new-domain">interslavic-wordbook.com</a>
                    <h2 className="change-domain-alert__title">
                        {t('changeDomainSave')}
                        <span className="old-domain">(interslavic-dictionary.com)</span>
                        {t('changeDomainStop')}
                    </h2>
                    <h2 className="change-domain-alert__title">
                        {t('changeDomainInstall')}
                        <br/>
                        {t('changeDomainInstall2')}
                        <a href={REP_LINK + '?tab=readme-ov-file#----interslavic-language-dictionary--'} target="_blank" className="new-domain" rel="noreferrer">{t('changeDomainInstruction')}</a>
                    </h2>
                    <button
                        type="button"
                        className="gdpr-alert__button"
                        aria-label="Hide alert"
                        onClick={() => {
                            setVisible(false);
                        }}
                    >
                        {t('gdprAlertOk')}
                    </button>
                </div>
            </div>
        );
    };
