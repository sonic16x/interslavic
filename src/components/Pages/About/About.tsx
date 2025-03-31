import { useEffect, useState } from 'react'

import { REP_LINK, tablesData } from 'consts'

import { t } from 'translations'

import { getTablePublicUrl } from 'utils'

import { Link } from 'components'

import './About.scss'

export const About =
    () => {
        const [isCom, setIsCom] = useState(false)
        const worksheetUrl = getTablePublicUrl(tablesData[0].spreadsheetId, tablesData[0].sheetId)
        const email = 'cherebedov.sergey@gmail.com'
        const source = 'http://steen.free.fr/interslavic'
        const version = [__VERSION__, __PR_NUMBER__].filter((item) => item && item.length).join('-')

        useEffect(() => {
            fetch('is-com.json')
                .then((res) => res.json())
                .then((data: { isCom: boolean }) => setIsCom(data?.isCom))
        }, [])

        return (
            <div className="about-page">
                <div className="about-page__container">
                    <h4>{t('aboutSmallTitle')}</h4>
                    <div className="about-page__common">
                        <p>{t('aboutInterslavic')}</p>
                        <p>
                            {t('isoCodeText')}&nbsp;
                            <Link
                                title="ISO 639-3 [isv]"
                                href="https://iso639-3.sil.org/code/isv/"
                                external
                            >
                                isv (ISO 639-3)
                            </Link>
                        </p>
                        {t('aboutUsingFrom')} <Link external href={source}>{source}</Link>
                        <hr/>
                        <p>{t('aboutJoinText')}</p>
                        <Link external href={worksheetUrl}>{t('aboutTranslationsTable')}</Link>
                        <hr/>
                        <i>{t('nonCommercialDisclaimer')}</i>
                        <hr/>
                        <h6>{t('aboutDeveloper')}</h6>
                        <div className="about-page__author">
                            {t('aboutAuthorSergeyCherebedov')}:
                            <Link external href="https://github.com/sonic16x">GitHub</Link>
                            {isCom && (
                                <Link external href="https://www.linkedin.com/in/scherebedov/">LinkedIn</Link>
                            )}
                            {isCom && (
                                <Link
                                    href="https://www.facebook.com/profile.php?id=100009366550621"
                                    external
                                >
                                    Facebook
                                </Link>
                            )}
                            <Link external href={`email:${email}`}>{email}</Link>
                        </div>
                        <h6>{t('aboutDeveloperCoauthors')}</h6>
                        <div className="about-page__author">
                            {t('aboutAuthorDenisShabalin')}:
                            <Link external href="https://github.com/ru-danko">GitHub</Link>
                            {isCom && (
                                <Link
                                    href="https://www.facebook.com/d.y.shabalin"
                                    external
                                >
                                    Facebook
                                </Link>
                            )}
                        </div>
                        <div className="about-page__author">
                            {t('aboutAuthorJaroslavSerhieiev')}:
                            <Link external href="https://github.com/noomorph">GitHub</Link>
                            <Link external href="email:noomorph@gmail.com">noomorph@gmail.com</Link>
                        </div>
                        <h6>{t('aboutTranslators')}</h6>
                        <div className="about-page__author">
                            {t('aboutTranslatorsText')}
                        </div>
                        <hr/>
                        {t('aboutSourceCode')} <Link external href={REP_LINK}>{REP_LINK}</Link>
                        <hr/>
                        <h6>{t('aboutOurFriends')}</h6>
                        <div className="about-page__community-links">
                            {isCom && (
                                <Link
                                    title="Interslavic Facebook"
                                    href="https://www.facebook.com/groups/interslavic"
                                    external
                                >
                                    Facebook community
                                </Link>
                            )}
                            {isCom && (
                                <Link
                                    title="Interslavic Discord"
                                    href="https://discord.com/invite/n3saqm27QW"
                                    external
                                >
                                    Discord server
                                </Link>
                            )}
                            <Link
                                title="Interslavic Language Portal"
                                href="https://interslavic-language.org/"
                                external
                            >
                                interslavic-language.org
                            </Link>
                            <Link
                                title="Interslavic journal"
                                href="https://slovjani.info/"
                                external
                            >
                                slovjani.info
                            </Link>
                            <Link
                                title="interslavic.fun"
                                href="https://interslavic.fun/"
                                external
                            >
                                interslavic.fun
                            </Link>
                        </div>
                        <hr/>
                    </div>
                    <div className="about-page__release-date">v{version}</div>
                </div>
            </div>
        )
    }
