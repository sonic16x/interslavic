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

interface ILineSelectorState {
    initial: boolean;
}

export class LineSelector extends React.Component<ILineSelectorProps, ILineSelectorState> {
    private liRefs;
    constructor(props) {
        super(props);
        this.state = {
            initial: true,
        };
        this.liRefs = {};
        props.options.forEach(({value}) => {
            this.liRefs[value] = React.createRef();
        });
        this.resizeCallback = this.resizeCallback.bind(this);
        window.addEventListener('resize', this.resizeCallback);
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.resizeCallback);
    }
    public componentDidMount() {
        if (this.state.initial === true) {
            this.setState({initial: false});
        }
    }
    public render() {
        const index = this.props.options.map(({value}) => value).indexOf(this.props.value);
        const activeRef = this.liRefs[this.props.value].current;
        const width = activeRef ? activeRef.clientWidth : 0;
        const marginLeft = activeRef ?  this.getWithBefore(index) : 0;

        return (
            <ul className={'nav nav-pills nav-fill lineSelector'}>
                <li className={'nav-item back'} style={{marginLeft, width}}>
                    <a
                        className={'nav-link active shadow slide'}
                        href='#'
                        onClick={(e) => e.preventDefault()}
                    >
                        &nbsp;
                    </a>
                </li>
                {this.props.options.map(({name, value}, i) => (
                    <li className={'nav-item'} key={i} ref={this.liRefs[value]}>
                        <a
                            className={'nav-link' + (value === this.props.value ? ' activeItem' : '')}
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                this.props.onSelect(value);
                            }}
                        >
                            {name}
                        </a>
                    </li>
                ))}
            </ul>
        );
    }
    private getWithBefore(index): number {
        return this.props.options
            .slice(0, index).reduce((acc, {value}) => (acc + this.liRefs[value].current.clientWidth), 0)
        ;
    }
    private resizeCallback() {
        this.setState({initial: false});
    }
}
