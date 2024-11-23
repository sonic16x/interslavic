import { tablesData } from 'consts';
import { REP_LINK } from 'consts';

import { t } from 'translations';

import { getTablePublicUrl } from 'utils/getTablePublicUrl';

import { Link } from 'components/Link';

import './About.scss';

export const About =
    () => {
        const worksheetUrl = getTablePublicUrl(tablesData[0].spreadsheetId, tablesData[0].sheetId);
        const email = 'cherebedov.sergey@gmail.com';
        const source = 'http://steen.free.fr/interslavic';

        return (
            <div className="about-page">
                <div className="about-page__container">
                    <h4>{t('aboutSmallTitle')}</h4>
                    <div className="about-page__common">
                        <p>{t('aboutInterslavic')}</p>
                        {t('aboutUsingFrom')} <a target="_blank" rel="noreferrer" href={source}>{source}</a>.
                        <hr/>
                        <p>{t('aboutJoinText')}</p>
                        <a target="_blank" rel="noreferrer" href={worksheetUrl}>{t('aboutTranslationsTable')}</a>
                        <hr/>
                        <i>{t('nonCommercialDisclaimer')}</i>
                        <hr/>
                        <h6>{t('aboutDeveloper')}</h6>
                        <div className="about-page__author">
                            {t('aboutAuthorSergeyCherebedov')}:
                            <a target="_blank" rel="noreferrer" href="https://github.com/sonic16x">GitHub</a>
                            {IS_COM && (
                                <a target="_blank" rel="noreferrer"
                                    href="https://www.linkedin.com/in/scherebedov/">LinkedIn</a>
                            )}
                            {IS_COM && (
                                <Link
                                    href="https://www.facebook.com/profile.php?id=100009366550621"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Facebook
                                </Link>
                            )}
                            <a target="_blank" rel="noreferrer" href={`email:${email}`}>{email}</a>
                        </div>
                        <h6>{t('aboutDeveloperCoauthors')}</h6>
                        <div className="about-page__author">
                            {t('aboutAuthorDenisShabalin')}:
                            <a target="_blank" rel="noreferrer" href="https://github.com/ru-danko">GitHub</a>
                            {IS_COM && (
                                <Link
                                    href="https://www.facebook.com/d.y.shabalin"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Facebook
                                </Link>
                            )}
                        </div>
                        <div className="about-page__author">
                            {t('aboutAuthorJaroslavSerhieiev')}:
                            <a target="_blank" rel="noreferrer" href="https://github.com/noomorph">GitHub</a>
                            <a target="_blank" rel="noreferrer" href="email:noomorph@gmail.com">noomorph@gmail.com</a>
                        </div>
                        <h6>{t('aboutTranslators')}</h6>
                        <div className="about-page__author">
                            {t('aboutTranslatorsText')}
                        </div>
                        <hr/>
                        {t('aboutSourceCode')} <a target="_blank" rel="noreferrer" href={REP_LINK}>{REP_LINK}</a>
                        <hr/>
                        <h6>{t('aboutOurFriends')}</h6>
                        <div className="about-page__community-links">
                            {IS_COM && (
                                <Link
                                    title="Interslavic Facebook"
                                    href="https://www.facebook.com/groups/interslavic"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Facebook community
                                </Link>
                            )}
                            {IS_COM && (
                                <a
                                    title="Interslavic Discord"
                                    href="https://discord.com/invite/n3saqm27QW"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Discord server
                                </a>
                            )}
                            <a
                                title="Interslavic Language Portal"
                                href="http://interslavic-language.org/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                interslavic-language.org
                            </a>
                            <a
                                title="Interslavic journal"
                                href="http://slovjani.info/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                slovjani.info
                            </a>
                        </div>
                        <hr/>
                        <div className="about-page__badges">
                            {/*<a
                                href="https://play.google.com/store/apps/details?id=org.interslavicdictionary.twa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                                className="badge_google-play"
                                title="Get it on Google Play"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    alt="Get it on Google Play"
                                    width="200px"
                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                />
                            </a>*/}

                            {IS_COM && (
                                <a
                                    href="https://discord.com/invite/n3saqm27QW"
                                    title="Get it on Discord"
                                    className="badge_discord"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        alt="Get it on Discord"
                                        width="165px"
                                        style={{ padding: "13px 0px" }}
                                        src="icons/discord-icon-330x102.png"
                                    />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="about-page__release-date">v{VERSION}</div>
                </div>
            </div>
        );
    };
