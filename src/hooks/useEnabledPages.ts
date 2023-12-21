import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useEnabledPages() {
    return useSelector((state: IMainState) => state.enabledPages);
}
