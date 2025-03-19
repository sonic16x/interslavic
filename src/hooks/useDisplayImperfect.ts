import { useSelector } from 'react-redux'

import { IMainState } from 'reducers'

export function useDisplayImperfect() {
    return useSelector((state: IMainState) => state.displayImperfect)
}
