import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function usePosFilter() {
    return useSelector((state: IMainState) => state.posFilter);
}
