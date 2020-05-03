import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useLang() {
    return useSelector((state: IMainState) => state.lang);
}
