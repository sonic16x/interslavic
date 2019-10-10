import * as React from 'react';
import './index.scss';

interface ICheckboxProps {
    title: string;
    checked: boolean;
    onChange: () => void;
}

export class Checkbox extends React.Component<ICheckboxProps> {
    public render() {
        const id = `id_${this.props.title.toLowerCase()}`;
        return (
            <div className={'custom-control custom-checkbox'}>
                <input
                    onChange={() => this.props.onChange()}
                    type={'checkbox'}
                    className={'custom-control-input'}
                    id={id}
                    checked={this.props.checked}
                />
                <label className={'custom-control-label'} htmlFor={id}>{this.props.title}</label>
            </div>
        );
    }
}
