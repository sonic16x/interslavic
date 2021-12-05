import { langAction } from 'actions';

import classNames from 'classnames';
import { t } from 'translations';
import { Selector } from 'components/Selector';
import { langs , addLangs } from 'consts';
import './LangSelector.scss';
import DirectionIcon from './images/direction-icon.svg';
import { useDispatch } from 'react-redux';
import { useLang } from 'hooks/useLang';
import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';

interface ILangPart {
    dir: string;
    lang: string;
    onSelect: (lang: string) => void;
}

const LangPart =
    ({lang, dir, onSelect}: ILangPart) => {
        const langs = useDictionaryLanguages();

        if (lang === 'isv') {
            return (
                <div className={'lang-selector__isv'}>
                    {t('isvLang')}
                </div>
            );
        }

        const options = ['en', ...langs].map((value) => ({
            name: t(`${value}Lang`),
            value,
        }));

        return (
            <Selector
                className={'lang-selector__another'}
                options={options}
                value={lang}
                onSelect={(value: string) => {
                    if (dir === 'from') {
                        onSelect(value);
                    }
                    if (dir === 'to') {
                        onSelect(value);
                    }
                }}
            />
        );
    };

export const LangSelector =
    () => {
        const {from, to} = useLang();
        const dispatch = useDispatch();

        return (
            <div className={'lang-selector'}>
                <LangPart
                    dir={'from'}
                    lang={from}
                    onSelect={(value) => dispatch(langAction({
                        from: value,
                        to,
                    }))}
                />
                <button
                    type={'button'}
                    aria-label={'Change translation direction'}
                    className={classNames('lang-selector__change-dir-button', {rotate: from === 'isv'})}
                    onClick={() => dispatch(langAction({
                        from: to,
                        to: from,
                    }))}
                >
                    <DirectionIcon />
                </button>
                <LangPart
                    dir={'to'}
                    lang={to}
                    onSelect={(value) => dispatch(langAction({
                        from,
                        to: value,
                    }))}
                />
            </div>
        );
    };
