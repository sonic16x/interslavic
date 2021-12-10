import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { t } from 'translations';

import { fromTextAction } from 'actions';

import { useFromText } from 'hooks/useFromText';
import { useLang } from 'hooks/useLang';
import { toBCP47 } from 'utils/bcp47';

import './InputText.scss';

export const InputText =
    () => {
        const dispatch = useDispatch();
        const lang = useLang();
        const fromText = useFromText();
        const spellCheck = lang.from !== 'isv';
        const searchLanguage = toBCP47(lang.from);
        const onChange = useCallback((e) => {
            dispatch(fromTextAction(e.target.value));
        }, [dispatch]);
        const onClick = useCallback(() => {
            dispatch(fromTextAction(''));
        }, [dispatch]);

        return (
            <div className="input-text">
                <input
                    className="input-text__input"
                    type='search'
                    lang={searchLanguage}
                    autoCapitalize='off'
                    autoComplete={spellCheck ? 'on' : 'off'}
                    autoCorrect={spellCheck ? 'on' : 'off'}
                    spellCheck={spellCheck}
                    placeholder={t('typeWordLabel')}
                    value={fromText}
                    onChange={onChange}
                />
                <button
                    className="input-text__clear-button"
                    type="reset"
                    aria-label="Clear input"
                    disabled={fromText.length === 0}
                    onClick={onClick}
                >
                    &times;
                </button>
            </div>
        );
    };
