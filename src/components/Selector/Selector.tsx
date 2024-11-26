import classNames from 'classnames';

import './Selector.scss';

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
    testId?: string;
}

export const Selector = ({ onSelect, options, className, value, label, testId }: ISelectorProps) => {
    const id = label ? label.toLowerCase().replace(/ /, '_') : null;

    return (
        <div className={classNames('selector', className)}>
            {label && <label className="selector__title" htmlFor={id}>{label}</label>}
            <select
                data-testid={testId}
                id={id}
                value={value}
                className="selector__select"
                onChange={(e: any) => onSelect(options[e.currentTarget.selectedIndex].value)}
            >
                {options.map((option, i) => <option key={i} value={option.value}>{option.name}</option>)}
            </select>
        </div>
    );
};
