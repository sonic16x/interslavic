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
            <div className={'custom-control custom-checkbox'}>
                <input
                    onChange={() => onChange()}
                    type={'checkbox'}
                    className={'custom-control-input'}
                    id={id}
                    checked={checked}
                />
                <label className={'custom-control-label'} htmlFor={id}>{title}</label>
            </div>
        );
    };
