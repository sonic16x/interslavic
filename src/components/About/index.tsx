import { worksheetUrl } from 'consts';
import * as React from 'react';
import { t } from 'translations';
import './index.scss';

class About extends React.Component {
    public render() {
        const email = 'cherebedov.sergey@gmail.com';
        const github = 'https://github.com/scherebedov/interslavic';
        const source = 'http://steen.free.fr/interslavic';

        return (
            <div className={'about'}>
                <div className={'aboutContent'}>
                    <h4>{t('aboutSmallTitle')}</h4>
                    <div className={'common'}>
                        {t('aboutUsingFrom')} <a target={'_blank'} href={source}>{source}</a>
                        <p>{t('aboutAuthors')}</p>
                        <hr/>
                        <i>{t('nonCommercialDisclaimer')}</i>
                        <hr/>
                        <p>{t('aboutJoinText')}</p>
                        <a target={'_blank'} href={worksheetUrl}>{t('aboutTranslationsTable')}</a>
                        <hr/>
                        <p>{t('aboutDeveloper')}</p>
                        <a target={'_blank'} href={`email:${email}`}>{t('aboutDeveloperName')} ({email})</a>
                        <hr/>
                        {t('aboutSourceCode')} <a target={'_blank'} href={github}>{github}</a>
                        <hr/>
                        <p>{t('aboutOurFriends')}</p>
                        <a
                            title={'Interslavic Facebook'}
                            href={'http://www.facebook.com/groups/interslavic'}
                            target={'_blank'}
                        >
                            <img className={'partners shadow'} src={'partnersFacebook.png'} alt={'Interslavic Facebook Icon'}/>
                        </a>
                        <a
                            title={'Interslavic Language Portal'}
                            href={'http://interslavic-language.org/'}
                            target={'_blank'}
                        >
                            <img
                                className={'partners shadow'}
                                src={'partnersPortal.png'}
                                alt={'Interslavic Language Portal Icon'}
                            />
                        </a>
                        <a
                            title={'Interslavic journal'}
                            href={'http://slovjani.info/'}
                            target={'_blank'}
                        >
                            <img className={'partners shadow'} src={'partnersJournal.jpg'} alt={'Interslavic journal Icon'}/>
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
                    <div className={'devInfo'}>
                        <p className={'text-muted buildHash'}>{DATE}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;
