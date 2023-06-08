import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useToggleTheme() {
    return useSelector((state: IMainState) => state.isToggleTheme);
}
