import * as React from 'react';
import './index.scss';

interface ILoaderProps {
    title: string;
    isLoading: boolean;
}

export const Loader: React.FC<ILoaderProps> =
    ({isLoading, title}: ILoaderProps) => (
        <div className={'loaderContainer' + (isLoading ? ' loading' : '')}>
            <div className={'text-primary customSpinner'} role={'status'}>
                <span className={'sr-only'} />
            </div>
            <h3 className={'text-muted'}>{title}</h3>
        </div>
    );
