import * as React from 'react';
import './index.scss';
import classNames from 'classnames';
import { t } from 'translations';
import { useLoading } from 'hooks/useLoading';
import { useLoadingProgress } from 'hooks/useLoadingProgress';

function buildCirclePath(cx: number, cy: number, r: number): string {
  return `
      M ${cx}, ${cy - r}
      a ${r},${r} 0 1,0 0,${r * 2}
      a ${r},${r} 0 1,0 0,${-r * 2}
  `;
}

const RADIUS = 50;
const STROKE = 6;
const INNER_RADIUS = RADIUS - (STROKE / 2);
const CIRCLE_PATH = buildCirclePath(RADIUS, RADIUS, INNER_RADIUS);
const MAX_OFFSET = Math.ceil(2 * Math.PI * INNER_RADIUS);

export const Loader =
    () => {
        const loading = useLoading();
        const progress = useLoadingProgress();
        const dashOffset = Math.floor(0.01 * progress * MAX_OFFSET) - MAX_OFFSET;

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
                            viewBox={'0 0 100 100'}
                        >
                            <path
                                className={'sector-path'}
                                d={CIRCLE_PATH}
                                stroke={'#2962ff'}
                                strokeWidth={'6px'}
                                strokeDasharray={MAX_OFFSET}
                                strokeDashoffset={dashOffset}
                                fill={'none'}
                            />
                        </svg>
                    </span>
                </div>

                <span className={'loader__title'}>{t('loading')}</span>
            </div>
        );
    };
