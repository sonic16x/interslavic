import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useResults() {
    return useSelector((state: IMainState) => state.results);
}
