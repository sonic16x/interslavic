import classNames from 'classnames';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { setBadges } from 'actions';
import { ICommunityLink } from 'reducers';

import { useCommunityLinks } from 'hooks/useCommunityLinks';
import { isOnline } from 'utils/isOnline';

import { OfflinePlaceholder } from 'components/OfflinePlaceholder';

import './CommunityPage.scss';

type LinkType = 'youtube' | 'facebook';

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


export const CommunityPage = () => {
    const dispatch = useDispatch();
    const communityLinks = useCommunityLinks();
    const online = isOnline();

    useEffect(() => {
        if (online) {
            FB.init({
                xfbml: true,
                version: 'v12.0'
            });

            dispatch(setBadges([]));
        }
    }, [communityLinks]);

    if (!online) {
        return <OfflinePlaceholder className="community-offline"/>
    }

    return (
        <div className="community">
            <h1>{t('communityPageTitle')}</h1>
            {communityLinks.map((linkData, i) => (<CommunityLink key={i} {...linkData} />))}
        </div>
    );
};

export default CommunityPage;
