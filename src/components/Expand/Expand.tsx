import classNames from 'classnames';
import React from 'react';
import { useState } from 'react';

import './Expand.scss';

import ExpandIcon from './images/expand-icon.svg';

interface IExpandProps {
    className?: string;
    isExpanded?: boolean;
    onChange?: (value: boolean) => void;
    children?: React.ReactNode[];
}

export const Expand = (
    {
        className,
        isExpanded,
        onChange,
        children,
    }: IExpandProps,
) => {
    const [expanded, setExpanded] = useState<boolean>(isExpanded);
    const onClick = () => setExpanded(!expanded);

    return (
        <div
            className={classNames(['expand', className], { expanded })}
            onTransitionEnd={() => onChange(expanded)}
        >
            <div
                className="expand__container"
            >
                {...children}
            </div>
            <div
                className="expand__button-wrap"
                onClick={onClick}
            >
                <button
                    className="expand__button"
                    id="expand"
                    type="button"
                    aria-label="Expand"
                    aria-expanded={isExpanded}
                    onClick={onClick}
                >
                    <ExpandIcon />
                </button>
            </div>
        </div>
    )
};
