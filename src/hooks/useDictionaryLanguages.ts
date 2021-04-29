import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useDictionaryLanguages() {
    return useSelector((state: IMainState) => state.dictionaryLanguages);
}
