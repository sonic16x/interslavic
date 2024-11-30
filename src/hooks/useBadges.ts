import { useSelector } from 'react-redux'

import { IMainState } from 'reducers'

export function useBadges() {
    return useSelector((state: IMainState) => state.badges)
}
