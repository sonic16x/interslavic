import { useSelector } from 'react-redux';
import { BANNER_TYPES, IMainState } from 'reducers';

export function useBanner(name: BANNER_TYPES) {
  return useSelector((state: IMainState) => ({
    visible: !state.dismissedBanners[name],
  }));
}
