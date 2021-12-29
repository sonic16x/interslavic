import { communityLinksTable } from 'consts';

import { setBadges, setCommunityLinks } from 'actions';

import { getObjFromTable } from 'utils/getObjFromTable';
import { getTableDataUrl } from 'utils/getTableDataUrl';
import { parseTsvTable } from 'utils/parseTsvTable';

const communityFeedLink = getTableDataUrl(communityLinksTable.spreadsheetId, communityLinksTable.sheetId);

export async function fetchCommunityLinks(dispatch, currentCommunityLinks) {
    const communityLinks = await fetch(communityFeedLink)
        .then((res) => res.text())
        .then((text) => {
            const rawData = parseTsvTable(text);
            
            return getObjFromTable(rawData, communityLinksTable.fields);
        })
    ;

    if (communityLinks.length > currentCommunityLinks.length) {
        dispatch(setBadges(['community']));
    }

    dispatch(setCommunityLinks(communityLinks));
}
