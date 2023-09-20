import classNames from 'classnames';

import { t } from 'translations';

import { Selector } from 'components/Selector';

import './LangSelector.scss';

import DirectionIcon from './images/direction-icon.svg';

interface ILangPart {
    dir: string;
    lang: string;
    langs: string[];
    onSelect: (lang: string) => void;
}

const LangPart =
    ({ lang, dir, onSelect, langs }: ILangPart) => {
        // const langs = useDictionaryLanguages();

        if (lang === 'isv') {
            return (
                <div className="lang-selector__isv">
                    {t('isvLang')}
                </div>
            );
        }

        const options = [...langs].map((value) => ({
            name: t(`${value}Lang`),
            value,
        }));

        return (
            <Selector
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

export interface ILangSelectorProps {
    className?: string;
    lang: { from: string, to: string };
    langs: string[];
    onChange: ({ from, to }: { from: string, to: string }) => void;
    disabled?: boolean;
}

export const LangSelector =
    ({ className, lang, langs, onChange, disabled }: ILangSelectorProps) => {
        const { from, to } = lang;

        return (
            <div className={classNames([className, 'lang-selector'], { disabled })}>
                <LangPart
                    dir="from"
                    lang={from}
                    langs={langs}
                    onSelect={(value) => onChange({
                        from: value,
                        to,
                    })}
                />
                <button
                    type="button"
                    aria-label="Change translation direction"
                    className={classNames('lang-selector__change-dir-button', { rotate: from === 'isv' })}
                    onClick={() => onChange({
                        from: to,
                        to: from,
                    })}
                >
                    <DirectionIcon />
                </button>
                <LangPart
                    dir="to"
                    lang={to}
                    langs={langs}
                    onSelect={(value) => onChange({
                        from,
                        to: value,
                    })}
                />
            </div>
        );
    };
