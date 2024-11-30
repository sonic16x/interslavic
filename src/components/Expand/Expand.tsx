import classNames from 'classnames'
import React from 'react'

import './Expand.scss'

import ExpandIcon from './images/expand-icon.svg'

interface IExpandProps {
    className?: string;
    isExpanded?: boolean;
    onChange?: () => void;
    children?: React.ReactNode[];
}

export const Expand = (
    {
        className,
        isExpanded,
        onChange,
        children,
    }: IExpandProps,
) => (
    <div
        className={classNames(['expand', className], { expanded: isExpanded })}
    >
        <div
            className="expand__container"
        >
            {...children}
        </div>
        <div
            className="expand__button-wrap"
            onClick={() => onChange()}
        >
            <button
                className="expand__button"
                id="expand"
                type="button"
                aria-label="Expand"
                aria-expanded={isExpanded}
            >
                <ExpandIcon />
            </button>
        </div>
    </div>
)
