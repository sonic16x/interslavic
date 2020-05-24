import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useShortCardView() {
    return useSelector((state: IMainState) => state.isShortCardView);
}
