import classNames from 'classnames'

import { ISV } from 'consts'

import { t } from 'translations'

import { Selector } from 'components/Selector'

import './LangSelector.scss'

import DirectionIcon from './images/direction-icon.svg'
import RightDirectionIcon from './images/right-direction-icon.svg'

interface ILangPart {
    dir: string;
    lang: string;
    langs: string[];
    onSelect: (lang: string) => void;
}

const LangPart =
    ({ lang, dir, onSelect, langs }: ILangPart) => {
        // const langs = useDictionaryLanguages();

        if (lang === ISV) {
            return (
                <div className="lang-selector__isv">
                    {t('isvLang')}
                </div>
            )
        }

        const options = [...langs].map((value) => ({
            name: t(`${value}Lang`),
            value,
        }))

        return (
            <Selector
                testId="lang-selector"
                className="lang-selector__another"
                label={dir}
                hideLabel
                options={options}
                value={lang}
                onSelect={(value: string) => {
                    if (dir === 'from') {
                        onSelect(value)
                    }
                    if (dir === 'to') {
                        onSelect(value)
                    }
                }}
            />
        )
    }

export interface ILangSelectorProps {
    className?: string;
    lang: { from: string, to: string };
    langs: string[];
    onChange: ({ from, to }: { from: string, to: string }) => void;
    disabled?: boolean;
    hideLangSwitch?: boolean;
}

export const LangSelector =
    ({ className, lang, langs, onChange, disabled, hideLangSwitch }: ILangSelectorProps) => {
        const { from, to } = lang

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
                {hideLangSwitch ? (
                    <div>
                        <RightDirectionIcon />
                    </div>
                ) : (
                    <button
                        data-testid="change-direction"
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
                )}
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
        )
    }
