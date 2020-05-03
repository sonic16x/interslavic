import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useNotification() {
    return useSelector((state: IMainState) => state.notification);
}
