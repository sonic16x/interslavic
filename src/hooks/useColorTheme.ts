import { useSelector } from 'react-redux'

import { IMainState } from 'reducers'

type Theme = 'dark' | 'light'

export function useColorTheme(): Theme {
    return useSelector((state: IMainState) => state.colorTheme)
}
