import { communityLinksTable } from 'consts';

import { setBadges, setCommunityLinks } from 'actions';

import { getTableDataUrl } from 'utils/getTableDataUrl';
import { isOnline } from 'utils/isOnline';

import rowmap from '@eaterable/rowmap';
import TSV from '@eaterable/tsv-parser';

const communityFeedLink = getTableDataUrl(communityLinksTable.spreadsheetId, communityLinksTable.sheetId);

export async function fetchCommunityLinks(dispatch, currentCommunityLinks) {
    if (!isOnline()) {
        return;
    }

    const communityLinks = await fetch(communityFeedLink)
        .then((res) => res.text())
        .then((text) => {
            const Row = rowmap(TSV.headers(text));

            return Array.from(TSV.rows(text)).map(Row).map(r => r.toJSON());
        });

    if (communityLinks.length > currentCommunityLinks.length) {
        dispatch(setBadges(['community']));
    }

    dispatch(setCommunityLinks(communityLinks));
}
