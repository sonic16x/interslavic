import classNames from 'classnames';

import './InputText.scss';

interface IInputTextProps {
    value?: string;
    size?: 'S' | 'M' | 'L';
    onChange: (value: string) => void;
    placeholder?: string;

    [x:string]: any;
}

export const InputText = ({ value, size = 'M', onChange, placeholder, ...otherProps }: IInputTextProps) => {
    return (
        <div
            className={classNames(['input-text', `input-text-${size.toLowerCase()}`])}
        >
            <input
                className="input-text__input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...otherProps}
            />
            <button
                className="input-text__clear-button"
                type="reset"
                aria-label="Clear input"
                disabled={value.length === 0}
                onClick={() => onChange('')}
            >
                &times;
            </button>
        </div>
    );
};
