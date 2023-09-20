import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useTranslatorLang() {
    return useSelector((state: IMainState) => state.translatorLang);
}
