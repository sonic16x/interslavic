import classNames from 'classnames'

import './Link.scss'

interface ILinkProps {
    href: string;
    title?: string;
    id?: string;
    external?: boolean;
    rel?: string;
    className?: string;
    onClick?: (e: any) => void;
    children?: any;
}

export const Link = (
    {
        href,
        title,
        id,
        external = false,
        className,
        onClick,
        children,
    }: ILinkProps,
) => {
    const clsName = classNames(['link', className])

    return (
        <a
            className={clsName}
            href={href}
            title={title}
            onClick={onClick}
            id={id}
            target={external ? '_blank' : '_self'}
            rel={external ? 'noreferrer' : ''}
        >
            {children}
        </a>
    )
}
