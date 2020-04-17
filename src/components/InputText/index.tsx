import * as React from 'react';
import { connect } from 'connect';
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
    ({searchLanguage, spellCheck, fromText, changeFromText}) => {
        let timerId;

        const search = (e) => {
            clearTimeout(timerId);
            const {value} = e.target;
            timerId = setTimeout(() => changeFromText(value), 200);
        }

        return (
            <div className={'input-group input-group-lg inputText'}>
                <input
                    type='search'
                    lang={searchLanguage}
                    autoCapitalize='off'
                    autoComplete={spellCheck ? 'on' : 'off'}
                    autoCorrect={spellCheck ? 'on' : 'off'}
                    spellCheck={spellCheck}
                    placeholder={t('typeWordLabel')}
                    className={'form-control fromText'}
                    defaultValue={fromText}
                    onChange={search}
                />
                <button
                    type={'reset'}
                    className={'removeButton'}
                    aria-label={'Clear input'}
                    disabled={fromText.length === 0}
                    onClick={() => changeFromText('')}
                >
                    &times;
                </button>
            </div>
        )
    };

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

export default connect(mapStateToProps, mapDispatchToProps)(InputTextInternal);
