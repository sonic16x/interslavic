import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { fromTextAction } from 'actions';
import { toBCP47 } from 'utils/bcp47';

interface IInputTextProps {
    changeFromText: (text: string) => void;
    fromText: string;
    searchLanguage: string; // valid BCP47 code
    spellCheck: false;
}

class InputText extends React.Component<IInputTextProps> {
    public render() {
        return (
            <div className={'input-group input-group-lg'}>
                <input
                    type='search'
                    lang={this.props.searchLanguage}
                    autoCapitalize='off'
                    autoComplete={this.props.spellCheck ? 'on' : 'off'}
                    autoCorrect={this.props.spellCheck ? 'on' : 'off'}
                    spellCheck={this.props.spellCheck}
                    placeholder={'Type word here'}
                    className={'form-control fromText'}
                    value={this.props.fromText}
                    onChange={(e) => this.props.changeFromText(e.target.value)}
                />
                <button
                    type={'reset'}
                    className={'removeButton'}
                    aria-label={'Clear input'}
                    tabIndex={0}
                    disabled={this.props.fromText.length === 0}
                    onClick={() => this.props.changeFromText('')}
                >
                    &times;
                </button>
            </div>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(InputText);
