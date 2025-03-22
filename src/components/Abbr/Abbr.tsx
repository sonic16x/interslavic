import cn from 'classnames'
import { useState } from 'react'

import './Abbr.scss'

interface IAbbrProps {
    title: string
    shortTitle: string
    className?: string
}

export const Abbr = ({ title, shortTitle, className }: IAbbrProps) => {
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <abbr
            title={title}
            className={cn('abbr', className)}
            onClick={() => {
                setVisible(!visible)
                setTimeout(() => setVisible(false), 1500)
            }}
        >
            {shortTitle}
            <span className={cn('full', { visible })}>{title}</span>
        </abbr>
    )
}
