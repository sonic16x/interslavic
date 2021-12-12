import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useAlphabetType() {
    return useSelector((state: IMainState) => state.alphabetType);
}
