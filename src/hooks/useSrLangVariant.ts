import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useSrLangVariant() {
    return useSelector((state: IMainState) => state.srLangVariant);
}


