import * as React from 'react';
import './index.scss';

interface ILoaderProps {
    title: string;
    isLoading: boolean;
    progress: number;
}

// tslint:disable
export const Loader: React.FC<ILoaderProps> = ({isLoading, progress, title}) => {
    const a = progress;
    const b = 100 - progress;
    return (
        <div className={'loaderContainer' + (isLoading ? ' loading' : '')}>
            <div className={'progressBar'}>
                <svg width="150px" height="150px" viewBox="0 0 42 42" className="svgIcon">
                    <circle cx="21" cy="21" r="15.91549430918954" fill="#fff"/>
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent"
                            stroke="#ffffff"
                            strokeWidth="3"/>
                    <circle className="circleElement" cx="21" cy="21" r="15.91549430918954" fill="transparent"
                            stroke="#2962ff"
                            strokeWidth="3" strokeDasharray={`${a} ${b}`} strokeDashoffset="0"/>
                </svg>
                <div className={'text-muted progressText'}>{progress}<span className={'progressPercent'}>%</span></div>
            </div>
            <div className={'text-muted progressTitle'}>{title}</div>
        </div>
    );
};
