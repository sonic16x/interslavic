import classNames from 'classnames'

import './Checkbox.scss'

import CheckedIcon from './images/checked-icon.svg'
import PartCheckedIcon from './images/part-checked-icon.svg'

interface ICheckboxProps {
    className?: string;
    title: string;
    checked: boolean;
    disabled?: boolean;
    part?: boolean;
    onChange: (event: any) => void;
}

export const Checkbox =
    ({ className, title, checked, onChange, disabled, part }: ICheckboxProps) => {
        const id = `id_${title.toLowerCase()}`

        return (
            <div className={classNames('checkbox', className, { disabled, checked })}>
                <input
                    onChange={onChange}
                    type="checkbox"
                    className="checkbox__input"
                    id={id}
                    checked={checked}
                />
                <span
                    className="checkbox__box"
                    onClick={onChange}
                >
                    <span className="checkbox__icon">
                        {!part && <CheckedIcon/>}
                        {part && <PartCheckedIcon/>}
                    </span>
                </span>
                <label
                    className="checkbox__label"
                    htmlFor={id}
                >
                    {title}
                </label>
            </div>
        )
    }
