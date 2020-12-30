import * as React from 'react';
import useDimensions from 'react-cool-dimensions';
import classNames from 'classnames';
import { t } from 'translations';
import './index.scss';
import CloseImage from './images/close.svg';
import { useLang } from 'hooks/useLang';

function useBannerHeight() {
  const { ref, height } = useDimensions({});

  React.useEffect(() => {
    const app = document.getElementById('app');
    app.style.setProperty('--survey-banner-height', `${height}`);
  }, [height]);

  return ref;
}

export const SurveyBanner: React.FC = () => {
  const lang = useLang() as any;
  const [isClosing, setClosing] = React.useState(false);
  const close = React.useCallback(() => setClosing(true), [setClosing]);

  return (
    <aside ref={useBannerHeight()} className={classNames('survey-banner', isClosing && 'closing')}>
      <h1 className='survey-banner__caption'>
        {t('surveyBanner.caption', { lang })}
      </h1>
      <div className='survey-banner__bottom'>
        <p className='survey-banner__description'>
          {t('surveyBanner.description', { lang })}
        </p>
        <div className='survey-banner__action'>
          <a
             className='survey-banner__button'
             role='button'
             target='_blank'
             rel='noopener noreferrer'
             href='https://docs.google.com/forms/d/e/1FAIpQLSeMWWhHKKd7pQolv-EYPAxKjL5ppMb1ABs751AVz-TAfK1nnA/viewform?usp=sf_link'
          >
            {t('surveyBanner.action')}
          </a>
        </div>
      </div>
      <button title={t('close')} aria-label={t('close')} className='survey-banner__close' onClick={close}>
        <CloseImage />
      </button>
    </aside>
  );
};
