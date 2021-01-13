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

const strings = {
  caption: {
    Latn: 'Medžuslovjansky Spis',
    Cyrl: 'Меджусловјанскы Спис',
  },
  description: {
    Latn: 'S pomoćjų tutogo spisa my hćemo kalkulovati kako mnogo jest ljudij govoręćih MS językom ili aktualno učęćih sę go.',
    Cyrl: 'С помочју тутого списа мы хчемо калкуловати како много јест људиј говоречих МС језыком или актуално учечих се го.',
  },
  action: {
    Latn: 'Učęstvovati',
    Cyrl: 'Учествовати',
  },
};

export const SurveyBanner: React.FC = () => {
  const onCTAClick = React.useCallback(() => biReporter.clickBanner('survey'), []);

  const [script, setScript] = React.useState('Latn');
  const [isClosing, setClosing] = React.useState(false);
  const close = React.useCallback(() => {
    biReporter.dismissBanner('survey');
    setClosing(true);
  }, [setClosing]);

  React.useEffect(() => {
    const handle = setInterval(() => {
      setScript(script === 'Cyrl' ? 'Latn' : 'Cyrl');
    }, 5000);

    return () => clearInterval(handle);
  });

  const onBannerExit = useSurveyBanner().dismissBanner;

  return (
    <CSSTransition in={!isClosing} timeout={300} classNames={'survey-banner'} onExited={onBannerExit}>
      <aside ref={useBannerHeight()} className={'survey-banner'}>
        <h1 className='survey-banner__caption'>
          {strings.caption[script]}
        </h1>
        <div className='survey-banner__bottom'>
          <p className='survey-banner__description'>
            {strings.description[script]}
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
              {strings.action[script]}
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
