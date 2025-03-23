import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './Hint.scss'

interface IHintProps {
    title: string
    shortTitle: string
    className?: string
    hideTimeout?: number
}

export const Hint = ({
    title,
    shortTitle,
    className,
    hideTimeout = 1500,
}: IHintProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const rect = ref?.current?.getBoundingClientRect()
    const mouseRef = useRef<boolean>(false)

    const hideElement = () => {
        setVisible(false)
    }

    useEffect(() => {
        document.addEventListener('scroll', hideElement, true)

        return () => {
            document.removeEventListener('scroll', hideElement, true)
            document.removeEventListener('click', hideElement, true)
        }
    }, [])

    useEffect(() => {
        if (show) {
            setVisible(true)
        }
    }, [show])

    return (
        <span
            ref={ref}
            className={cn('hint', className)}
            onClick={() => {
                if (!mouseRef.current) {
                    setShow(true)
                    setTimeout(hideElement, hideTimeout)

                    document.addEventListener('click', hideElement, true)

                }
            }}
            onMouseEnter={() => {
                mouseRef.current = true
                setShow(true)
            }}
            onMouseLeave={hideElement}
        >
            {shortTitle}
            {show && createPortal(
                (
                    <span
                        className={cn('hint-global', { visible })}
                        style={{
                            top: rect?.top,
                            left: rect?.left,
                        }}
                        onTransitionEnd={() => {
                            if (!visible) {
                                setShow(false)
                            }
                        }}
                    >
                        {title}
                    </span>
                ),
                document.getElementById('app')
            )}
        </span>
    )
}
