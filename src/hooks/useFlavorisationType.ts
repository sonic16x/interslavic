import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useFlavorisationType() {
    return useSelector((state: IMainState) => state.flavorisationType);
}
