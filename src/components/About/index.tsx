import { worksheetUrl } from 'consts';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';

export const About: React.FC =
    () => {
        const email = 'cherebedov.sergey@gmail.com';
        const github = 'https://github.com/scherebedov/interslavic';
        const source = 'http://steen.free.fr/interslavic';
        let version = `v${VERSION}`;
        const trimmedBaseUrl = BASE_URL.replace('/', '');
        if (trimmedBaseUrl !== '') {
            version += `-${trimmedBaseUrl}`;
        }

        return (
            <div className={'about-page'}>
                <div className={'about-page__container'}>
                    <h4>{t('aboutSmallTitle')}</h4>
                    <div className={'about-page__common'}>
                        <p>{t('aboutInterslavic')}</p>
                        {t('aboutUsingFrom')} <a target={'_blank'} href={source}>{source}</a>.
                        <hr/>
                        <p>{t('aboutJoinText')}</p>
                        <a target={'_blank'} href={worksheetUrl}>{t('aboutTranslationsTable')}</a>
                        <hr/>
                        <i>{t('nonCommercialDisclaimer')}</i>
                        <hr/>
                        <h6>{t('aboutDeveloper')}</h6>
                        <div className={'about-page__author'}>
                            {t('aboutAuthorSergeyCherebedov')}:
                            <a target={'_blank'} href={'https://github.com/scherebedov'}>GitHub</a>
                            <a target={'_blank'} href={'https://www.linkedin.com/in/scherebedov/'}>LinkedIn</a>
                            <a target={'_blank'} href={'https://www.facebook.com/profile.php?id=100009366550621'}>Facebook</a>
                            <a target={'_blank'} href={`email:${email}`}>{email}</a>
                        </div>
                        <h6>{t('aboutDeveloperCoauthors')}</h6>
                        <div className={'about-page__author'}>
                            {t('aboutAuthorDenisShabalin')}:
                            <a target={'_blank'} href={'https://github.com/ru-danko'}>GitHub</a>
                            <a target={'_blank'} href={'https://www.facebook.com/d.y.shabalin'}>Facebook</a>
                        </div>
                        <div className={'about-page__author'}>
                            {t('aboutAuthorJaroslavSerhieiev')}:
                            <a target={'_blank'} href={'https://github.com/noomorph'}>GitHub</a>
                            <a target={'_blank'} href={'email:noomorph@gmail.com'}>noomorph@gmail.com</a>
                        </div>
                        <h6>{t('aboutTranslators')}</h6>
                        <div className={'about-page__author'}>
                            {t('aboutTranslatorsText')}
                        </div>
                        <hr/>
                        {t('aboutSourceCode')} <a target={'_blank'} href={github}>{github}</a>
                        <hr/>
                        <h6>{t('aboutOurFriends')}</h6>
                        <a
                            title={'Interslavic Facebook'}
                            href={'http://www.facebook.com/groups/interslavic'}
                            target={'_blank'}
                        >
                            Facebook community
                        </a>
                        <br/>
                        <a
                            title={'Interslavic Language Portal'}
                            href={'http://interslavic-language.org/'}
                            target={'_blank'}
                        >
                            interslavic-language.org
                        </a>
                        <br/>
                        <a
                            title={'Interslavic journal'}
                            href={'http://slovjani.info/'}
                            target={'_blank'}
                        >
                            slovjani.info
                        </a>
                        <hr/>
                        <a
                            href={'https://play.google.com/store/apps/details?id=org.interslavicdictionary.twa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'}
                            title={'Get it on Google Play'}
                            target={'_blank'}
                        >
                            <img
                                alt={'Get it on Google Play'}
                                width={'200px'}
                                src={'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'}
                            />
                        </a>
                    </div>
                    <div className={'about-page__release-date'}>{version}</div>
                </div>
            </div>
        );
    };
