import classNames from 'classnames';

import './Button.scss';

interface IButtonProps {
    size?: 'S' | 'M' | 'L';
    href?: string;
    target?: string;
    onClick?: () => void;
    title: string;
    disabled?: boolean;
}

export const Button = (
    {
        size = 'M',
        href,
        target,
        onClick,
        title,
        disabled,
    }: IButtonProps,
) => {
    if (href) {
        return (
            <a
                className={classNames(['button', `button-${size.toLowerCase()}`], { disabled })}
                href={href}
                target={target}
                onClick={onClick}
            >
                {title}
            </a>
        );
    }

    return (
        <button
            className={classNames(['button', `button-${size.toLowerCase()}`], { disabled })}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    );
};
