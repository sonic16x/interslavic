import classNames from 'classnames'

import './LineSelector.scss'

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

export const LineSelector =
    ({ className, options, value, onSelect }: ILineSelectorProps) => {
        const index = options.findIndex((item) => (item.value === value))
        const length = options.length

        return (
            <div className={classNames('lineSelector', className)}>
                <span
                    className="slide"
                    style={{
                        width: `calc(100% / ${length})`,
                        marginLeft: `calc(100% / ${length} * ${index})`,
                    }}
                />
                {options.map((item) => (
                    <span
                        key={item.name}
                        className={classNames('item', { active: value === item.value })}
                        onClick={() => onSelect(item.value)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        )
    }
