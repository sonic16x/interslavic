import * as React from 'react';
import useDimensions from 'react-cool-dimensions';
import { useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { t } from 'translations';
import './index.scss';
import CloseImage from './images/close.svg';
import { biReporter } from '../../../services/biReporter';
import { BANNER_TYPES } from '../../../reducers';
import { ActionTypes } from '../../../actions';

function useBannerHeight() {
  const { ref, height } = useDimensions({});

  React.useEffect(() => {
    const app = document.getElementById('app');
    app.style.setProperty('--survey-banner-height', `${height}`);
  }, [height]);

  return ref;
}

export const SurveyBanner: React.FC = () => {
  const dispatch = useDispatch();

  const [isClosing, setClosing] = React.useState(false);
  const close = React.useCallback(() => {
    biReporter.dismissBanner(BANNER_TYPES.SURVEY);
    setClosing(true);
  }, [setClosing]);

  const onCTAClick = React.useCallback(() => biReporter.clickBanner(BANNER_TYPES.SURVEY), []);

  const onBannerExit = React.useCallback(() => dispatch({
    type: ActionTypes.DISMISS_BANNER,
    data: {
      name: BANNER_TYPES.SURVEY,
    },
  }), [dispatch]);

  return (
    <CSSTransition in={!isClosing} timeout={200} classNames={'survey-banner'} onExited={onBannerExit}>
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
              href='https://docs.google.com/forms/d/e/1FAIpQLSeMWWhHKKd7pQolv-EYPAxKjL5ppMb1ABs751AVz-TAfK1nnA/viewform?usp=sf_link'
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
