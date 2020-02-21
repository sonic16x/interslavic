import * as React from 'react';
import './index.scss';

export interface ILineSelectorOption {
    name: string;
    value: string;
}

interface ILineSelectorProps {
    options: ILineSelectorOption[];
    value: string;
    onSelect: (value: string) => void;
    className?: string;
}

export const LineSelector: React.FC<ILineSelectorProps> =
    ({className, options, value, onSelect}: ILineSelectorProps) => {
        const index = options.map(({value}) => value).indexOf(value);

        return (
            <div className={'lineSelector' + ` ${className}`}>
                <span
                    className={'slide shadow'}
                    style={{
                        width: `calc(100% / ${options.length})`,
                        marginLeft: `calc(100% / ${options.length} * ${index})`,
                    }}
                />
                {options.map((item, i) => (
                    <span
                        key={i}
                        className={'item' + (value === item.value ? ' active' : '')}
                        onClick={(e) => onSelect(item.value)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        );
    };
