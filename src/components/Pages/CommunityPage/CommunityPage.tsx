import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { communityLinksTable } from 'consts';

import { t } from 'translations';

import { getObjFromTable } from 'utils/getObjFromTable';
import { getTableDataUrl } from 'utils/getTableDataUrl';
import { parseTsvTable } from 'utils/parseTsvTable';

import { Spinner } from 'components/Spinner';

import './CommunityPage.scss';

type LinkType = 'youtube' | 'facebook';

interface ICommunityLink {
    link: string;
    text?: string;
}

function getLinkType(link: string): LinkType {
    if (link.includes('youtube')) {
        return 'youtube';
    }

    if (link.includes('facebook')) {
        return 'facebook';
    }
}

const CommunityLink = ({ link, text }: ICommunityLink) => {
    const linkType = getLinkType(link);

    if (linkType === 'youtube') {
        const urlSearchParams = new URLSearchParams(link.split('?').slice(1).join(''));
        const videoId = urlSearchParams.get('v');

        return (
            <div className={classNames('community-link', { type: linkType })} key={videoId}>
                {text && <p className="community-link__text">{text}</p>}
                <div className="iframe-wrapper">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                    />
                </div>
            </div>
        );
    }

    if (linkType === 'facebook') {
        const facebookLink = `https://www.facebook.com${link.split('groups')[1]}`;

        return (
            <div className={classNames('community-link', { type: linkType })} key={facebookLink}>
                {text && <p className="community-link__text">{text}</p>}
                <div
                    className="fb-post"
                    data-href={facebookLink}
                    data-width="750"
                    data-lazy="true"
                    data-show-text="true"
                />
            </div>
        );
    }

    return null;
}

const communityFeedLink = getTableDataUrl(communityLinksTable.spreadsheetId, communityLinksTable.sheetId);

export const CommunityPage = () => {
    const [communityLinks, setCommunityLinks] = useState<ICommunityLink[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(communityFeedLink)
            .then((res) => res.text())
            .then((text) => {
                const rawData = parseTsvTable(text);
                const linksData: any = getObjFromTable(rawData, communityLinksTable.fields);

                setCommunityLinks(linksData);
                setLoading(false);
            })
        ;
    }, []);

    useEffect(() => {
        FB.init({
            xfbml: true,
            version: 'v12.0'
        });
    }, [communityLinks]);

    return (
        <div className="community">
            <h1>{t('communityPageTitle')}</h1>
            {isLoading && (
                <Spinner
                    size="4rem"
                    borderWidth=".3em"
                />
            )}
            {communityLinks.map((linkData, i) => (<CommunityLink key={i} {...linkData} />))}
        </div>
    );
};

export default CommunityPage;
