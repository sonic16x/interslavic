import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useSearchType() {
    return useSelector((state: IMainState) => state.searchType);
}
