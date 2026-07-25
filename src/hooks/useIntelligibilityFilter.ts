import { useSelector } from 'react-redux'

import { IMainState } from 'reducers'

const EMPTY: string[] = []

export function useIntelligibilityFilter() {
    return useSelector((state: IMainState) => state.intelligibilityFilter) || EMPTY
}
