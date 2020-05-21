import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useIsvSearchByWordForms() {
    return useSelector((state: IMainState) => state.isvSearchByWordForms);
}
