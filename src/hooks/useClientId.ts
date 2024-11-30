import { useSelector } from 'react-redux'

import { IMainState } from 'reducers'

export function useClientId() {
    return useSelector((state: IMainState) => state.clientId)
}
