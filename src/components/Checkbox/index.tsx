import * as React from 'react';
import './index.scss';

interface ICheckboxProps {
    title: string;
    checked: boolean;
    onChange: () => void;
}

export const Checkbox: React.FC<ICheckboxProps> =
    ({title, checked, onChange}: ICheckboxProps) => {
        const id = `id_${title.toLowerCase()}`;
        return (
            <span className={'checkbox'}>
                <input
                    onChange={() => onChange()}
                    type={'checkbox'}
                    className={'checkbox__input'}
                    id={id}
                    checked={checked}
                />
                <label
                    className={'checkbox__label'}
                    htmlFor={id}
                    data-checked={checked}
                >
                    {title}
                </label>
            </span>
        );
    };
