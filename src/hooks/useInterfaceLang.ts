import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useInterfaceLang() {
    return useSelector((state: IMainState) => state.interfaceLang);
}
