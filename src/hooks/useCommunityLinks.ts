import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useCommunityLinks() {
    return useSelector((state: IMainState) => state.communityLinks);
}
