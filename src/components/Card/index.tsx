import * as React from 'react';
import './index.scss';

interface ICardProps {
    title: string;
    id: string;
    children?: any;
}

export const Card: React.FC<ICardProps> =
    ({title, id, children}: ICardProps) => (
        <div className={'card'} id={id}>
            <div className={'card-body'}>
                <h5 className={'card-title'}>{title}</h5>
                {children}
            </div>
        </div>
    );
