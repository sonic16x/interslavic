import * as React from 'react';
import './index.scss';
import classNames from 'classnames';
import { t } from 'translations';
import { useLoading } from 'hooks/useLoading';
import { useLoadingProgress } from 'hooks/useLoadingProgress';

function getArc(angle, radius, center) {
    const x = center + radius * Math.cos(angle / 180 * Math.PI);
    const y = center + radius * Math.sin(angle / 180 * Math.PI);

    return `A${radius},${radius} 1 0 1 ${x},${y}`;
}

function getSector(angle: number, size: number, stroke: number) {
    const firstAngle = angle > 180 ? 90 : angle - 90;
    const secondAngle = -270 + angle - 180;
    const center = size / 2;
    const radius = stroke ? center - (stroke) / 2 : center;

    const firstArc = getArc(firstAngle, radius, center);
    const secondArc = angle > 180 ? getArc(secondAngle, radius, center) : '';
    const start = `M${center},${stroke / 2}`;

    return `${start} ${firstArc} ${secondArc}`;
}

export const Loader =
    () => {
        const loading = useLoading();
        const progress = useLoadingProgress();
        const angle = (360 / 100) * progress;

        return (
            <div className={classNames('loader', {loading})}>
                <div className={'loader__inner'}>
                    <span className={'loader__progress'}>
                        {progress}%
                    </span>
                    <span
                        className={'loader__circle'}
                    >
                        <svg
                            width={'100px'}
                            height={'100px'}
                            viewBox={'0 0 100px 100px'}
                        >
                            <path
                                className={'sector-path'}
                                d={getSector(angle, 100, 6)}
                                stroke={'#2962ff'}
                                strokeWidth={'6px'}
                                fill={'none'}
                            />
                        </svg>
                    </span>
                </div>

                <span className={'loader__title'}>{t('loading')}</span>
            </div>
        );
    };
