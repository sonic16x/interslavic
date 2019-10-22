import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { fromTextAction } from 'actions';

interface IInputTextProps {
    changeFromText: (text: string) => void;
    fromText: string;
}

class InputText extends React.Component<IInputTextProps> {
    public render() {
        return (
            <div className={'input-group input-group-lg'}>
                <input
                    placeholder={'Type word here'}
                    type={'text'}
                    className={'form-control fromText'}
                    value={this.props.fromText}
                    onChange={(e) => this.props.changeFromText(e.target.value)}
                />
                <button
                    type={'reset'}
                    className={'removeButton'}
                    title={'Click me to clear the input field'}
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

function mapStateToProps({fromText}) {
    return {fromText};
}

export default connect(mapStateToProps, mapDispatchToProps)(InputText);
