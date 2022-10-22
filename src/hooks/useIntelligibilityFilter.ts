import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useIntelligibilityFilter() {
    return useSelector((state: IMainState) => state.intelligibilityFilter);
}
