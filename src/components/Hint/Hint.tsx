import cn from 'classnames'

import { Tooltip } from 'components/Tooltip'

import './Hint.scss'

interface IHintProps {
    title: string
    shortTitle: string
    className?: string
}

/** an underlined short text with its full form in a tooltip */
export const Hint = ({ title, shortTitle, className }: IHintProps) => (
    <Tooltip content={title}>
        <span className={cn('hint', className)}>{shortTitle}</span>
    </Tooltip>
)
