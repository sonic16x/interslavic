import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useLoading() {
    return useSelector((state: IMainState) => state.isLoading);
}
