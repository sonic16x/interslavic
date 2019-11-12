import * as React from 'react';
import './index.scss';

interface ILoaderProps {
    title: string;
    isLoading: boolean;
}

export class Loader extends React.Component<ILoaderProps> {
    public render() {
        return (
            <div className={'loaderContainer' + (this.props.isLoading ? ' loading' : '')}>
                <div className={'text-primary customSpinner'} role={'status'}>
                    <span className={'sr-only'} />
                </div>
                <h3 className={'text-muted'}>{this.props.title}</h3>
            </div>
        );
    }
}
