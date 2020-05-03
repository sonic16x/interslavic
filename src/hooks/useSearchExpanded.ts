import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useSearchExpanded() {
    return useSelector((state: IMainState) => state.searchExpanded);
}
