import { langAction } from 'actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { t } from 'translations';
import { Selector } from 'components/Selector';
import { langs } from 'consts';
import './index.scss';

interface ILangSelectorInternalProps {
    from: string;
    to: string;
    onSelect: (from: string, to: string) => void;
}

interface ILangPart {
    dir: string;
    lang: string;
    onSelect: (lang: string) => void;
}

const LangPart: React.FC<ILangPart> =
    ({lang, dir, onSelect}: ILangPart) => {
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

const LangSelectorInternal: React.FC<ILangSelectorInternalProps> =
    ({from, to, onSelect}: ILangSelectorInternalProps) => {
        return (
            <div className={'lang-selector'}>
                <LangPart
                    dir={'from'}
                    lang={from}
                    onSelect={(value) => onSelect(value, to)}
                />
                <button
                    type={'button'}
                    aria-label={'Change translation direction'}
                    className={'lang-selector__change-dir-button'}
                    onClick={() => onSelect(to, from)}
                >
                    ⇄
                </button>
                <LangPart
                    dir={'to'}
                    lang={to}
                    onSelect={(value) => onSelect(from, value)}
                />
            </div>
        );
    };

function mapStateToProps({lang}) {
    return { ...lang };
}

function mapDispatchToProps(dispatch) {
    return {
        onSelect: (from, to) => {
            dispatch(langAction({from, to}));
        },
    };
}

export const LangSelector = connect(mapStateToProps, mapDispatchToProps)(LangSelectorInternal);
