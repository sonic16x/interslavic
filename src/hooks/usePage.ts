import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function usePage() {
    return useSelector((state: IMainState) => state.page);
}
