import { useSelector } from 'react-redux';

import { IMainState } from 'reducers';

export function useCaseQuestions() {
    return useSelector((state: IMainState) => state.caseQuestions);
}
