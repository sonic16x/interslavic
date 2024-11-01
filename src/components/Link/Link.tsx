import classNames from 'classnames';

import './Link.scss';

interface ILinkProps {
    href: string;
    title?: string;
    target?: string;
    rel?: string;
    className?: string;
    children?: any;
}

export const Link = (
    {
        href,
        title,
        target,
        rel,
        className,
        children,
    }: ILinkProps,
) => {
    const clsName = classNames(['link', className]);

    return (
        <a
            className={clsName}
            href={href}
            title={title}
            target={target}
            rel={rel}
        >
            {children}
        </a>
    );
};
