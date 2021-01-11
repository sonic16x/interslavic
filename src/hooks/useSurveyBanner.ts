import { useDispatch, useSelector } from 'react-redux';
import { IMainState } from 'reducers';
import { ActionTypes } from 'actions';

export function useSurveyBanner() {
    const dispatch = useDispatch();
    const shouldShowBanner = useSelector((state: IMainState) => !state.surveyBanner.dismissed);
    const shouldShowAboutBadge = useSelector((state: IMainState) => !state.surveyBanner.seenOnAboutPage);
    const shouldHighlightAboutSection = shouldShowAboutBadge;

    return {
        shouldShowBanner,
        shouldShowAboutBadge,
        shouldHighlightAboutSection,

        markAboutSectionAsRead: () => dispatch({
            type: ActionTypes.MARK_ABOUT_SURVEY_AS_READ,
        }),
        dismissBanner: () => dispatch({
            type: ActionTypes.DISMISS_SURVEY_BANNER,
        }),
    };
}
