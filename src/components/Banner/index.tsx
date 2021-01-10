import React from 'react';
import { useSurveyBanner } from '../../hooks/useSurveyBanner';
import { SurveyBanner } from './SurveyBanner';

export const Banner: React.FC = () => {
  const { shouldShowBanner } = useSurveyBanner();
  if (shouldShowBanner) {
    return <SurveyBanner />;
  }

  return null;
};
