import { langAction } from 'actions';
import * as React from 'react';
import { t } from 'translations';
import { Selector } from 'components/Selector';
import { langs } from 'consts';
import './index.scss';
import { useDispatch } from 'react-redux';
import { useLang } from 'hooks/useLang';

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

export const LangSelector: React.FC =
    () => {
        const {from, to} = useLang();
        const dispatch = useDispatch();

        React.useEffect(() => {
            if (from !== 'isv' && to !== 'isv') {
                dispatch(langAction({
                    from: 'isv',
                    to: 'en',
                }));
            }
        }, [from, to]);

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
                    className={'lang-selector__change-dir-button'}
                    onClick={() => dispatch(langAction({
                        from: to,
                        to: from,
                    }))}
                >
                    ⇄
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
