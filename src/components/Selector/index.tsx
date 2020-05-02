import * as React from 'react';
import './index.scss';
import classNames from 'classnames';

export interface ISelectorOption {
    name: string;
    value: string;
}

interface ISelectorProps {
    onSelect: (option: string) => void;
    options: ISelectorOption[];
    className?: string;
    value?: string;
    label?: string;
}

export const Selector: React.FC<ISelectorProps> =
    (props: ISelectorProps) => {
        const {onSelect, options, className, value, label} = props;
        const id = label ? label.toLowerCase().replace(/ /, '_') : null;

        return (
            <div className={classNames('selector', className)}>
                {label && <label className={'selector__title'} htmlFor={id}>{label}</label>}
                <select
                    id={id}
                    value={value}
                    className={'selector__select'}
                    onChange={(e: any) => onSelect(options[e.currentTarget.selectedIndex].value)}
                >
                    {options.map((option, i) => <option key={i} value={option.value}>{option.name}</option>)}
                </select>
            </div>
        );
    };
