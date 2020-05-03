import { useSelector } from 'react-redux';
import { IMainState } from 'reducers';

export function useFavorite() {
    return useSelector((state: IMainState) => state.favoriteList);
}
