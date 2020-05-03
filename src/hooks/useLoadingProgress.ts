import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useLoadingProgress() {
    return useSelector((state: IMainState) => state.loadingProgress);
}
