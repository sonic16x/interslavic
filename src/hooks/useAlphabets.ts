import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useAlphabets() {
    return useSelector((state: IMainState) => state.alphabets);
}
