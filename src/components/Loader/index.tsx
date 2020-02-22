import * as React from 'react';
import './index.scss';
import classNames from 'classnames';

interface ILoaderProps {
    title: string;
    isLoading: boolean;
}

export const Loader: React.FC<ILoaderProps> =
    ({isLoading, title}: ILoaderProps) => (
        <div className={classNames('loaderContainer', {isLoading})}>
            <div className={'text-primary customSpinner'} role={'status'}>
                <span className={'sr-only'} />
            </div>
            <h3 className={'text-muted'}>{title}</h3>
        </div>
    );
