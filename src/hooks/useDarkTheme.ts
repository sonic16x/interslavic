import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useDarkTheme() {
    return useSelector((state: IMainState) => state.colorTheme === 'dark');
}
