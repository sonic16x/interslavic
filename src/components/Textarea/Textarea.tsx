import classNames from 'classnames'
import { useEffect, useRef } from 'react'

import './Textarea.scss'

interface ITextareaProps {
    value?: string;
    size?: 'S' | 'M' | 'L';
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
    autoresize?: boolean;

    [x:string]: any;
}

function getLinesHeight(count, size) {
    const sizes = {
        'XS': 16,
        'S': 18,
        'M': 20,
        'L': 14,
    }

    return sizes[size] * count + 8 * 2
}

export const Textarea = ({
    value, error, size = 'M', className, onChange, autoresize, placeholder, ...otherProps
}: ITextareaProps) => {
    const textareaRef = useRef(null)

    const minLines = 2
    const maxLines = 6
    const minHeight = getLinesHeight(minLines, size)
    const maxHeight = getLinesHeight(maxLines, size)

    useEffect(() => {
        if (textareaRef && textareaRef.current && autoresize) {
            textareaRef.current.style.height = ''
            const height = Math.min(Math.max(textareaRef.current.scrollHeight, minHeight), maxHeight) + 2
            textareaRef.current.style.height = `${height}px`
        }
    }, [value, textareaRef, autoresize])

    return (
        <div
            className={classNames('textarea', [className], { error: error?.length })}
        >
            {error && (
                <p className="textarea__error-text">
                    {error}
                </p>
            )}
            <textarea
                ref={textareaRef}
                className={classNames(['textarea__native', size])}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...otherProps}
            />
        </div>
    )
}
