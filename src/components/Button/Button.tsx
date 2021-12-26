import classNames from 'classnames';

import './Button.scss';

interface IButtonProps {
    size?: 'S' | 'M' | 'L';
    href?: string;
    target?: string;
    onClick?: () => void;
    title: string;
    disabled?: boolean;
    fill?: boolean;
    className?: boolean;
    type?: 'primary' | 'error' | 'muted';
}

export const Button = (
    {
        size = 'M',
        href,
        type = 'primary',
        target,
        onClick,
        title,
        disabled,
        fill = true,
        className,
    }: IButtonProps,
) => {
    const clsName = classNames(['button', `button-${size}`, type, className], { disabled, fill });

    if (href) {
        return (
            <a
                className={clsName}
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
            className={clsName}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    );
};
