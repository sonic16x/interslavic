import * as React from 'react';
import './index.scss';

export interface ILineSelectorOption {
    name: string;
    value: string;
}

interface ILineSelectorProps {
    options: ILineSelectorOption[];
    value: string;
    onSelect: (value: string) => void;
}

interface ILineSelectorState {}

export class LineSelector extends React.Component<ILineSelectorProps, ILineSelectorState> {
    public render() {
        return (
            <ul className={'nav nav-pills nav-fill'}>
                {this.props.options.map(({name, value}, i) => (
                    <li className={'nav-item'} key={i}>
                        <a className={'nav-link' + (value === this.props.value ? ' active' : '')} href='#' onClick={() => this.props.onSelect(value)}>{name}</a>
                    </li>
                ))}
            </ul>
        );
    }
}