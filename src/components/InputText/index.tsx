import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { fromTextAction } from 'actions';
import { t } from 'translations';
import { toBCP47 } from 'utils/bcp47';

interface IInputTextPropsInternal {
    changeFromText: (text: string) => void;
    fromText: string;
    searchLanguage: string; // valid BCP47 code
    spellCheck: false;
}

const InputTextInternal: React.FC<IInputTextPropsInternal> =
    ({searchLanguage, spellCheck, fromText, changeFromText}) => (
        <div className={'inputText'}>
            <input
                className={'fromText'}
                type='search'
                lang={searchLanguage}
                autoCapitalize='off'
                autoComplete={spellCheck ? 'on' : 'off'}
                autoCorrect={spellCheck ? 'on' : 'off'}
                spellCheck={spellCheck}
                placeholder={t('typeWordLabel')}
                value={fromText}
                onChange={(e) => changeFromText(e.target.value)}
            />
            <button
                className={'removeButton'}
                type={'reset'}
                aria-label={'Clear input'}
                disabled={fromText.length === 0}
                onClick={() => changeFromText('')}
            >
                &times;
            </button>
        </div>
    );

function mapDispatchToProps(dispatch) {
    return {
        changeFromText: (text) => dispatch(fromTextAction(text)),
    };
}

function mapStateToProps({lang, fromText}) {
    return {
        searchLanguage: toBCP47(lang.from),
        spellCheck: lang.from !== 'isv',
        fromText,
    };
}

export const InputText = connect(mapStateToProps, mapDispatchToProps)(InputTextInternal);
