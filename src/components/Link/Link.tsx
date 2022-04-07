import classNames from 'classnames';
import { useEffect, useState } from 'react';

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
    const [isAvailable, setAvailable] = useState(false);

    useEffect(() => {
        try {
            fetch(href, {
                mode: 'no-cors',
                cache: 'no-cache',
            }).then((res) => {
                if (res) {
                    setAvailable(true);
                }
            });
        } catch (err) {

        }
    }, [href, setAvailable]);

    if (isAvailable) {
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
    }

    return null;
};
