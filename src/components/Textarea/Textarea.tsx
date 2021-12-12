import classNames from 'classnames';

import './Textarea.scss';

interface ITextareaProps {
    value?: string;
    size?: 'S' | 'M' | 'L';
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;

    [x:string]: any;
}

export const Textarea = ({ value, error, size = 'M', className, onChange, placeholder, ...otherProps }: ITextareaProps) => {
    return (
        <div
            className={classNames('textarea', [size, className], { error: error.length })}
        >
            {error && (
                <p className="textarea__error-text">
                    {error}
                </p>
            )}
            <textarea
                className="textarea__native"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...otherProps}
            />
        </div>
    );
};
