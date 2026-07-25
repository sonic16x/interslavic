import classNames from 'classnames'
import { useState } from 'react'

import { Checkbox } from 'components/Checkbox'

import './MultiSelector.scss'

export interface IMultiSelectorOption {
    name: string;
    value: string;
}

interface IMultiSelectorProps {
    onSelect: (values: string[]) => void;
    options: IMultiSelectorOption[];
    values: string[];
    emptyText: string;
    className?: string;
    label?: string;
    testId?: string;
}

export const MultiSelector = ({
    onSelect,
    options,
    values,
    emptyText,
    className,
    label,
    testId,
}: IMultiSelectorProps) => {
    const id = label ? label.toLowerCase().replace(/ /g, '_') : null
    const [isOpen, setOpen] = useState(false)

    const toggle = (value: string) => {
        const selected = values.includes(value) ?
            values.filter((item) => item !== value) :
            [...values, value]

        // keep the order of the options, so that the summary is stable
        onSelect(options
            .map(({ value: option }) => option)
            .filter((option) => selected.includes(option)))
    }

    const selectedNames = options
        .filter(({ value }) => values.includes(value))
        .map(({ name }) => name)
    const summary = selectedNames.length ? selectedNames.join(', ') : emptyText

    return (
        <div className={classNames('multi-selector', className, { open: isOpen })}>
            <div className="multi-selector__row">
                {label && <span className="multi-selector__title" id={id}>{label}</span>}
                <button
                    data-testid={testId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-labelledby={id}
                    className="multi-selector__value"
                    title={summary}
                    onClick={() => setOpen(!isOpen)}
                >
                    <span className="multi-selector__value-text">{summary}</span>
                </button>
            </div>
            {isOpen && (
                <div className="multi-selector__options" role="group" aria-labelledby={id}>
                    {options.map(({ name, value }) => (
                        <Checkbox
                            key={value}
                            className="multi-selector__option"
                            title={name}
                            checked={values.includes(value)}
                            onChange={() => toggle(value)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
