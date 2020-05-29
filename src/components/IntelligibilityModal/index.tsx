import { hideModalDialog } from 'actions';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import { t } from 'translations';
import './index.scss';
import { useResults } from 'hooks/useResults';
import { useInterfaceLang } from 'hooks/useInterfaceLang';
import { useModalDialog } from 'hooks/useModalDialog';
import { Dictionary, ITranslateResult } from '../../utils/dictionary';
import { parseIntelligibility } from '../../utils/parseIntelligibility';
import { getLatin } from '../../utils/getLatin';
import { getCyrillic } from '../../utils/getCyrillic';
import { getGlagolitic } from '../../utils/getGlagolitic';

function createIntelligibilityChart(item?: ITranslateResult): any {
  if (!item) {
    return false;
  }

  const rawIntelligibility = Dictionary.getField(item.raw, 'sameInLanguages');
  const data = [
    {
      data: {
        _v: 0,
        ukr: 0.1,
        bel: 0.1,
        rus: 0.1,
        _j: 0,
        bul: 0.1,
        mkd: 0.1,
        srp: 0.1,
        hrv: 0.1,
        slv: 0.1,
        _z: 0,
        ces: 0.1,
        slk: 0.1,
        pol: 0.1,
        ...parseIntelligibility(rawIntelligibility),
      },
      meta: { color: 'blue' },
    },
  ];

  const captions = {
    _v: '',
    ukr: 'Ukrainian',
    bel: 'Belarusian',
    rus: 'Russian',
    _j: '',
    bul: 'Bulgarian',
    mkd: 'Macedonian',
    srp: 'Serbian',
    hrv: 'Croatian',
    slv: 'Slovenian',
    _z: '',
    ces: 'Czech',
    slk: 'Slovak',
    pol: 'Polish',
  };

  return <RadarChart
    captions={captions}
    data={data}
    size={450}
    scales={3}
  />;
}

export const IntelligibilityModal: React.FC =
  () => {
    const results = useResults();
    const dispatch = useDispatch();
    const modalDialog = useModalDialog();
    useInterfaceLang();

    const item = results[modalDialog.index];

    const onClick = React.useCallback(() => {
      dispatch(hideModalDialog());
    }, [dispatch]);

    return (
      <>
        <div className={'modal-dialog__header'}>
          <div className={'modal-dialog__header-title'}>
            {item && renderTitle(item)}
          </div>
          <button
            className={'modal-dialog__header-close'}
            onClick={onClick}
            aria-label={'Close'}
          >
            &times;
          </button>
        </div>
        <div className={'modal-dialog__body'}>
          {createIntelligibilityChart(item)}
        </div>
      </>
    );
  };

function renderTitle(item: ITranslateResult) {
  return Dictionary.getField(item.raw, 'isv');
}
