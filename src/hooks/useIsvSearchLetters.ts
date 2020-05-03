import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useIsvSearchLetters() {
    return useSelector((state: IMainState) => state.isvSearchLetters);
}
