import * as React from 'react';
import classNames from 'classnames';
import { t } from 'translations';
import './index.scss';
import CloseImage from './images/close.svg';

export const SurveyBanner: React.FC =
  () => {
    return (
      <aside className='survey-banner'>
        <h1 className='survey-banner__caption'>
          <span lang='sla-Latn-x-isv'>Medžuslovjansky Spis</span>
          <span hidden={true} lang='sla-Cyrl-x-isv'>Меджусловјанскы Спис</span>
        </h1>
        <div className='survey-banner__bottom'>
          <p className='survey-banner__description'>
            <span lang='sla-Latn-x-isv'>S pomoćjų tutogo spisa my hćemo kalkulovati kako mnogo jest ljudij govoręćih MS językom ili aktualno učęćih sę go.</span>
            <span hidden={true} lang='sla-Cyrl-x-isv'>С помочју тутого списа мы хчемо калкуловати како много јест људиј говоречих МС језыком или актуално учечих се го.</span>
          </p>
          <div className='survey-banner__action'>
            <a
               className='survey-banner__button'
               role='button'
               target='_blank'
               rel='noopener noreferrer'
               href='https://docs.google.com/forms/d/e/1FAIpQLSeMWWhHKKd7pQolv-EYPAxKjL5ppMb1ABs751AVz-TAfK1nnA/viewform?usp=sf_link'
            >
              <span lang='sla-Latn-x-isv'>Učęstvovati</span>
              <span hidden={true} lang='sla-Cyrl-x-isv'>Учествовати</span>
            </a>
          </div>
        </div>
        <button title={t('close')} aria-label={t('close')} className='survey-banner__close'>
          <CloseImage />
        </button>
      </aside>
    );
  };
