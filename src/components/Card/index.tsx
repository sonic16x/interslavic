import * as React from 'react';
import './index.scss';
import classNames from 'classnames';

interface ICardProps {
    title: string;
    id: string;
    className?: string;
    children?: any;
}

export const Card: React.FC<ICardProps> =
    ({title, id, children, className}: ICardProps) => (
        <div className={classNames('card', className)} id={id}>
            <h5 className={'card__title'}>{title}</h5>
            <div className={'card__body'}>
                {children}
            </div>
        </div>
    );
