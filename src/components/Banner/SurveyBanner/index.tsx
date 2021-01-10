import * as React from 'react';
import useDimensions from 'react-cool-dimensions';
import { CSSTransition } from 'react-transition-group';
import { surveyUrl } from 'consts';
import { t } from 'translations';
import { useSurveyBanner } from 'hooks/useSurveyBanner';
import CloseImage from './images/close.svg';
import { biReporter } from 'services/biReporter';
import './index.scss';

function useBannerHeight() {
  const { ref, height } = useDimensions({});

  React.useEffect(() => {
    const app = document.getElementById('app');
    app.style.setProperty('--survey-banner-height', `${height}`);
  }, [height]);

  return ref;
}

export const SurveyBanner: React.FC = () => {
  const onCTAClick = React.useCallback(() => biReporter.clickBanner('survey'), []);

  const [isClosing, setClosing] = React.useState(false);
  const close = React.useCallback(() => {
    biReporter.dismissBanner('survey');
    setClosing(true);
  }, [setClosing]);

  const onBannerExit = useSurveyBanner().dismissBanner;

  return (
    <CSSTransition in={!isClosing} timeout={300} classNames={'survey-banner'} onExited={onBannerExit}>
      <aside ref={useBannerHeight()} className={'survey-banner'}>
        <h1 className='survey-banner__caption'>
          {t('surveyBanner.caption')}
        </h1>
        <div className='survey-banner__bottom'>
          <p className='survey-banner__description'>
            {t('surveyBanner.description')}
          </p>
          <div className='survey-banner__action'>
            <a
              className='survey-banner__button'
              role='button'
              target='_blank'
              rel='noopener noreferrer'
              href={surveyUrl}
              onClick={onCTAClick}
            >
              {t('surveyBanner.action')}
            </a>
          </div>
        </div>
        <button title={t('close')} aria-label={t('close')} className='survey-banner__close' onClick={close}>
          <CloseImage />
        </button>
      </aside>
    </CSSTransition>
  );
};
