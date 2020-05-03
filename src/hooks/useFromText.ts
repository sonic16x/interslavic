import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useFromText() {
    return useSelector((state: IMainState) => state.fromText);
}
