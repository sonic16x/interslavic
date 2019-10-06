import * as React from 'react';
import './index.scss';

interface ILoaderProps {
    title: string;
}

export class Loader extends React.Component<ILoaderProps> {
    public render() {
        return (
            <div className={'loaderContainer'}>
                <div className={'spinner-border text-primary'} role={'status'}>
                    <span className={'sr-only'}>{this.props.title}</span>
                </div>
                <h3 className={'text-muted'}>{this.props.title}</h3>
            </div>
        );
    }
}
