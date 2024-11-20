import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { langAction } from 'actions';

import { useDictionaryLanguages } from 'hooks/useDictionaryLanguages';
import { useLang } from 'hooks/useLang';

import { Selector } from 'components/Selector';

import './LangSelector.scss';

import DirectionIcon from './images/direction-icon.svg';

interface ILangPart {
    dir: string;
    lang: string;
    onSelect: (lang: string) => void;
}

const LangPart =
    ({ lang, dir, onSelect }: ILangPart) => {
        const langs = useDictionaryLanguages();

        if (lang === 'isv') {
            return (
                <div className="lang-selector__isv">
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
                testId="lang-selector"
                className="lang-selector__another"
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
        const { from, to } = useLang();
        const dispatch = useDispatch();

        return (
            <div className="lang-selector">
                <LangPart
                    dir="from"
                    lang={from}
                    onSelect={(value) => dispatch(langAction({
                        from: value,
                        to,
                    }))}
                />
                <button
                    data-testid="change-direction"
                    type="button"
                    aria-label="Change translation direction"
                    className={classNames('lang-selector__change-dir-button', { rotate: from === 'isv' })}
                    onClick={() => dispatch(langAction({
                        from: to,
                        to: from,
                    }))}
                >
                    <DirectionIcon />
                </button>
                <LangPart
                    dir="to"
                    lang={to}
                    onSelect={(value) => dispatch(langAction({
                        from,
                        to: value,
                    }))}
                />
            </div>
        );
    };
