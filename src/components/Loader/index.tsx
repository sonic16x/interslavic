import * as React from 'react';
import './index.scss';
import classNames from 'classnames';

interface ILoaderProps {
    title: string;
    isLoading: boolean;
}

export const Loader: React.FC<ILoaderProps> =
    ({isLoading, title}: ILoaderProps) => (
        <div className={classNames('loader', {loading: isLoading})}>
            <div className={'loader__spinner'}>
                <span />
            </div>
            <span className={'loader__title'}>{title}</span>
        </div>
    );
