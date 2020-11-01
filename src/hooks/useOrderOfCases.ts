import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useOrderOfCases() {
    return useSelector((state: IMainState) => state.orderOfCases);
}
