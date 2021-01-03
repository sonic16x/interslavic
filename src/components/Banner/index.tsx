import React from 'react';
import { useBanner } from '../../hooks/useBanner';
import { SurveyBanner } from './SurveyBanner';
import { BANNER_TYPES } from '../../reducers';

export const Banner: React.FC = () => {
  const surveyBanner = useBanner(BANNER_TYPES.SURVEY);
  if (surveyBanner.visible) {
    return <SurveyBanner />;
  }

  return null;
};
