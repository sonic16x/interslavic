import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { fromTextAction } from 'actions';

interface IInputTextProps {
    changeFromText: (text: string) => void;
}

class InputText extends React.Component<IInputTextProps> {
    public render() {
        return (
            <div className={'input-group input-group-lg'}>
                <input
                    placeholder={'Type word here'}
                    type={'text'}
                    className={'form-control'}
                    onChange={(e) => this.props.changeFromText(e.target.value)}
                />
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        changeFromText: (text) => dispatch(fromTextAction(text)),
    };
}

export default connect(null, mapDispatchToProps)(InputText);
